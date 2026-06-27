import { User, Tweet, Conversation, Message, Notification, Trend, List } from '../types';

export const CURRENT_USER: User = {
  id: 'current_user',
  name: 'Jenny Wilson',
  username: 'jennywilson',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  cover: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600',
  bio: 'Product Designer • UI/UX Enthusiast • Coffee Lover ☕. Crafting beautiful mobile interfaces.',
  website: 'jennywilson.com',
  location: 'San Francisco, CA',
  joinDate: 'Joined March 2021',
  followersCount: 12500,
  followingCount: 482,
  isVerified: true,
  isFollowing: false,
};

export const MOCK_USERS: Record<string, User> = {
  '1': {
    id: '1',
    name: 'Elon Musk',
    username: 'elonmusk',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
    bio: 'Mars & Earth, Engineering & Design',
    website: 'x.com',
    followersCount: 168000000,
    followingCount: 89,
    isVerified: true,
    isFollowing: true,
  },
  '2': {
    id: '2',
    name: 'React Native',
    username: 'reactnative',
    avatar: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150',
    cover: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=600',
    bio: 'Create high-quality mobile apps using React and JavaScript.',
    website: 'reactnative.dev',
    followersCount: 850000,
    followingCount: 15,
    isVerified: true,
    isFollowing: true,
  },
  '3': {
    id: '3',
    name: 'Mom',
    username: 'mom_love',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    followersCount: 12,
    followingCount: 45,
    isVerified: false,
    isFollowing: true,
  },
  '4': {
    id: '4',
    name: 'Anna Smith',
    username: 'annasmith',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    bio: 'Travel blogger & freelance developer. Catching flights and writing code.',
    website: 'annatravels.io',
    followersCount: 3400,
    followingCount: 512,
    isVerified: false,
    isFollowing: false,
  },
  '5': {
    id: '5',
    name: 'Daniel King',
    username: 'danielking',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Software Engineer @ Google. Tech enthusiast, gamer, and movie geek.',
    followersCount: 920,
    followingCount: 400,
    isVerified: false,
    isFollowing: true,
  },
  '6': {
    id: '6',
    name: 'Emily Green',
    username: 'emilygreen',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    followersCount: 1520,
    followingCount: 980,
    isVerified: false,
    isFollowing: false,
  },
  '7': {
    id: '7',
    name: 'TechCrunch',
    username: 'techcrunch',
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150',
    bio: 'Technology news and analysis with a focus on founders and startup teams.',
    website: 'techcrunch.com',
    followersCount: 10200000,
    followingCount: 853,
    isVerified: true,
    isFollowing: true,
  }
};

export const INITIAL_TWEETS: Tweet[] = [
  {
    id: 't1',
    user: MOCK_USERS['1'],
    content: 'The future belongs to those who build. What are you building today?',
    timestamp: '2h',
    likes: 42300,
    reposts: 8900,
    comments: 2450,
    views: 1200000,
    isLiked: false,
    isReposted: false,
    isBookmarked: false,
    media: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600'],
  },
  {
    id: 't2',
    user: MOCK_USERS['2'],
    content: 'We are excited to share that React Native 0.86 is now officially stable! It includes outstanding performance optimizations, faster startup times, and full support for the new architecture out-of-the-box. Check out the blog post for migration guides.',
    timestamp: '4h',
    likes: 1200,
    reposts: 310,
    comments: 87,
    views: 45000,
    isLiked: true,
    isReposted: false,
    isBookmarked: true,
    linkPreview: {
      title: 'React Native 0.86 Stable Release | React Native',
      description: 'Announcing the stable release of React Native 0.86. Explore the new architecture, performance gains, and how to upgrade your app today.',
      url: 'https://reactnative.dev/blog/0.86-stable',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    },
  },
  {
    id: 't3',
    user: MOCK_USERS['7'],
    content: 'Which technology are you most excited to learn in 2026? Vote below and let us know your thoughts in the replies!',
    timestamp: '6h',
    likes: 350,
    reposts: 42,
    comments: 112,
    views: 15400,
    isLiked: false,
    isReposted: false,
    isBookmarked: false,
    poll: {
      id: 'poll1',
      options: [
        { text: 'React Native (New Arch)', votes: 840, voters: [] },
        { text: 'Flutter 4.0', votes: 410, voters: [] },
        { text: 'SwiftUI & Kotlin Multiplatform', votes: 620, voters: [] },
        { text: 'AI Native Coding Agents', votes: 1250, voters: [] },
      ],
      totalVotes: 3120,
      expiryTime: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    },
  },
  {
    id: 't4',
    user: MOCK_USERS['4'],
    content: 'Just arrived in Tokyo! 🇯🇵 The city feels absolutely alive, especially at night. Can\'t wait to explore some local coffee spots and work from here for the next two weeks.',
    timestamp: '1d',
    likes: 890,
    reposts: 54,
    comments: 29,
    views: 22000,
    isLiked: false,
    isReposted: false,
    isBookmarked: false,
    media: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
    ],
  },
  {
    id: 't5',
    user: MOCK_USERS['5'],
    content: 'Clean code is code that is easy to read and easy to change. Focus on readability first, performance second. Your future self (and team members) will thank you.',
    timestamp: '2d',
    likes: 450,
    reposts: 120,
    comments: 18,
    views: 11200,
    isLiked: false,
    isReposted: false,
    isBookmarked: false,
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    participant: MOCK_USERS['3'], // Mom
    lastMessage: "Call me when you're free.",
    unreadCount: 0,
    lastUpdated: '10:09 AM',
    pinned: true,
  },
  {
    id: 'c2',
    participant: MOCK_USERS['4'], // Anna
    lastMessage: 'Check out this photo from Kyoto!',
    unreadCount: 2,
    lastUpdated: '11:25 AM',
    pinned: false,
  },
  {
    id: 'c3',
    participant: MOCK_USERS['5'], // Daniel
    lastMessage: "Got it. I'll check the design and update you soon.",
    unreadCount: 0,
    lastUpdated: 'Yesterday',
    pinned: false,
  },
  {
    id: 'c4',
    participant: MOCK_USERS['6'], // Emily
    lastMessage: 'Are you still coming tonight?',
    unreadCount: 5,
    lastUpdated: '2 days ago',
    pinned: false,
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'c1': [
    { id: 'm1_1', senderId: '3', receiverId: 'current_user', text: 'Hi sweetie! Hope you are having a productive day.', timestamp: '9:00 AM', status: 'read' },
    { id: 'm1_2', senderId: 'current_user', receiverId: '3', text: 'Hey Mom! Yes, just finishing up a design sprint.', timestamp: '9:15 AM', status: 'read' },
    { id: 'm1_3', senderId: '3', receiverId: 'current_user', text: "Call me when you're free.", timestamp: '10:09 AM', status: 'read' },
  ],
  'c2': [
    { id: 'm2_1', senderId: 'current_user', receiverId: '4', text: 'Hey Anna! How is Japan?', timestamp: '11:00 AM', status: 'read' },
    { id: 'm2_2', senderId: '4', receiverId: 'current_user', text: 'Absolutely amazing! Kyoto is stunning.', timestamp: '11:15 AM', status: 'read' },
    { id: 'm2_3', senderId: '4', receiverId: 'current_user', text: 'Check out this photo from Kyoto!', timestamp: '11:25 AM', status: 'delivered', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400' },
  ],
  'c3': [
    { id: 'm3_1', senderId: 'current_user', receiverId: '5', text: 'Hey Daniel, did you get a chance to look at the Twitter clone mobile design?', timestamp: 'Yesterday', status: 'read' },
    { id: 'm3_2', senderId: '5', receiverId: 'current_user', text: "Got it. I'll check the design and update you soon.", timestamp: 'Yesterday', status: 'read' },
  ],
  'c4': [
    { id: 'm4_1', senderId: '6', receiverId: 'current_user', text: 'Hey! The team is meeting up for drinks later.', timestamp: '2 days ago', status: 'read' },
    { id: 'm4_2', senderId: '6', receiverId: 'current_user', text: 'Are you still coming tonight?', timestamp: '2 days ago', status: 'read' },
  ],
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    user: MOCK_USERS['1'], // Elon Musk
    tweet: INITIAL_TWEETS[0],
    timestamp: '15m',
    read: false,
  },
  {
    id: 'n2',
    type: 'repost',
    user: MOCK_USERS['2'], // React Native
    tweet: INITIAL_TWEETS[1],
    timestamp: '1h',
    read: false,
  },
  {
    id: 'n3',
    type: 'follow',
    user: MOCK_USERS['4'], // Anna Smith
    timestamp: '3h',
    read: true,
  },
  {
    id: 'n4',
    type: 'mention',
    user: MOCK_USERS['5'], // Daniel King
    tweet: {
      id: 't_mention',
      user: MOCK_USERS['5'],
      content: 'Just reviewing the interface built by @jennywilson. Stunning work!',
      timestamp: '5h',
      likes: 5,
      reposts: 1,
      comments: 2,
      views: 120,
    },
    timestamp: '5h',
    read: true,
  },
];

export const MOCK_TRENDS: Trend[] = [
  { id: 'tr1', tag: 'ReactNative086', category: 'Technology', tweetCount: 15400 },
  { id: 'tr2', tag: 'WWDC2026', category: 'Technology • Trending', tweetCount: 120500 },
  { id: 'tr3', tag: 'AI_Agents', category: 'Business & Finance', tweetCount: 84300 },
  { id: 'tr4', tag: 'TokyoTravel', category: 'Travel • Trending', tweetCount: 8900 },
  { id: 'tr5', tag: 'WorldCupQualifiers', category: 'Sports', tweetCount: 312000 },
  { id: 'tr6', tag: 'CoffeeArt', category: 'Lifestyle', tweetCount: 4300 },
];

export const MOCK_LISTS: List[] = [
  {
    id: 'l1',
    name: 'Tech & Mobile Dev',
    description: 'All updates and news from mobile tech leaders and frameworks.',
    memberCount: 24,
    followerCount: 128,
    avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150',
    isPrivate: false,
    creatorId: 'current_user',
    members: ['2', '7'],
  },
  {
    id: 'l2',
    name: 'Design Inspiration',
    description: 'Design systems, UI/UX tips, and visual portfolios.',
    memberCount: 15,
    followerCount: 54,
    avatar: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150',
    isPrivate: false,
    creatorId: 'current_user',
    members: ['4'],
  },
];
