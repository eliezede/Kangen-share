import { db } from "./db";
import { 
  users, 
  requests, 
  reviews, 
  follows, 
  messageThreads, 
  messages, 
  availabilityRules,
  availabilityExceptions,
  notifications 
} from "@shared/schema";
import { sql } from "drizzle-orm";

const DEMO_USERS = [
  {
    id: "demo-admin-1",
    username: "Sarah Admin",
    email: "sarah@kangenlocal.com",
    role: "admin" as const,
    bio: "Platform administrator helping build a healthy community",
    location: "San Francisco, CA",
    lat: 37.7749,
    lng: -122.4194,
    profilePicture: null,
  },
  {
    id: "demo-provider-1",
    username: "Mike's Kangen",
    email: "mike@kangenwater.com",
    role: "provider" as const,
    bio: "Sharing pure Kangen water in the Mission District for 5+ years. Happy to help new folks discover the benefits!",
    location: "San Francisco, CA",
    lat: 37.7599,
    lng: -122.4148,
    profilePicture: null,
  },
  {
    id: "demo-provider-2",
    username: "Lisa's Water Hub",
    email: "lisa@kangen.net",
    role: "provider" as const,
    bio: "Family-run water share in Berkeley. We're passionate about health and community wellness.",
    location: "Berkeley, CA",
    lat: 37.8715,
    lng: -122.2730,
    profilePicture: null,
  },
  {
    id: "demo-provider-3",
    username: "David's Alkaline",
    email: "david@alkaline.com",
    role: "provider" as const,
    bio: "New to sharing but excited to help! Available most evenings and weekends.",
    location: "Oakland, CA",
    lat: 37.8044,
    lng: -122.2712,
    profilePicture: null,
  },
  {
    id: "demo-user-1",
    username: "Emma Johnson",
    email: "emma@example.com",
    role: "user" as const,
    bio: "Health enthusiast looking to try Kangen water",
    location: "San Francisco, CA",
    lat: 37.7849,
    lng: -122.4094,
    profilePicture: null,
  },
  {
    id: "demo-user-2",
    username: "James Chen",
    email: "james@example.com",
    role: "user" as const,
    bio: "Heard great things about alkaline water, want to experience it myself!",
    location: "San Francisco, CA",
    lat: 37.7699,
    lng: -122.4369,
    profilePicture: null,
  },
  {
    id: "demo-user-3",
    username: "Olivia Martinez",
    email: "olivia@example.com",
    role: "user" as const,
    bio: "Looking for sustainable water options in my neighborhood",
    location: "Berkeley, CA",
    lat: 37.8651,
    lng: -122.2585,
    profilePicture: null,
  },
];

async function seed() {
  console.log("🌱 Starting seed process...");

  try {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    // Clear existing data
    console.log("🗑️  Clearing existing demo data...");
    await db.delete(notifications).where(sql`user_id LIKE 'demo-%'`);
    await db.delete(messages).where(sql`sender_id LIKE 'demo-%'`);
    await db.delete(messageThreads).where(sql`user_a_id LIKE 'demo-%' OR user_b_id LIKE 'demo-%'`);
    await db.delete(reviews).where(sql`reviewer_id LIKE 'demo-%'`);
    await db.delete(availabilityExceptions).where(sql`user_id LIKE 'demo-%'`);
    await db.delete(availabilityRules).where(sql`user_id LIKE 'demo-%'`);
    await db.delete(follows).where(sql`follower_id LIKE 'demo-%'`);
    await db.delete(requests).where(sql`requester_id LIKE 'demo-%'`);
    await db.delete(users).where(sql`id LIKE 'demo-%'`);

    // Insert users
    console.log("👥 Creating demo users...");
    await db.insert(users).values(DEMO_USERS);

    // Create follow relationships
    console.log("🤝 Creating follow relationships...");
    await db.insert(follows).values([
      { followerId: "demo-user-1", followeeId: "demo-provider-1" },
      { followerId: "demo-user-1", followeeId: "demo-provider-2" },
      { followerId: "demo-user-2", followeeId: "demo-provider-1" },
      { followerId: "demo-user-2", followeeId: "demo-provider-3" },
      { followerId: "demo-user-3", followeeId: "demo-provider-2" },
      { followerId: "demo-user-3", followeeId: "demo-provider-3" },
    ]);

    // Create availability rules for providers
    console.log("📅 Creating availability schedules...");
    await db.insert(availabilityRules).values([
      {
        userId: "demo-provider-1",
        rruleText: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",
        timezone: "America/Los_Angeles",
        startTime: "09:00",
        endTime: "18:00",
        startDate: new Date("2025-01-01"),
        description: "Weekdays 9AM-6PM",
      },
      {
        userId: "demo-provider-2",
        rruleText: "FREQ=WEEKLY;BYDAY=SA,SU",
        timezone: "America/Los_Angeles",
        startTime: "10:00",
        endTime: "16:00",
        startDate: new Date("2025-01-01"),
        description: "Weekends 10AM-4PM",
      },
      {
        userId: "demo-provider-3",
        rruleText: "FREQ=WEEKLY;BYDAY=MO,WE,FR",
        timezone: "America/Los_Angeles",
        startTime: "17:00",
        endTime: "21:00",
        startDate: new Date("2025-01-01"),
        description: "Mon/Wed/Fri Evenings",
      },
    ]);

    // Create availability exceptions
    console.log("📅 Creating availability exceptions...");
    const nextFriday = new Date(now.getTime() + (5 - now.getDay() + 7) * 24 * 60 * 60 * 1000);
    const nextSaturday = new Date(now.getTime() + (6 - now.getDay() + 7) * 24 * 60 * 60 * 1000);
    const twoWeeksSaturday = new Date(now.getTime() + (6 - now.getDay() + 14) * 24 * 60 * 60 * 1000);
    const nextTuesday = new Date(now.getTime() + (2 - now.getDay() + 7) * 24 * 60 * 60 * 1000);
    
    await db.insert(availabilityExceptions).values([
      {
        userId: "demo-provider-1",
        date: nextFriday,
        startTime: "09:00",
        endTime: "18:00",
        type: "remove",
      },
      {
        userId: "demo-provider-1",
        date: nextSaturday,
        startTime: "10:00",
        endTime: "14:00",
        type: "add",
      },
      {
        userId: "demo-provider-2",
        date: twoWeeksSaturday,
        startTime: "10:00",
        endTime: "16:00",
        type: "remove",
      },
      {
        userId: "demo-provider-3",
        date: nextTuesday,
        startTime: "09:00",
        endTime: "13:00",
        type: "add",
      },
    ]);

    // Create water requests in various states
    console.log("💧 Creating water requests...");

    const requestsData = [
      {
        id: "demo-req-1",
        requesterId: "demo-user-1",
        providerId: "demo-provider-1",
        qtyLiters: 7.5,
        locationText: "Mission District, SF",
        windowStart: new Date(weekAgo.getTime() + 9 * 60 * 60 * 1000),
        windowEnd: new Date(weekAgo.getTime() + 12 * 60 * 60 * 1000),
        notes: "Morning pickup preferred",
        status: "completed" as const,
        createdAt: weekAgo,
      },
      {
        id: "demo-req-2",
        requesterId: "demo-user-2",
        providerId: "demo-provider-1",
        qtyLiters: 3.8,
        locationText: "SOMA, SF",
        windowStart: new Date(twoDaysAgo.getTime() + 14 * 60 * 60 * 1000),
        windowEnd: new Date(twoDaysAgo.getTime() + 17 * 60 * 60 * 1000),
        notes: "Afternoon works best",
        status: "completed" as const,
        createdAt: twoDaysAgo,
      },
      {
        id: "demo-req-3",
        requesterId: "demo-user-3",
        providerId: "demo-provider-2",
        qtyLiters: 11.4,
        locationText: "North Berkeley",
        windowStart: new Date(tomorrow.getTime() + 10 * 60 * 60 * 1000),
        windowEnd: new Date(tomorrow.getTime() + 16 * 60 * 60 * 1000),
        notes: "Weekend pickup",
        status: "accepted" as const,
        createdAt: yesterday,
      },
      {
        id: "demo-req-4",
        requesterId: "demo-user-1",
        providerId: null,
        qtyLiters: 3.8,
        locationText: "Castro, SF",
        windowStart: new Date(tomorrow.getTime() + 18 * 60 * 60 * 1000),
        windowEnd: new Date(tomorrow.getTime() + 21 * 60 * 60 * 1000),
        notes: "Evening preferred",
        status: "pending" as const,
        createdAt: now,
      },
      {
        id: "demo-req-5",
        requesterId: "demo-user-2",
        providerId: "demo-provider-3",
        qtyLiters: 7.5,
        locationText: "Downtown Oakland",
        windowStart: new Date(twoDaysLater.getTime() + 9 * 60 * 60 * 1000),
        windowEnd: new Date(twoDaysLater.getTime() + 21 * 60 * 60 * 1000),
        notes: "Flexible on timing",
        status: "accepted" as const,
        createdAt: yesterday,
      },
    ];

    await db.insert(requests).values(requestsData);

    // Create reviews for completed requests
    console.log("⭐ Creating reviews...");
    await db.insert(reviews).values([
      {
        requestId: "demo-req-1",
        reviewerId: "demo-user-1",
        revieweeId: "demo-provider-1",
        rating: 5,
        comment: "Amazing experience! Mike was so friendly and helpful. The water quality is excellent and pickup was super convenient. Highly recommend!",
      },
      {
        requestId: "demo-req-2",
        reviewerId: "demo-user-2",
        revieweeId: "demo-provider-1",
        rating: 5,
        comment: "Great service, very punctual and professional. The water tastes great!",
      },
    ]);

    // Create message threads and messages
    console.log("💬 Creating message threads...");
    await db.insert(messageThreads).values([
      {
        id: "demo-thread-1",
        userAId: "demo-user-1",
        userBId: "demo-provider-1",
        lastMessageAt: now,
        unreadForA: 0,
        unreadForB: 0,
      },
      {
        id: "demo-thread-2",
        userAId: "demo-user-3",
        userBId: "demo-provider-2",
        lastMessageAt: yesterday,
        unreadForA: 1,
        unreadForB: 0,
      },
    ]);

    console.log("💬 Creating messages...");
    await db.insert(messages).values([
      {
        threadId: "demo-thread-1",
        senderId: "demo-user-1",
        recipientId: "demo-provider-1",
        body: "Hi Mike! Thanks for providing the water last week. It was great!",
        createdAt: new Date(now.getTime() - 60 * 60 * 1000),
      },
      {
        threadId: "demo-thread-1",
        senderId: "demo-provider-1",
        recipientId: "demo-user-1",
        body: "You're very welcome! Happy to help anytime. Feel free to reach out when you need more!",
        createdAt: new Date(now.getTime() - 30 * 60 * 1000),
      },
      {
        threadId: "demo-thread-2",
        senderId: "demo-user-3",
        recipientId: "demo-provider-2",
        body: "Hi Lisa! I'm interested in picking up 3 gallons this weekend. Are you available Saturday afternoon?",
        createdAt: yesterday,
      },
      {
        threadId: "demo-thread-2",
        senderId: "demo-provider-2",
        recipientId: "demo-user-3",
        body: "Hi Olivia! Saturday afternoon works perfectly. I'm free from 2-4pm. Does that work for you?",
        createdAt: new Date(yesterday.getTime() + 2 * 60 * 60 * 1000),
      },
    ]);

    // Create notifications
    console.log("🔔 Creating notifications...");
    await db.insert(notifications).values([
      {
        userId: "demo-provider-1",
        type: "request_created",
        payloadJson: { 
          requestId: "demo-req-4",
          requesterName: "Emma Johnson",
          quantity: "1 gallon",
          location: "Castro, SF"
        },
      },
      {
        userId: "demo-provider-2",
        type: "new_message",
        payloadJson: { 
          threadId: "demo-thread-2",
          senderName: "Olivia Martinez"
        },
      },
      {
        userId: "demo-user-1",
        type: "request_accepted",
        payloadJson: { 
          requestId: "demo-req-1",
          providerName: "Mike's Kangen"
        },
        readAt: weekAgo,
      },
    ]);

    console.log("✅ Seed completed successfully!");
    console.log("\n📊 Demo data summary:");
    console.log(`  - ${DEMO_USERS.length} users (1 admin, 3 providers, 3 regular users)`);
    console.log(`  - 6 follow relationships`);
    console.log(`  - 3 availability schedules`);
    console.log(`  - 4 availability exceptions (blocks and special openings)`);
    console.log(`  - 5 water requests (2 completed, 2 accepted, 1 pending)`);
    console.log(`  - 2 reviews`);
    console.log(`  - 2 message threads with 4 messages`);
    console.log(`  - 3 notifications`);
    console.log("\n🔐 Demo accounts:");
    console.log("  Admin: sarah@kangenlocal.com");
    console.log("  Providers: mike@kangenwater.com, lisa@kangen.net, david@alkaline.com");
    console.log("  Users: emma@example.com, james@example.com, olivia@example.com");

  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      console.log("\n✨ All done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Fatal error:", error);
      process.exit(1);
    });
}

export { seed };
