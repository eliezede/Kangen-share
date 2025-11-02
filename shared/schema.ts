import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  pgEnum,
  real,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User roles enum
export const userRoleEnum = pgEnum("user_role", ["user", "provider", "admin"]);

// Request status enum
export const requestStatusEnum = pgEnum("request_status", [
  "pending",
  "accepted",
  "rejected",
  "completed",
  "cancelled",
]);

// Availability exception type enum
export const exceptionTypeEnum = pgEnum("exception_type", ["add", "remove"]);

// Notification type enum
export const notificationTypeEnum = pgEnum("notification_type", [
  "request_created",
  "request_accepted",
  "request_rejected",
  "request_completed",
  "new_message",
  "new_review",
  "new_follower",
]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").notNull().default("user"),
  bio: text("bio"),
  city: varchar("city"),
  lat: real("lat"),
  lng: real("lng"),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  requestsCreated: many(requests, { relationName: "requester" }),
  requestsProvided: many(requests, { relationName: "provider" }),
  reviews: many(reviews, { relationName: "reviewer" }),
  reviewsReceived: many(reviews, { relationName: "reviewee" }),
  followers: many(follows, { relationName: "followee" }),
  following: many(follows, { relationName: "follower" }),
  messagesSent: many(messages, { relationName: "sender" }),
  availabilityRules: many(availabilityRules),
  availabilityExceptions: many(availabilityExceptions),
  notifications: many(notifications),
}));

// Follows table
export const follows = pgTable(
  "follows",
  {
    followerId: varchar("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    followeeId: varchar("followee_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique().on(table.followerId, table.followeeId),
  ]
);

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "follower",
  }),
  followee: one(users, {
    fields: [follows.followeeId],
    references: [users.id],
    relationName: "followee",
  }),
}));

// Message threads table
export const messageThreads = pgTable("message_threads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userAId: varchar("user_a_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  userBId: varchar("user_b_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lastMessageAt: timestamp("last_message_at"),
  unreadForA: integer("unread_for_a").notNull().default(0),
  unreadForB: integer("unread_for_b").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messageThreadsRelations = relations(messageThreads, ({ one, many }) => ({
  userA: one(users, {
    fields: [messageThreads.userAId],
    references: [users.id],
  }),
  userB: one(users, {
    fields: [messageThreads.userBId],
    references: [users.id],
  }),
  messages: many(messages),
}));

// Messages table
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id").notNull().references(() => messageThreads.id, { onDelete: "cascade" }),
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  recipientId: varchar("recipient_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  thread: one(messageThreads, {
    fields: [messages.threadId],
    references: [messageThreads.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
  }),
}));

// Requests table
export const requests = pgTable("requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requesterId: varchar("requester_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  providerId: varchar("provider_id").references(() => users.id, { onDelete: "set null" }),
  qtyLiters: real("qty_liters").notNull(),
  locationText: text("location_text").notNull(),
  windowStart: timestamp("window_start").notNull(),
  windowEnd: timestamp("window_end").notNull(),
  notes: text("notes"),
  status: requestStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const requestsRelations = relations(requests, ({ one, many }) => ({
  requester: one(users, {
    fields: [requests.requesterId],
    references: [users.id],
    relationName: "requester",
  }),
  provider: one(users, {
    fields: [requests.providerId],
    references: [users.id],
    relationName: "provider",
  }),
  reviews: many(reviews),
}));

// Reviews table
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull().references(() => requests.id, { onDelete: "cascade" }),
  reviewerId: varchar("reviewer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  revieweeId: varchar("reviewee_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  request: one(requests, {
    fields: [reviews.requestId],
    references: [requests.id],
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
    relationName: "reviewer",
  }),
  reviewee: one(users, {
    fields: [reviews.revieweeId],
    references: [users.id],
    relationName: "reviewee",
  }),
}));

// Availability rules table
export const availabilityRules = pgTable("availability_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rruleText: text("rrule_text").notNull(),
  timezone: varchar("timezone").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  startTime: varchar("start_time").notNull(),
  endTime: varchar("end_time").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const availabilityRulesRelations = relations(availabilityRules, ({ one }) => ({
  user: one(users, {
    fields: [availabilityRules.userId],
    references: [users.id],
  }),
}));

// Availability exceptions table
export const availabilityExceptions = pgTable("availability_exceptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  startTime: varchar("start_time").notNull(),
  endTime: varchar("end_time").notNull(),
  type: exceptionTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const availabilityExceptionsRelations = relations(availabilityExceptions, ({ one }) => ({
  user: one(users, {
    fields: [availabilityExceptions.userId],
    references: [users.id],
  }),
}));

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  payloadJson: jsonb("payload_json").notNull(),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// Insert schemas and types
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rating: true,
  reviewCount: true,
  isActive: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const updateUserProfileSchema = z.object({
  role: z.enum(["user", "provider", "admin"]).optional(),
  bio: z.string().optional(),
  city: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const insertFollowSchema = createInsertSchema(follows).omit({
  createdAt: true,
});

export const insertRequestSchema = createInsertSchema(requests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  providerId: true,
});

export const updateRequestSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected", "completed", "cancelled"]).optional(),
  providerId: z.string().optional(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
}).extend({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

export const insertAvailabilityRuleSchema = createInsertSchema(availabilityRules).omit({
  id: true,
  createdAt: true,
});

export const insertAvailabilityExceptionSchema = createInsertSchema(availabilityExceptions).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

// Export types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;

export type Follow = typeof follows.$inferSelect;
export type InsertFollow = z.infer<typeof insertFollowSchema>;

export type MessageThread = typeof messageThreads.$inferSelect;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Request = typeof requests.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type UpdateRequest = z.infer<typeof updateRequestSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type AvailabilityRule = typeof availabilityRules.$inferSelect;
export type InsertAvailabilityRule = z.infer<typeof insertAvailabilityRuleSchema>;

export type AvailabilityException = typeof availabilityExceptions.$inferSelect;
export type InsertAvailabilityException = z.infer<typeof insertAvailabilityExceptionSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
