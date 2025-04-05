import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey().autoIncrement(),
  email: text("email").notNull().unique(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  name: text("name"),
  bio: text("bio"),
  location: text("location"),
  avatar: text("avatar"),
  isVerified: integer("is_verified").default(0),
  isAmigo: integer("is_amigo").default(0),
  interests: text("interests").array(),
  hourlyRate: integer("hourly_rate"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  about: text("about"),
  reviewCount: integer("review_count").default(0),
  averageRating: real("average_rating").default(0),
});

export const availability = sqliteTable("availability", {
  id: integer("id").primaryKey().autoIncrement(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey().autoIncrement(),
  clientId: integer("client_id").notNull().references(() => users.id),
  amigoId: integer("amigo_id").notNull().references(() => users.id),
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull().default("pending"),
  totalAmount: integer("total_amount").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey().autoIncrement(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  reviewerId: integer("reviewer_id").notNull().references(() => users.id),
  revieweeId: integer("reviewee_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true, stripeCustomerId: true });

export const insertAvailabilitySchema = createInsertSchema(availability)
  .omit({ id: true });

export const insertBookingSchema = createInsertSchema(bookings)
  .omit({ id: true, createdAt: true, stripePaymentIntentId: true });

export const insertReviewSchema = createInsertSchema(reviews)
  .omit({ id: true, createdAt: true });

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Select types
export type User = typeof users.$inferSelect;
export type Availability = typeof availability.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Review = typeof reviews.$inferSelect;

// Custom schemas for validation
export const registerUserSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const searchSchema = z.object({
  location: z.string().optional(),
  date: z.string().optional(),
  interest: z.string().optional()
});
