import { eq, ilike, and, inArray, sql } from 'drizzle-orm';
import { 
  users, availability, bookings, reviews,
  User, Availability, Booking, Review,
  InsertUser, InsertAvailability, InsertBooking, InsertReview
} from '@shared/schema';
import { IStorage } from './storage';
import { db } from './db';

export class PostgresStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(userData: InsertUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  async updateUserStripeInfo(userId: number, stripeInfo: { customerId: string }): Promise<User> {
    const result = await db
      .update(users)
      .set({ stripeCustomerId: stripeInfo.customerId })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  // Amigo methods
  async getAmigos(filters?: { location?: string, interests?: string[], date?: Date }): Promise<User[]> {
    // For date filtering, we need to do a separate query with a join
    if (filters?.date) {
      const dateStart = new Date(filters.date);
      dateStart.setHours(0, 0, 0, 0);
      
      const dateEnd = new Date(filters.date);
      dateEnd.setHours(23, 59, 59, 999);
      
      // Find users who have availability on the given date
      const usersWithAvailability = await db
        .select({ userId: availability.userId })
        .from(availability)
        .where(and(
          sql`${availability.date} >= ${dateStart}`,
          sql`${availability.date} <= ${dateEnd}`
        ));
      
      // Get the user IDs
      const userIds = usersWithAvailability.map(row => row.userId);
      
      if (userIds.length === 0) {
        // If no users have availability on that date, return empty array
        return [];
      }
      
      // Build conditions array
      const conditions = [
        eq(users.isAmigo, true),
        inArray(users.id, userIds)
      ];
      
      // Add additional filters
      if (filters.location) {
        conditions.push(ilike(users.location, `%${filters.location}%`));
      }
      
      if (filters.interests && filters.interests.length > 0) {
        const interestsCondition = sql`${users.interests} && array[${filters.interests.join(',')}]::text[]`;
        conditions.push(interestsCondition);
      }
      
      // Execute query with all conditions
      const result = await db
        .select()
        .from(users)
        .where(and(...conditions));
      
      return result;
    } else {
      // Build conditions array for non-date filtering
      const conditions = [eq(users.isAmigo, true)];
      
      // Add additional filters
      if (filters?.location) {
        conditions.push(ilike(users.location, `%${filters.location}%`));
      }
      
      if (filters?.interests && filters.interests.length > 0) {
        const interestsCondition = sql`${users.interests} && array[${filters.interests.join(',')}]::text[]`;
        conditions.push(interestsCondition);
      }
      
      // Execute query with all conditions
      const result = await db
        .select()
        .from(users)
        .where(and(...conditions));
      
      return result;
    }
  }

  async getAmigoById(id: number): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.id, id),
          eq(users.isAmigo, true)
        )
      );
    return result[0];
  }

  // Availability methods
  async getAvailabilityForUser(userId: number): Promise<Availability[]> {
    return await db
      .select()
      .from(availability)
      .where(eq(availability.userId, userId));
  }

  async createAvailability(availabilityData: InsertAvailability): Promise<Availability> {
    const result = await db
      .insert(availability)
      .values(availabilityData)
      .returning();
    return result[0];
  }

  // Booking methods
  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const result = await db
      .insert(bookings)
      .values(bookingData)
      .returning();
    return result[0];
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    const result = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    return result[0];
  }

  async getBookingsByClient(clientId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.clientId, clientId));
  }

  async getBookingsByAmigo(amigoId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.amigoId, amigoId));
  }

  async updateBookingPaymentStatus(bookingId: number, status: string, paymentIntentId?: string): Promise<Booking> {
    const updateData: Partial<Booking> = { 
      paymentStatus: status
    };
    
    if (paymentIntentId) {
      updateData.stripePaymentIntentId = paymentIntentId;
    }
    
    const result = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, bookingId))
      .returning();
    return result[0];
  }

  // Review methods
  async createReview(reviewData: InsertReview): Promise<Review> {
    const result = await db
      .insert(reviews)
      .values(reviewData)
      .returning();
    return result[0];
  }

  async getReviewsForUser(userId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.revieweeId, userId));
  }

  async getAverageRatingForUser(userId: number): Promise<number> {
    const userReviews = await this.getReviewsForUser(userId);
    
    if (userReviews.length === 0) {
      return 0;
    }
    
    const totalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / userReviews.length;
  }
}