import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { loginSchema, searchSchema, insertUserSchema, registerUserSchema, insertBookingSchema, insertReviewSchema } from "@shared/schema";
import { ZodError } from "zod";
import Stripe from "stripe";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handling middleware
  const handleError = (err: Error, res: Response) => {
    console.error(err);
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors,
      });
    }
    
    return res.status(500).json({ message: err.message || "Server error" });
  };

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      // Create user in our backend database
      const newUser = await storage.createUser({
        email: userData.email,
        username: userData.username,
        password: userData.password, // In a real app, this would be hashed
        name: userData.name,
        bio: userData.bio,
        location: userData.location,
        avatar: userData.avatar,
        isVerified: false,
        isAmigo: userData.isAmigo || false,
        interests: userData.interests || [],
        hourlyRate: userData.hourlyRate,
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      handleError(error as Error, res);
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(credentials.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // In a real app, we would compare hashed passwords
      // This is a simplified version for demo purposes
      if (user.password !== credentials.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      // In a real app, you would create a JWT token or session
      res.json(userWithoutPassword);
    } catch (error) {
      handleError(error as Error, res);
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id, 10);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      handleError(error as Error, res);
    }
  });

  // Amigo routes
  app.get("/api/amigos", async (req, res) => {
    try {
      const { location, interest, date } = req.query;
      
      const filters = searchSchema.parse({
        location: location as string | undefined,
        interest: interest as string | undefined,
        date: date as string | undefined
      });
      
      const interestsArray = filters.interest ? [filters.interest] : undefined;
      const dateObj = filters.date ? new Date(filters.date) : undefined;
      
      const amigos = await storage.getAmigos({
        location: filters.location,
        interests: interestsArray,
        date: dateObj
      });
      
      // For each amigo, fetch the average rating
      const amigosWithRatings = await Promise.all(
        amigos.map(async (amigo) => {
          const { password, ...amigoWithoutPassword } = amigo;
          const averageRating = await storage.getAverageRatingForUser(amigo.id);
          const reviews = await storage.getReviewsForUser(amigo.id);
          
          return {
            ...amigoWithoutPassword,
            averageRating,
            reviewCount: reviews.length
          };
        })
      );
      
      res.json(amigosWithRatings);
    } catch (error) {
      handleError(error as Error, res);
    }
  });

  app.get("/api/amigos/:id", async (req, res) => {
    try {
      const amigoId = parseInt(req.params.id, 10);
      
      const amigo = await storage.getAmigoById(amigoId);
      if (!amigo) {
        return res.status(404).json({ message: "Amigo not found" });
      }
      
      const { password, ...amigoWithoutPassword } = amigo;
      
      // Get availability
      const availability = await storage.getAvailabilityForUser(amigoId);
      
      // Get reviews
      const reviews = await storage.getReviewsForUser(amigoId);
      
      // Get average rating
      const averageRating = await storage.getAverageRatingForUser(amigoId);
      
      res.json({
        ...amigoWithoutPassword,
        availability,
        reviews,
        averageRating,
        reviewCount: reviews.length
      });
    } catch (error) {
      handleError(error as Error, res);
    }
  });

  // Booking routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Check if the amigo exists
      const amigo = await storage.getAmigoById(bookingData.amigoId);
      if (!amigo) {
        return res.status(404).json({ message: "Amigo not found" });
      }
      
      // Check if the client exists
      const client = await storage.getUser(bookingData.clientId);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      // Create the booking
      const booking = await storage.createBooking(bookingData);
      
      res.status(201).json(booking);
    } catch (error) {
      handleError(error as Error, res);
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id, 10);
      
      const booking = await storage.getBookingById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      handleError(error as Error, res);
    }
  });

  app.get("/api/users/:userId/bookings", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      
      // Check if the user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get bookings based on user role
      let bookings: any[] = [];
      
      if (user.isAmigo) {
        bookings = await storage.getBookingsByAmigo(userId);
      } else {
        bookings = await storage.getBookingsByClient(userId);
      }
      
      res.json(bookings);
    } catch (error) {
      handleError(error as Error, res);
    }
  });

  // Review routes
  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      
      // Check if the booking exists
      const booking = await storage.getBookingById(reviewData.bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if reviewer and reviewee exist
      const reviewer = await storage.getUser(reviewData.reviewerId);
      if (!reviewer) {
        return res.status(404).json({ message: "Reviewer not found" });
      }
      
      const reviewee = await storage.getUser(reviewData.revieweeId);
      if (!reviewee) {
        return res.status(404).json({ message: "Reviewee not found" });
      }
      
      // Create the review
      const review = await storage.createReview(reviewData);
      
      res.status(201).json(review);
    } catch (error) {
      handleError(error as Error, res);
    }
  });

  app.get("/api/users/:userId/reviews", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      
      // Check if the user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const reviews = await storage.getReviewsForUser(userId);
      
      res.json(reviews);
    } catch (error) {
      handleError(error as Error, res);
    }
  });

  // Payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { bookingId } = req.body;
      
      if (!bookingId) {
        return res.status(400).json({ message: "Booking ID is required" });
      }
      
      // Get the booking details
      const booking = await storage.getBookingById(parseInt(bookingId, 10));
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: booking.totalAmount * 100, // Amount in cents
        currency: "brl",
        description: `Booking #${booking.id} - RentAFriend`,
        metadata: {
          bookingId: booking.id.toString(),
          clientId: booking.clientId.toString(),
          amigoId: booking.amigoId.toString()
        }
      });
      
      // Update the booking with the payment intent ID
      await storage.updateBookingPaymentStatus(
        booking.id, 
        "pending", 
        paymentIntent.id
      );
      
      res.json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      handleError(error as Error, res);
    }
  });

  app.post("/api/payment-webhooks", async (req, res) => {
    try {
      const event = req.body;
      
      // Handle different event types
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object;
          const bookingId = parseInt(paymentIntent.metadata.bookingId, 10);
          
          // Update booking payment status
          await storage.updateBookingPaymentStatus(bookingId, "paid", paymentIntent.id);
          break;
          
        case "payment_intent.payment_failed":
          const failedPaymentIntent = event.data.object;
          const failedBookingId = parseInt(failedPaymentIntent.metadata.bookingId, 10);
          
          // Update booking payment status
          await storage.updateBookingPaymentStatus(failedBookingId, "failed", failedPaymentIntent.id);
          break;
      }
      
      res.json({ received: true });
    } catch (error) {
      handleError(error as Error, res);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
