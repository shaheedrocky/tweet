import { CURRENT_USER, MOCK_CONVERSATIONS, INITIAL_TWEETS } from './mockData';

export const USER = MOCK_CONVERSATIONS.map(c => ({
  id: c.participant.id,
  name: c.participant.name,
  avatar: c.participant.avatar,
  lastMessage: c.lastMessage,
  time: c.lastUpdated,
  unreadCount: c.unreadCount,
  online: true,
  pinned: c.pinned || false,
}));

export const profileData = {
  name: CURRENT_USER.name,
  username: '@' + CURRENT_USER.username,
  bio: CURRENT_USER.bio || '',
  website: CURRENT_USER.website || '',
  isVerified: CURRENT_USER.isVerified || false,
  followers: '12.5K',
  following: '482',
  avatar: CURRENT_USER.avatar,
  cover: CURRENT_USER.cover || '',
  posts: [
    { id: '1', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee' },
    { id: '2', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156' },
    { id: '3', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' },
  ],
};

export const tweets = INITIAL_TWEETS.map(t => ({
  id: t.id,
  name: t.user.name,
  username: t.user.username,
  avatar: t.user.avatar,
  content: t.content,
  image: t.media?.[0],
}));
