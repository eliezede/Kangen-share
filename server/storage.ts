import {
  users,
  requests,
  reviews,
  follows,
  messageThreads,
  messages,
  availabilityRules,
  availabilityExceptions,
  notifications,
  type User,
  type UpsertUser,
  type Request,
  type InsertRequest,
  type UpdateRequest,
  type Review,
  type InsertReview,
  type Follow,
  type InsertFollow,
  type MessageThread,
  type Message,
  type InsertMessage,
  type AvailabilityRule,
  type InsertAvailabilityRule,
  type AvailabilityException,
  type InsertAvailabilityException,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, data: { role?: string; bio?: string; city?: string }): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  toggleUserStatus(id: string, isActive: boolean): Promise<void>;
  
  // Request operations
  getRequests(userId: string): Promise<Request[]>;
  getRequestById(id: string): Promise<Request | undefined>;
  createRequest(request: InsertRequest): Promise<Request>;
  updateRequest(id: string, update: UpdateRequest): Promise<Request | undefined>;
  
  // Review operations
  getReviewsByUser(userId: string): Promise<Review[]>;
  getAllReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  deleteReview(id: string): Promise<void>;
  
  // Follow operations
  createFollow(follow: InsertFollow): Promise<Follow>;
  deleteFollow(followerId: string, followeeId: string): Promise<void>;
  isFollowing(followerId: string, followeeId: string): Promise<boolean>;
  
  // Message operations
  getMessageThreads(userId: string): Promise<MessageThread[]>;
  getMessageThread(id: string): Promise<MessageThread | undefined>;
  getOrCreateThread(userAId: string, userBId: string): Promise<MessageThread>;
  getMessagesByThread(threadId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfile(id: string, data: { role?: string; bio?: string; city?: string }): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async toggleUserStatus(id: string, isActive: boolean): Promise<void> {
    await db.update(users).set({ isActive }).where(eq(users.id, id));
  }

  // Request operations
  async getRequests(userId: string): Promise<Request[]> {
    return db
      .select()
      .from(requests)
      .where(or(eq(requests.requesterId, userId), eq(requests.providerId, userId)))
      .orderBy(desc(requests.createdAt));
  }

  async getRequestById(id: string): Promise<Request | undefined> {
    const [request] = await db.select().from(requests).where(eq(requests.id, id));
    return request;
  }

  async createRequest(request: InsertRequest): Promise<Request> {
    const [newRequest] = await db.insert(requests).values(request).returning();
    return newRequest;
  }

  async updateRequest(id: string, update: UpdateRequest): Promise<Request | undefined> {
    const [updated] = await db
      .update(requests)
      .set({ ...update, updatedAt: new Date() })
      .where(eq(requests.id, id))
      .returning();
    return updated;
  }

  // Review operations
  async getReviewsByUser(userId: string): Promise<Review[]> {
    return db
      .select()
      .from(reviews)
      .where(eq(reviews.revieweeId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  async getAllReviews(): Promise<Review[]> {
    return db.select().from(reviews).orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    
    // Update user rating
    const result = await db
      .select({
        avgRating: sql<number>`AVG(${reviews.rating})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .where(eq(reviews.revieweeId, review.revieweeId));
    
    if (result[0]) {
      await db
        .update(users)
        .set({
          rating: result[0].avgRating,
          reviewCount: result[0].count,
        })
        .where(eq(users.id, review.revieweeId));
    }
    
    return newReview;
  }

  async deleteReview(id: string): Promise<void> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    if (review) {
      await db.delete(reviews).where(eq(reviews.id, id));
      
      // Recalculate user rating
      const result = await db
        .select({
          avgRating: sql<number>`AVG(${reviews.rating})`,
          count: sql<number>`COUNT(*)`,
        })
        .from(reviews)
        .where(eq(reviews.revieweeId, review.revieweeId));
      
      await db
        .update(users)
        .set({
          rating: result[0]?.avgRating || 0,
          reviewCount: result[0]?.count || 0,
        })
        .where(eq(users.id, review.revieweeId));
    }
  }

  // Follow operations
  async createFollow(follow: InsertFollow): Promise<Follow> {
    const [newFollow] = await db.insert(follows).values(follow).returning();
    return newFollow;
  }

  async deleteFollow(followerId: string, followeeId: string): Promise<void> {
    await db
      .delete(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followeeId, followeeId)));
  }

  async isFollowing(followerId: string, followeeId: string): Promise<boolean> {
    const [follow] = await db
      .select()
      .from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followeeId, followeeId)));
    return !!follow;
  }

  // Message operations
  async getMessageThreads(userId: string): Promise<MessageThread[]> {
    return db
      .select()
      .from(messageThreads)
      .where(or(eq(messageThreads.userAId, userId), eq(messageThreads.userBId, userId)))
      .orderBy(desc(messageThreads.lastMessageAt));
  }

  async getMessageThread(id: string): Promise<MessageThread | undefined> {
    const [thread] = await db.select().from(messageThreads).where(eq(messageThreads.id, id));
    return thread;
  }

  async getOrCreateThread(userAId: string, userBId: string): Promise<MessageThread> {
    const [existing] = await db
      .select()
      .from(messageThreads)
      .where(
        or(
          and(eq(messageThreads.userAId, userAId), eq(messageThreads.userBId, userBId)),
          and(eq(messageThreads.userAId, userBId), eq(messageThreads.userBId, userAId))
        )
      );
    
    if (existing) return existing;
    
    const [newThread] = await db
      .insert(messageThreads)
      .values({ userAId, userBId })
      .returning();
    return newThread;
  }

  async getMessagesByThread(threadId: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.threadId, threadId))
      .orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    
    // Update thread
    const thread = await this.getMessageThread(message.threadId);
    if (thread) {
      const updateData: any = { lastMessageAt: new Date() };
      if (thread.userAId === message.recipientId) {
        updateData.unreadForA = sql`${messageThreads.unreadForA} + 1`;
      } else {
        updateData.unreadForB = sql`${messageThreads.unreadForB} + 1`;
      }
      
      await db
        .update(messageThreads)
        .set(updateData)
        .where(eq(messageThreads.id, message.threadId));
    }
    
    return newMessage;
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(eq(notifications.id, id));
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(and(eq(notifications.userId, userId), sql`${notifications.readAt} IS NULL`));
  }
}

export const storage = new DatabaseStorage();
