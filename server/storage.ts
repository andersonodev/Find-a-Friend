import { 
  users, type User, type InsertUser,
  availability, type Availability, type InsertAvailability,
  bookings, type Booking, type InsertBooking,
  reviews, type Review, type InsertReview
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: number, stripeInfo: { customerId: string }): Promise<User>;
  
  // Amigo methods
  getAmigos(filters?: { location?: string, interests?: string[], date?: Date }): Promise<User[]>;
  getAmigoById(id: number): Promise<User | undefined>;
  
  // Availability methods
  getAvailabilityForUser(userId: number): Promise<Availability[]>;
  createAvailability(availability: InsertAvailability): Promise<Availability>;
  
  // Booking methods
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingById(id: number): Promise<Booking | undefined>;
  getBookingsByClient(clientId: number): Promise<Booking[]>;
  getBookingsByAmigo(amigoId: number): Promise<Booking[]>;
  updateBookingPaymentStatus(bookingId: number, status: string, paymentIntentId?: string): Promise<Booking>;
  
  // Review methods
  createReview(review: InsertReview): Promise<Review>;
  getReviewsForUser(userId: number): Promise<Review[]>;
  getAverageRatingForUser(userId: number): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private availabilities: Map<number, Availability>;
  private bookings: Map<number, Booking>;
  private reviews: Map<number, Review>;
  
  private userIdCounter: number;
  private availabilityIdCounter: number;
  private bookingIdCounter: number;
  private reviewIdCounter: number;

  constructor() {
    this.users = new Map();
    this.availabilities = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    
    this.userIdCounter = 1;
    this.availabilityIdCounter = 1;
    this.bookingIdCounter = 1;
    this.reviewIdCounter = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample amigos with different interests and locations
    const amigo1: User = {
      id: this.userIdCounter++,
      email: "ana.silva@example.com",
      username: "anasilva",
      password: "hashed_password",
      name: "Ana Silva",
      bio: "Apaixonada por música e cinema. Ótima companhia para eventos culturais e passeios pela cidade.",
      location: "Pinheiros, São Paulo",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      isVerified: true,
      isAmigo: true,
      interests: ["Música", "Cinema", "Arte"],
      hourlyRate: 150,
      createdAt: new Date(),
      stripeCustomerId: null
    };
    
    const amigo2: User = {
      id: this.userIdCounter++,
      email: "carlos.mendes@example.com",
      username: "carlosm",
      password: "hashed_password",
      name: "Carlos Mendes",
      bio: "Amante de esportes, gastronomia e tecnologia. Ótima companhia para jogos, restaurantes e eventos tech.",
      location: "Vila Madalena, São Paulo",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      isVerified: true,
      isAmigo: true,
      interests: ["Esportes", "Gastronomia", "Tecnologia"],
      hourlyRate: 180,
      createdAt: new Date(),
      stripeCustomerId: null
    };
    
    const amigo3: User = {
      id: this.userIdCounter++,
      email: "mariana.costa@example.com",
      username: "maricosta",
      password: "hashed_password",
      name: "Mariana Costa",
      bio: "Entusiasta de arte, viagem e gastronomia. Perfeita para eventos culturais e experiências gastronômicas.",
      location: "Moema, São Paulo",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
      isVerified: true,
      isAmigo: true,
      interests: ["Arte", "Viagem", "Gastronomia"],
      hourlyRate: 160,
      createdAt: new Date(),
      stripeCustomerId: null
    };
    
    const amigo4: User = {
      id: this.userIdCounter++,
      email: "rafael.oliveira@example.com",
      username: "rafoliv",
      password: "hashed_password",
      name: "Rafael Oliveira",
      bio: "Especialista em tecnologia e esportes. Acompanha eventos tech, esportivos e é ótimo para networking profissional.",
      location: "Itaim Bibi, São Paulo",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
      isVerified: true,
      isAmigo: true,
      interests: ["Tecnologia", "Esportes", "Networking"],
      hourlyRate: 200,
      createdAt: new Date(),
      stripeCustomerId: null
    };
    
    this.users.set(amigo1.id, amigo1);
    this.users.set(amigo2.id, amigo2);
    this.users.set(amigo3.id, amigo3);
    this.users.set(amigo4.id, amigo4);
    
    // Sample client user
    const client: User = {
      id: this.userIdCounter++,
      email: "joao.client@example.com",
      username: "joaoclient",
      password: "hashed_password",
      name: "João Silva",
      bio: "Looking for friends to hang out in São Paulo",
      location: "São Paulo",
      avatar: null,
      isVerified: true,
      isAmigo: false,
      interests: ["Música", "Tecnologia"],
      hourlyRate: null,
      createdAt: new Date(),
      stripeCustomerId: null
    };
    
    this.users.set(client.id, client);
    
    // Sample availabilities
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    for (const amigoId of [amigo1.id, amigo2.id, amigo3.id, amigo4.id]) {
      // Today availability
      const startToday = new Date(today);
      startToday.setHours(14, 0, 0, 0);
      
      const endToday = new Date(today);
      endToday.setHours(18, 0, 0, 0);
      
      const availToday: Availability = {
        id: this.availabilityIdCounter++,
        userId: amigoId,
        date: today,
        startTime: startToday,
        endTime: endToday
      };
      
      // Tomorrow availability
      const startTomorrow = new Date(tomorrow);
      startTomorrow.setHours(10, 0, 0, 0);
      
      const endTomorrow = new Date(tomorrow);
      endTomorrow.setHours(16, 0, 0, 0);
      
      const availTomorrow: Availability = {
        id: this.availabilityIdCounter++,
        userId: amigoId,
        date: tomorrow,
        startTime: startTomorrow,
        endTime: endTomorrow
      };
      
      // Next week availability
      const startNextWeek = new Date(nextWeek);
      startNextWeek.setHours(12, 0, 0, 0);
      
      const endNextWeek = new Date(nextWeek);
      endNextWeek.setHours(20, 0, 0, 0);
      
      const availNextWeek: Availability = {
        id: this.availabilityIdCounter++,
        userId: amigoId,
        date: nextWeek,
        startTime: startNextWeek,
        endTime: endNextWeek
      };
      
      this.availabilities.set(availToday.id, availToday);
      this.availabilities.set(availTomorrow.id, availTomorrow);
      this.availabilities.set(availNextWeek.id, availNextWeek);
    }
    
    // Sample bookings and reviews
    const booking1: Booking = {
      id: this.bookingIdCounter++,
      clientId: client.id,
      amigoId: amigo1.id,
      date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      startTime: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // 7 days ago at 2 PM
      endTime: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), // 7 days ago at 4 PM
      location: "Museum of Art, São Paulo",
      status: "completed",
      totalAmount: 300,
      paymentStatus: "paid",
      stripePaymentIntentId: "pi_mock_123456",
      createdAt: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
    };
    
    this.bookings.set(booking1.id, booking1);
    
    const review1: Review = {
      id: this.reviewIdCounter++,
      bookingId: booking1.id,
      reviewerId: client.id,
      revieweeId: amigo1.id,
      rating: 5,
      comment: "Ana was fantastic! Very knowledgeable about art and a great companion.",
      createdAt: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
    };
    
    this.reviews.set(review1.id, review1);
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = {
      ...userData,
      id,
      createdAt: new Date(),
      stripeCustomerId: null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserStripeInfo(userId: number, stripeInfo: { customerId: string }): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser: User = {
      ...user,
      stripeCustomerId: stripeInfo.customerId
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Amigo methods
  async getAmigos(filters?: { location?: string, interests?: string[], date?: Date }): Promise<User[]> {
    const amigos = Array.from(this.users.values())
      .filter(user => user.isAmigo);
    
    if (!filters) {
      return amigos;
    }
    
    let filteredAmigos = amigos;
    
    if (filters.location) {
      filteredAmigos = filteredAmigos.filter(amigo => 
        amigo.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    if (filters.interests && filters.interests.length > 0) {
      filteredAmigos = filteredAmigos.filter(amigo => 
        amigo.interests?.some(interest => 
          filters.interests!.includes(interest)
        )
      );
    }
    
    if (filters.date) {
      const availableAmigoIds = new Set(
        Array.from(this.availabilities.values())
          .filter(avail => {
            const availDate = new Date(avail.date);
            const filterDate = new Date(filters.date!);
            
            return availDate.getFullYear() === filterDate.getFullYear() &&
                   availDate.getMonth() === filterDate.getMonth() &&
                   availDate.getDate() === filterDate.getDate();
          })
          .map(avail => avail.userId)
      );
      
      filteredAmigos = filteredAmigos.filter(amigo => 
        availableAmigoIds.has(amigo.id)
      );
    }
    
    return filteredAmigos;
  }
  
  async getAmigoById(id: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (user && user.isAmigo) {
      return user;
    }
    return undefined;
  }
  
  // Availability methods
  async getAvailabilityForUser(userId: number): Promise<Availability[]> {
    return Array.from(this.availabilities.values())
      .filter(avail => avail.userId === userId);
  }
  
  async createAvailability(availabilityData: InsertAvailability): Promise<Availability> {
    const id = this.availabilityIdCounter++;
    const availability: Availability = {
      ...availabilityData,
      id
    };
    this.availabilities.set(id, availability);
    return availability;
  }
  
  // Booking methods
  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const booking: Booking = {
      ...bookingData,
      id,
      createdAt: new Date(),
      stripePaymentIntentId: null
    };
    this.bookings.set(id, booking);
    return booking;
  }
  
  async getBookingById(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
  
  async getBookingsByClient(clientId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.clientId === clientId);
  }
  
  async getBookingsByAmigo(amigoId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.amigoId === amigoId);
  }
  
  async updateBookingPaymentStatus(bookingId: number, status: string, paymentIntentId?: string): Promise<Booking> {
    const booking = await this.getBookingById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    
    const updatedBooking: Booking = {
      ...booking,
      paymentStatus: status,
      stripePaymentIntentId: paymentIntentId || booking.stripePaymentIntentId
    };
    
    this.bookings.set(bookingId, updatedBooking);
    return updatedBooking;
  }
  
  // Review methods
  async createReview(reviewData: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const review: Review = {
      ...reviewData,
      id,
      createdAt: new Date()
    };
    this.reviews.set(id, review);
    return review;
  }
  
  async getReviewsForUser(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.revieweeId === userId);
  }
  
  async getAverageRatingForUser(userId: number): Promise<number> {
    const reviews = await this.getReviewsForUser(userId);
    if (reviews.length === 0) {
      return 0;
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  }
}

export const storage = new MemStorage();
