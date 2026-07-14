// ─────────────────────────────────────────────────────────────
//  Mock Accounts  (2 users · 2 organizers · 1 admin)
// ─────────────────────────────────────────────────────────────
export const MOCK_ACCOUNTS = [
  {
    id: 'u1',
    name: 'Alice Johnson',
    email: 'alice@eventlogix.io',
    role: 'user',
    org: null,
    initials: 'AJ',
    avatar: null,
    joinedDate: 'Sep 15, 2024',
  },
  {
    id: 'u2',
    name: 'Bob Smith',
    email: 'bob@eventlogix.io',
    role: 'user',
    org: null,
    initials: 'BS',
    avatar: null,
    joinedDate: 'Oct 03, 2024',
  },
  {
    id: 'o1',
    name: 'Mariam Yasser',
    email: 'mariam@eventlogix.io',
    role: 'organizer',
    org: 'EventLogix Global Operations',
    initials: 'MY',
    avatar: null,
    joinedDate: 'Jan 10, 2023',
  },
  {
    id: 'o2',
    name: 'Dave Chen',
    email: 'dave@eventlogix.io',
    role: 'organizer',
    org: 'TechVentures Inc.',
    initials: 'DC',
    avatar: null,
    joinedDate: 'Mar 05, 2023',
  },
  {
    id: 'a1',
    name: 'System Admin',
    email: 'admin@eventlogix.io',
    role: 'admin',
    org: 'EventLogix Platform',
    initials: 'SA',
    avatar: null,
    joinedDate: 'Jan 01, 2023',
  },
];

// ─────────────────────────────────────────────────────────────
//  Events  (organizerId links to account id)
// ─────────────────────────────────────────────────────────────
export const MOCK_EVENTS = [
  {
    id: 1,
    organizerId: 'o1',
    title: 'Global Tech Summit 2025',
    date: 'Oct 15, 06:00 PM',
    registered: 12,
    capacity: 100,
    status: 'LIVE',
    tag: 'TRENDING EVENT',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
    location: 'Metropolitan Tech Center, New York, NY',
    price: 299.00,
    description: 'Join world-class industry leaders and innovators for a day of strategic discussions, workshops, and networking. This summit is designed for professionals looking to scale their event operations.',
    organizer: 'EventLogix Global Operations',
    rating: 4.8,
    reviews: 104,
    category: 'Tech',
  },
  {
    id: 2,
    organizerId: 'o1',
    title: 'Annual Shareholder Meeting',
    date: 'Nov 02, 10:00 AM',
    registered: 0,
    capacity: 500,
    status: 'OPENING SOON',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80',
    location: 'Grand Ballroom, Chicago',
    price: 0,
    description: 'The Annual Shareholder Meeting brings together key stakeholders to review financial performance, strategic direction, and key initiatives.',
    organizer: 'EventLogix Global Operations',
    category: 'Business',
  },
  {
    id: 3,
    organizerId: 'o1',
    title: 'Marketing Mastery Bootcamp',
    date: 'Oct 08, 08:30 AM',
    registered: 30,
    capacity: 30,
    status: 'CLOSED',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&q=80',
    location: 'Online (Zoom)',
    price: 149.00,
    description: 'An intensive bootcamp covering modern marketing strategies, digital campaigns, and brand building.',
    organizer: 'EventLogix Global Operations',
    category: 'Marketing',
  },
  {
    id: 4,
    organizerId: 'o1',
    title: 'Global Enterprise Leadership Summit 2024',
    date: 'Thu, Oct 24, 2024 · 09:00 AM – 05:30 PM EST',
    registered: 60,
    capacity: 100,
    status: 'LIVE',
    tag: 'TRENDING EVENT',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&q=80',
    location: '450 Innovation Way, Suite 200, New York, NY',
    price: 299.00,
    description: 'Join world-class industry leaders and innovators for a day of strategic discussions, workshops, and networking.',
    organizer: 'EventLogix Global Operations',
    rating: 4.8,
    reviews: 104,
    category: 'Leadership',
  },
  {
    id: 5,
    organizerId: 'o2',
    title: 'Startup Pitch Night',
    date: 'Nov 15, 06:00 PM',
    registered: 45,
    capacity: 80,
    status: 'LIVE',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&q=80',
    location: 'Innovation Hub, San Francisco',
    price: 50.00,
    description: 'Watch the next generation of startups pitch their ideas to top investors.',
    organizer: 'TechVentures Inc.',
    category: 'Startup',
  },
  {
    id: 6,
    organizerId: 'o2',
    title: 'AI & Machine Learning Conference',
    date: 'Dec 01, 09:00 AM',
    registered: 210,
    capacity: 300,
    status: 'LIVE',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80',
    location: 'Tech Campus, Seattle',
    price: 399.00,
    description: 'Three days of deep-dive sessions on the latest advances in AI and machine learning.',
    organizer: 'TechVentures Inc.',
    rating: 4.6,
    reviews: 88,
    category: 'Tech',
  },
];

// ─────────────────────────────────────────────────────────────
//  Registrations  (userId + eventId linkage)
// ─────────────────────────────────────────────────────────────
export const MOCK_REGISTRATIONS = [
  // Alice's registrations
  { id: 'reg-1', userId: 'u1', eventId: 1, ticketType: 'VIP All-Access', seat: 'A-42', status: 'Confirmed', date: 'Oct 01, 2024' },
  { id: 'reg-2', userId: 'u1', eventId: 4, ticketType: 'Standard Pass', seat: null,   status: 'Attended',  date: 'Sep 15, 2024' },
  { id: 'reg-3', userId: 'u1', eventId: 3, ticketType: 'Standard Pass', seat: null,   status: 'Cancelled', date: 'Sep 20, 2024' },

  // Bob's registrations
  { id: 'reg-4', userId: 'u2', eventId: 2, ticketType: 'Standard Pass', seat: null,   status: 'Pending',   date: 'Oct 03, 2024' },
  { id: 'reg-5', userId: 'u2', eventId: 5, ticketType: 'Standard Pass', seat: null,   status: 'Confirmed', date: 'Oct 05, 2024' },
  { id: 'reg-6', userId: 'u2', eventId: 6, ticketType: 'VIP All-Access', seat: 'B-12', status: 'Attended', date: 'Aug 10, 2024' },
];

// ─────────────────────────────────────────────────────────────
//  Feedback  (userId + eventId linkage)
// ─────────────────────────────────────────────────────────────
export const MOCK_FEEDBACK = [
  { id: 'fb-1', userId: 'u1', eventId: 4, name: 'Alice Johnson', initials: 'AJ', rating: 5, date: 'Oct 24, 2024', comment: '"Excellent summit, very informative. The networking sessions were particularly well organized."' },
  { id: 'fb-2', userId: 'u2', eventId: 4, name: 'Bob Smith',     initials: 'BS', rating: 4, date: 'Oct 23, 2024', comment: '"Great content, though I wish the breakout rooms had more time for Q&A. Overall a fantastic experience!"' },
  { id: 'fb-3', userId: 'u2', eventId: 6, name: 'Bob Smith',     initials: 'BS', rating: 5, date: 'Nov 02, 2024', comment: '"The AI sessions were cutting-edge. Best conference I\'ve attended this year."' },
];

// ─────────────────────────────────────────────────────────────
//  Registrants  (attendee list for ManageEventPage / organizer view)
//  These represent check-in records for events, scoped per event.
// ─────────────────────────────────────────────────────────────
export const MOCK_REGISTRANTS = [
  // Event 1 (Mariam's Global Tech Summit) attendees
  { id: 'att-1', eventId: 1, userId: 'u1', name: 'Alice Johnson',  email: 'alice@eventlogix.io',       initials: 'AJ', ticket: 'VIP All-Access', payment: 'Paid',     status: 'Checked In' },
  { id: 'att-2', eventId: 1, userId: null,  name: 'Robert Smith',   email: 'robert.smith@corp.com',     initials: 'RS', ticket: 'Standard Pass', payment: 'Pending',  status: 'Waiting'    },
  { id: 'att-3', eventId: 1, userId: null,  name: 'Michael Lee',    email: 'ml.registration@org.net',   initials: 'ML', ticket: 'Speaker Access', payment: 'Paid',    status: 'Waitlist'   },
  { id: 'att-4', eventId: 1, userId: null,  name: 'Sarah Johnson',  email: 'sarah.j@tech.com',          initials: 'SJ', ticket: 'Standard Pass', payment: 'Paid',     status: 'Checked In' },
  { id: 'att-5', eventId: 1, userId: null,  name: 'Tom Wilson',     email: 'tom.wilson@startup.io',     initials: 'TW', ticket: 'Standard Pass', payment: 'Refunded', status: 'Cancelled'  },

  // Event 5 (Dave's Startup Pitch Night) attendees
  { id: 'att-6', eventId: 5, userId: 'u2', name: 'Bob Smith',      email: 'bob@eventlogix.io',         initials: 'BS', ticket: 'Standard Pass', payment: 'Paid',     status: 'Checked In' },
  { id: 'att-7', eventId: 5, userId: null,  name: 'Emma Collins',   email: 'emma.c@ventures.io',        initials: 'EC', ticket: 'VIP All-Access', payment: 'Paid',   status: 'Checked In' },
];

// ─────────────────────────────────────────────────────────────
//  Requests  (organizerId linkage)
// ─────────────────────────────────────────────────────────────
export const MOCK_REQUESTS = [
  { id: 'REQ-8825', organizerId: 'o1', event: 'Global Tech Summit 2025',          requester: 'EventLogix Global Operations', date: 'Oct 01', status: 'Pending'  },
  { id: 'REQ-8790', organizerId: 'o1', event: 'AI Conference 2024',               requester: 'EventLogix Global Operations', date: 'Sep 28', status: 'Approved' },
  { id: 'REQ-8830', organizerId: 'o1', event: 'Marketing Bootcamp',               requester: 'EventLogix Global Operations', date: 'Oct 03', status: 'Rejected' },
  { id: 'REQ-8812', organizerId: 'o2', event: 'Startup Pitch Night',              requester: 'TechVentures Inc.',            date: 'Sep 30', status: 'Pending'  },
  { id: 'REQ-8799', organizerId: 'o2', event: 'Leadership Summit',                requester: 'TechVentures Inc.',            date: 'Sep 25', status: 'Approved' },
];

// ─────────────────────────────────────────────────────────────
//  Legacy exports kept for backward-compat during migration
// ─────────────────────────────────────────────────────────────
export const mockUser        = MOCK_ACCOUNTS[2]; // Mariam
export const mockEvents      = MOCK_EVENTS;
export const mockRegistrants = MOCK_REGISTRANTS;
export const mockRequests    = MOCK_REQUESTS;
export const mockFeedback    = MOCK_FEEDBACK;
