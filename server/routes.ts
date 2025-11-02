import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertRequestSchema,
  updateRequestSchema,
  insertReviewSchema,
  insertFollowSchema,
  insertMessageSchema,
  updateUserProfileSchema,
  insertAvailabilityRuleSchema,
  insertAvailabilityExceptionSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User routes
  app.get('/api/users/:userId', async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put('/api/users/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { firstName, lastName, phone, address, bio, city, email } = req.body;
      const user = await storage.updateUser(userId, { 
        firstName, 
        lastName, 
        phone, 
        address, 
        bio, 
        city,
        email 
      });
      res.json(user);
    } catch (error: any) {
      console.error("Error updating user:", error);
      res.status(400).json({ message: error.message || "Failed to update user" });
    }
  });

  app.patch('/api/users/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = updateUserProfileSchema.parse(req.body);
      const user = await storage.updateUserProfile(userId, validatedData);
      res.json(user);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      res.status(400).json({ message: error.message || "Failed to update profile" });
    }
  });

  // Request routes
  app.get('/api/requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requests = await storage.getRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.get('/api/requests/recent', async (req, res) => {
    try {
      const userId = (req as any).user?.claims?.sub || "";
      const requests = await storage.getRequests(userId);
      res.json(requests.slice(0, 10));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.post('/api/requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertRequestSchema.parse({
        ...req.body,
        requesterId: userId,
      });
      const request = await storage.createRequest(validatedData);
      res.json(request);
    } catch (error: any) {
      console.error("Error creating request:", error);
      res.status(400).json({ message: error.message || "Failed to create request" });
    }
  });

  app.patch('/api/requests/:requestId', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = updateRequestSchema.parse(req.body);
      const request = await storage.updateRequest(req.params.requestId, validatedData);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.json(request);
    } catch (error: any) {
      console.error("Error updating request:", error);
      res.status(400).json({ message: error.message || "Failed to update request" });
    }
  });

  // Provider routes
  app.get('/api/providers', async (req, res) => {
    try {
      const currentUserId = (req as any).user?.claims?.sub;
      const allUsers = await storage.getAllUsers();
      const providers = allUsers.filter(u => u.role === "provider" && u.isActive);
      
      // Add isFollowing status
      if (currentUserId) {
        const providersWithFollow = await Promise.all(
          providers.map(async (provider) => ({
            ...provider,
            isFollowing: await storage.isFollowing(currentUserId, provider.id),
          }))
        );
        res.json(providersWithFollow);
      } else {
        res.json(providers);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
      res.status(500).json({ message: "Failed to fetch providers" });
    }
  });

  app.get('/api/providers/featured', async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const providers = allUsers
        .filter(u => u.role === "provider" && u.isActive)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6);
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch providers" });
    }
  });

  // Review routes
  app.get('/api/reviews/user/:userId', async (req, res) => {
    try {
      const reviews = await storage.getReviewsByUser(req.params.userId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        reviewerId: userId,
      });
      const review = await storage.createReview(validatedData);
      res.json(review);
    } catch (error: any) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: error.message || "Failed to create review" });
    }
  });

  // Follow routes
  app.post('/api/follows', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertFollowSchema.parse({
        ...req.body,
        followerId: userId,
      });
      const follow = await storage.createFollow(validatedData);
      
      // Create notification for the followed user
      await storage.createNotification({
        userId: validatedData.followeeId,
        type: "new_follower",
        payload: { followerId: userId }
      });
      
      res.json(follow);
    } catch (error: any) {
      console.error("Error creating follow:", error);
      res.status(400).json({ message: error.message || "Failed to follow user" });
    }
  });

  app.delete('/api/follows/:followeeId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteFollow(userId, req.params.followeeId);
      res.json({ message: "Unfollowed successfully" });
    } catch (error) {
      console.error("Error unfollowing:", error);
      res.status(500).json({ message: "Failed to unfollow user" });
    }
  });

  // Message routes
  app.get('/api/messages/threads', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const threads = await storage.getMessageThreads(userId);
      res.json(threads);
    } catch (error) {
      console.error("Error fetching threads:", error);
      res.status(500).json({ message: "Failed to fetch message threads" });
    }
  });

  app.get('/api/messages/thread/:threadId', isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getMessagesByThread(req.params.threadId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages/thread', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { otherUserId } = req.body;
      if (!otherUserId) {
        return res.status(400).json({ message: "otherUserId is required" });
      }
      const thread = await storage.getOrCreateThread(userId, otherUserId);
      res.json(thread);
    } catch (error: any) {
      console.error("Error creating thread:", error);
      res.status(400).json({ message: error.message || "Failed to create thread" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertMessageSchema.parse({
        ...req.body,
        senderId: userId,
      });
      const message = await storage.createMessage(validatedData);
      
      // Get thread to find recipient
      const thread = await storage.getMessageThread(validatedData.threadId);
      if (thread) {
        const recipientId = thread.userAId === userId ? thread.userBId : thread.userAId;
        
        // Create notification for the recipient
        await storage.createNotification({
          userId: recipientId,
          type: "new_message",
          payload: { senderId: userId, threadId: validatedData.threadId }
        });
      }
      
      res.json(message);
    } catch (error: any) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: error.message || "Failed to send message" });
    }
  });

  // Notification routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch('/api/notifications/:notificationId/read', isAuthenticated, async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.notificationId);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.patch('/api/notifications/mark-all-read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.markAllNotificationsAsRead(userId);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  // Dashboard stats
  app.get('/api/stats/dashboard', async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      res.json({
        totalRequests: 0,
        activeProviders: allUsers.filter(u => u.role === "provider" && u.isActive).length,
        completedRequests: 0,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Admin routes
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      if (currentUser?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch('/api/admin/users/:userId/toggle', isAuthenticated, async (req: any, res) => {
    try {
      const currentUserId = req.user.claims.sub;
      const currentUser = await storage.getUser(currentUserId);
      
      if (currentUser?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.toggleUserStatus(req.params.userId, req.body.isActive);
      res.json({ message: "User status updated" });
    } catch (error) {
      console.error("Error toggling user status:", error);
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  app.get('/api/admin/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      if (currentUser?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.delete('/api/admin/reviews/:reviewId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      if (currentUser?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteReview(req.params.reviewId);
      res.json({ message: "Review deleted" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // Availability routes
  app.get('/api/availability/rules', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const rules = await storage.getAvailabilityRules(userId);
      res.json(rules);
    } catch (error) {
      console.error("Error fetching availability rules:", error);
      res.status(500).json({ message: "Failed to fetch availability rules" });
    }
  });

  app.post('/api/availability/rules', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertAvailabilityRuleSchema.parse({
        ...req.body,
        userId,
      });
      const rule = await storage.createAvailabilityRule(validatedData);
      res.json(rule);
    } catch (error: any) {
      console.error("Error creating availability rule:", error);
      res.status(400).json({ message: error.message || "Failed to create availability rule" });
    }
  });

  app.delete('/api/availability/rules/:ruleId', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteAvailabilityRule(req.params.ruleId);
      res.json({ message: "Availability rule deleted" });
    } catch (error) {
      console.error("Error deleting availability rule:", error);
      res.status(500).json({ message: "Failed to delete availability rule" });
    }
  });

  app.get('/api/availability/exceptions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const exceptions = await storage.getAvailabilityExceptions(userId);
      res.json(exceptions);
    } catch (error) {
      console.error("Error fetching availability exceptions:", error);
      res.status(500).json({ message: "Failed to fetch availability exceptions" });
    }
  });

  app.post('/api/availability/exceptions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertAvailabilityExceptionSchema.parse({
        ...req.body,
        userId,
      });
      const exception = await storage.createAvailabilityException(validatedData);
      res.json(exception);
    } catch (error: any) {
      console.error("Error creating availability exception:", error);
      res.status(400).json({ message: error.message || "Failed to create availability exception" });
    }
  });

  app.delete('/api/availability/exceptions/:exceptionId', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteAvailabilityException(req.params.exceptionId);
      res.json({ message: "Availability exception deleted" });
    } catch (error) {
      console.error("Error deleting availability exception:", error);
      res.status(500).json({ message: "Failed to delete availability exception" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store WebSocket connections by user ID
  const connections = new Map<string, WebSocket>();

  wss.on('connection', (ws: WebSocket, req: any) => {
    console.log('WebSocket client connected');

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        console.log('Received WebSocket message:', data);
        
        // Broadcast to all connected clients
        if (data.type === 'new_message') {
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(message);
            }
          });
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Export wss for use in message creation
  (app as any).wss = wss;

  return httpServer;
}

