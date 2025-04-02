import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
const { Pool } = pg;
import { users, availability, bookings, reviews } from '@shared/schema';
import { MemStorage } from './storage';
import { PostgresStorage } from './pgStorage';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize drizzle
const db = drizzle(pool, { schema: { users, availability, bookings, reviews } });

// Function to create all tables if they don't exist
export async function createTables() {
  try {
    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        bio TEXT,
        location TEXT,
        interests TEXT[],
        avatar TEXT,
        hourly_rate INTEGER,
        is_amigo BOOLEAN DEFAULT FALSE,
        is_verified BOOLEAN DEFAULT FALSE,
        stripe_customer_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create availability table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS availability (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        date TIMESTAMP NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL
      );
    `);

    // Create bookings table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL REFERENCES users(id),
        amigo_id INTEGER NOT NULL REFERENCES users(id),
        date TIMESTAMP NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        location TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        total_amount INTEGER NOT NULL,
        payment_status TEXT NOT NULL DEFAULT 'pending',
        stripe_payment_intent_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create reviews table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER NOT NULL REFERENCES bookings(id),
        reviewer_id INTEGER NOT NULL REFERENCES users(id),
        reviewee_id INTEGER NOT NULL REFERENCES users(id),
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

// Function to migrate sample data from memory storage to PostgreSQL
export async function migrateSampleData() {
  try {
    const memStorage = new MemStorage();
    const pgStorage = new PostgresStorage();

    // Check if users table is empty
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length === 0) {
      console.log('Migrating sample data to PostgreSQL...');
      
      // Get all sample users from memory storage
      const sampleUsers = await memStorage.getAmigos();
      
      // Add a sample client user too
      const sampleClient = await memStorage.getUser(5);
      
      if (sampleClient) {
        sampleUsers.push(sampleClient);
      }
      
      // Insert users into PostgreSQL
      for (const user of sampleUsers) {
        const { id, createdAt, ...userData } = user;
        await pgStorage.createUser(userData);
      }
      
      // For each amigo, migrate their availability
      for (const user of sampleUsers.filter(u => u.isAmigo)) {
        const availabilities = await memStorage.getAvailabilityForUser(user.id);
        
        // Get the newly created user ID from PostgreSQL
        const pgUser = await pgStorage.getUserByEmail(user.email);
        
        if (pgUser) {
          for (const avail of availabilities) {
            const { id, ...availData } = avail;
            await pgStorage.createAvailability({
              ...availData,
              userId: pgUser.id
            });
          }
        }
      }
      
      // Migrate bookings
      const pgClient = await pgStorage.getUserByEmail(sampleClient!.email);
      const pgAmigo = await pgStorage.getUserByEmail(sampleUsers[0].email);
      
      if (pgClient && pgAmigo) {
        const clientBookings = await memStorage.getBookingsByClient(sampleClient!.id);
        
        for (const booking of clientBookings) {
          const { id, createdAt, stripePaymentIntentId, ...bookingData } = booking;
          await pgStorage.createBooking({
            ...bookingData,
            clientId: pgClient.id,
            amigoId: pgAmigo.id
          });
        }
        
        // Get the newly created booking
        const pgBookings = await pgStorage.getBookingsByClient(pgClient.id);
        
        // Migrate reviews
        if (pgBookings.length > 0) {
          const memReviews = await memStorage.getReviewsForUser(sampleUsers[0].id);
          
          for (const review of memReviews) {
            const { id, createdAt, reviewerId, revieweeId, ...reviewData } = review;
            await pgStorage.createReview({
              ...reviewData,
              bookingId: pgBookings[0].id,
              reviewerId: pgClient.id,
              revieweeId: pgAmigo.id
            });
          }
        }
      }
      
      console.log('Sample data migration completed');
    } else {
      console.log('Database already contains data. Skipping sample data migration.');
    }
  } catch (error) {
    console.error('Error migrating sample data:', error);
    throw error;
  }
}

// Main migration function
export async function runMigrations() {
  try {
    await createTables();
    await migrateSampleData();
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === new URL(import.meta.url).href) {
  runMigrations()
    .then(() => console.log('Migration script completed'))
    .catch(error => console.error('Migration script failed:', error));
}