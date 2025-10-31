# Kangen Share Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based (Community & Sharing Economy)

**Primary References:**
- **Airbnb**: Trust-building through profiles, reviews, and imagery
- **Nextdoor**: Community-focused interactions and local connections
- **TaskRabbit**: Request-provider matching patterns

**Key Design Principles:**
1. **Trust First**: Prominent user photos, clear ratings, and transparent availability
2. **Community Warmth**: Approachable, friendly interface that encourages connection
3. **Clarity in Action**: Clear request states, obvious CTAs, minimal friction

---

## Typography

**Font Families:**
- Primary: Inter (Google Fonts) - Clean, highly legible for UI elements
- Secondary: Merriweather (Google Fonts) - Warm, trustworthy for user-generated content

**Hierarchy:**
- Hero/Page Titles: 2xl to 4xl, font-bold
- Section Headers: xl to 2xl, font-semibold
- Card Titles: lg, font-semibold
- Body Text: base, font-normal
- Captions/Meta: sm, font-normal
- Labels: sm, font-medium, uppercase tracking-wide

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24

**Common Patterns:**
- Component padding: p-4 (mobile), p-6 (tablet), p-8 (desktop)
- Section spacing: space-y-8 (mobile), space-y-12 (desktop)
- Card gaps: gap-4 (mobile), gap-6 (desktop)
- Content max-width: max-w-7xl for full sections, max-w-4xl for focused content

**Grid System:**
- Profile cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-6
- Request listings: Single column with rich cards
- Dashboard: grid-cols-1 lg:grid-cols-3 (sidebar + main + activity)

---

## Component Library

### Navigation
**Primary Navigation:**
- Sticky header with logo, main nav links, notification bell (with badge), user avatar dropdown
- Mobile: Hamburger menu transitioning to slide-over panel
- Search bar integrated in header for provider/location search

**Tab Navigation:**
- Used for Profile sections (About, Availability, Reviews), Request filters (All, Pending, Active, Completed)
- Border-bottom active state, clean typography

### User Profiles
**Profile Card (Grid View):**
- Square or circular avatar (w-20 h-20 or w-24 h-24)
- Name (font-semibold, lg)
- City with location icon
- Star rating with review count (text-sm)
- "Follow" button (secondary style)
- Hover: Subtle elevation increase

**Profile Header (Detail View):**
- Large circular avatar (w-32 h-32)
- Name, bio, city, member since
- Star rating prominently displayed
- Follow/Message CTAs
- Stats row: Followers, Following, Requests Completed

### Request Cards
**Request Listing Card:**
- Status badge (top-right: pending/accepted/completed with color coding via border or icon)
- Requester info: small avatar + name + rating
- Request details: quantity (bold), location, time window (with calendar icon)
- Notes preview (truncated, text-sm)
- Action buttons: "Accept" (primary), "Decline" (secondary) OR "View Details" depending on state
- Timestamp (text-sm, muted)

**Request Detail View:**
- Full conversation thread style
- Request summary card at top
- Chat interface below
- Action panel sticky at bottom

### Availability Calendar
**Interactive Calendar:**
- Week view (default) and month view toggle
- Time slot grid: 30-minute or 1-hour blocks
- Selected slots: filled visual treatment
- Hover states on selectable slots
- Recurrence controls: Weekly repeat checkbox, Monthly options dropdown
- Exception overrides shown with distinct visual indicator

**Provider Search with Availability:**
- Filter panel: Date picker, time range slider, distance radius
- Results show mini-calendar preview with available slots highlighted
- Distance badge on each provider card

### Messaging
**Thread List:**
- Avatar + name + last message preview
- Unread indicator (badge with count, bold text)
- Timestamp (right-aligned, text-sm)
- Active thread: background treatment

**Chat Interface:**
- Messages aligned left (received) / right (sent)
- Avatars on received messages only
- Timestamp below each message group
- Input bar: textarea + send button (icon), sticky at bottom
- Read receipts: small checkmark icons

**Per-Request Chat:**
- Embedded within request detail view
- Same chat UI but context-aware (request info pinned at top)

### Reviews
**Review Card:**
- Reviewer avatar + name
- Star rating (filled/unfilled stars)
- Date
- Review text (expandable if long)
- Associated request reference (subtle link)

**Review Form:**
- Star rating selector (interactive, large touch targets)
- Textarea for comment
- Character counter
- Submit button disabled until rating selected

### Social Features
**Follow Button:**
- States: Follow (primary outline), Following (filled with checkmark), hover shows "Unfollow"
- Compact size (px-4 py-2)

**Follower/Following Lists:**
- Grid of profile cards
- Quick-follow buttons on each card

### Notifications
**Notification Bell:**
- Badge with unread count
- Dropdown panel showing recent notifications
- Notification types: Request updates, New messages, New reviews, Follow activity
- Each notification: icon, text, timestamp, link to relevant content
- "Mark all as read" action at bottom

**In-App Toast Notifications:**
- Slide in from top-right
- Auto-dismiss after 4 seconds
- Success (with checkmark icon), Error (with alert icon), Info styles

### Forms
**Request Water Form:**
- Clear step indicator if multi-step
- Quantity input (number with unit label "liters")
- Location input (text with map icon, optional autocomplete)
- Time window: Date picker + time range selectors
- Notes: textarea (rows-4)
- Submit: "Submit Request" (primary button, full-width on mobile)

**All Form Inputs:**
- Consistent height (h-12 for text inputs)
- Border styling with focus states (ring treatment)
- Label above, helper text below
- Error states with red border and error message

### Admin Dashboard
**Moderation Panel:**
- Table view of flagged content
- Quick actions: Disable user, Remove review, Dismiss flag
- Bulk actions: Checkboxes + action bar
- Filter/search controls

**Stats Overview:**
- Card grid showing key metrics (Total Users, Active Requests, Reviews This Month)
- Each card: Large number (3xl), label below, trend indicator

### Data Display
**Stats/Metrics:**
- Presented in cards with icons
- Large numbers (2xl to 4xl font size)
- Descriptive labels below

**Tables (Admin):**
- Zebra striping for readability
- Sticky header row
- Responsive: Stack to cards on mobile
- Action column (right-aligned) with icon buttons

---

## Animations

**Minimal, Purposeful Animations:**
- Page transitions: Simple fade-in (200ms)
- Hover states: Subtle scale (scale-105, duration-200)
- Toast notifications: Slide-in from right
- Dropdown menus: Fade + slight translateY
- **Avoid:** Scroll-triggered animations, complex transitions, distracting effects

---

## Images

**Hero Section:** 
Full-width hero with background image showing community/water sharing in action (people connecting, water being shared, friendly atmosphere). Hero should be 60-70vh on desktop, 50vh on mobile. Overlay with semi-transparent dark gradient for text readability.

**Hero Content:**
- Large headline: "Share Kangen Water with Your Community"
- Subheadline explaining the platform
- Primary CTA: "Get Started" button with blur background treatment
- Secondary CTA: "Browse Providers" (outline style)

**Profile Photos:**
- Circular avatars throughout
- Placeholder patterns for users without photos (colorful gradients or initials)

**Request/Activity Feed:**
- Small thumbnails where relevant (provider avatars)
- No large imagery in request cards (focus on information density)

**Other Images:**
- About/How It Works section: Illustrated steps (3 columns) showing request process
- Trust indicators: Testimonial section with user photos