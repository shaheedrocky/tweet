export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  cover?: string;
  bio?: string;
  website?: string;
  location?: string;
  joinDate?: string;
  followersCount: number;
  followingCount: number;
  isVerified?: boolean;
  isFollowing?: boolean;
}

export interface PollOption {
  text: string;
  votes: number;
  voters: string[]; // array of userIds who voted
}

export interface Poll {
  id: string;
  options: PollOption[];
  totalVotes: number;
  expiryTime: string;
}

export interface LinkPreview {
  title: string;
  description: string;
  url: string;
  image?: string;
}

export interface Tweet {
  id: string;
  user: User;
  content: string;
  timestamp: string; // ISO string or relative time string
  likes: number;
  reposts: number;
  comments: number;
  views: number;
  isLiked?: boolean;
  isReposted?: boolean;
  isBookmarked?: boolean;
  media?: string[]; // array of image/video URIs
  video?: string;
  audio?: string;
  poll?: Poll;
  linkPreview?: LinkPreview;
  parentTweetId?: string; // for thread replies
  replyTo?: string; // username being replied to
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image?: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: string;
  unreadCount: number;
  lastUpdated: string;
  pinned?: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'repost' | 'comment' | 'follow' | 'mention';
  user: User;
  tweet?: Tweet;
  timestamp: string;
  read: boolean;
}

export interface Trend {
  id: string;
  tag: string;
  category: string;
  tweetCount: number;
}

export interface List {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  followerCount: number;
  avatar: string;
  isPrivate: boolean;
  creatorId: string;
  members: string[]; // user IDs
}
