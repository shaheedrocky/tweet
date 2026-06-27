import { User, Tweet, Message, Conversation, Notification, Trend, List } from '../types';
import { CURRENT_USER, MOCK_USERS, INITIAL_TWEETS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_NOTIFICATIONS, MOCK_TRENDS, MOCK_LISTS } from '../data/mockData';

// Simulated latency helper
const delay = (ms: number = 800) => new Promise<void>(resolve => setTimeout(resolve, ms));

// Simulated in-memory database
let tweetsDb = [...INITIAL_TWEETS];
let conversationsDb = [...MOCK_CONVERSATIONS];
let messagesDb = { ...MOCK_MESSAGES };
let notificationsDb = [...MOCK_NOTIFICATIONS];
let listsDb = [...MOCK_LISTS];
let currentUserDb = { ...CURRENT_USER };
let usersDb = { ...MOCK_USERS };

export const apiService = {
  // Auth API
  async login(email: string, password: string): Promise<User> {
    await delay(1000);
    if (!email || !password) throw new Error('Email and password are required');
    return currentUserDb;
  },

  async register(name: string, username: string, email: string, avatar?: string): Promise<User> {
    await delay(1200);
    if (!name || !username || !email) throw new Error('All fields are required');
    currentUserDb = {
      ...currentUserDb,
      name,
      username: username.toLowerCase().replace('@', ''),
      avatar: avatar || currentUserDb.avatar,
    };
    return currentUserDb;
  },

  async forgotPassword(email: string): Promise<boolean> {
    await delay(800);
    if (!email) throw new Error('Email is required');
    return true;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    await delay(1000);
    currentUserDb = {
      ...currentUserDb,
      ...updates,
    };
    return currentUserDb;
  },

  // Tweets API
  async fetchTweets(page: number = 1, limit: number = 5): Promise<Tweet[]> {
    await delay(800);
    const start = (page - 1) * limit;
    return tweetsDb.slice(start, start + limit);
  },

  async fetchTweetById(id: string): Promise<Tweet | undefined> {
    await delay(400);
    return tweetsDb.find(t => t.id === id);
  },

  async createTweet(
    content: string,
    media?: string[],
    pollOptions?: string[],
    linkUrl?: string,
    video?: string,
    audio?: string
  ): Promise<Tweet> {
    await delay(600);
    const newTweet: Tweet = {
      id: `t_${Date.now()}`,
      user: currentUserDb,
      content,
      timestamp: 'Just now',
      likes: 0,
      reposts: 0,
      comments: 0,
      views: 1,
      isLiked: false,
      isReposted: false,
      isBookmarked: false,
      media,
      video,
      audio,
    };

    if (pollOptions && pollOptions.length > 0) {
      newTweet.poll = {
        id: `p_${Date.now()}`,
        options: pollOptions.map(opt => ({ text: opt, votes: 0, voters: [] })),
        totalVotes: 0,
        expiryTime: new Date(Date.now() + 86400000).toISOString(),
      };
    }

    if (linkUrl) {
      newTweet.linkPreview = {
        title: 'Preview Link Information',
        description: `This is a preview description for ${linkUrl}. Connect with peers today on X.`,
        url: linkUrl,
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
      };
    }

    // Prepend to database
    tweetsDb = [newTweet, ...tweetsDb];
    return newTweet;
  },

  async likeTweet(id: string): Promise<Tweet> {
    await delay(100); // quick response for UX
    const index = tweetsDb.findIndex(t => t.id === id);
    if (index !== -1) {
      const tweet = tweetsDb[index];
      const isLiked = !tweet.isLiked;
      tweetsDb[index] = {
        ...tweet,
        isLiked,
        likes: tweet.likes + (isLiked ? 1 : -1),
      };
      return tweetsDb[index];
    }
    throw new Error('Tweet not found');
  },

  async repostTweet(id: string): Promise<Tweet> {
    await delay(100);
    const index = tweetsDb.findIndex(t => t.id === id);
    if (index !== -1) {
      const tweet = tweetsDb[index];
      const isReposted = !tweet.isReposted;
      tweetsDb[index] = {
        ...tweet,
        isReposted,
        reposts: tweet.reposts + (isReposted ? 1 : -1),
      };
      return tweetsDb[index];
    }
    throw new Error('Tweet not found');
  },

  async bookmarkTweet(id: string): Promise<Tweet> {
    await delay(100);
    const index = tweetsDb.findIndex(t => t.id === id);
    if (index !== -1) {
      const tweet = tweetsDb[index];
      const isBookmarked = !tweet.isBookmarked;
      tweetsDb[index] = {
        ...tweet,
        isBookmarked,
      };
      return tweetsDb[index];
    }
    throw new Error('Tweet not found');
  },

  async castVote(tweetId: string, optionIndex: number): Promise<Tweet> {
    await delay(300);
    const index = tweetsDb.findIndex(t => t.id === tweetId);
    if (index !== -1) {
      const tweet = tweetsDb[index];
      if (tweet.poll) {
        const updatedOptions = [...tweet.poll.options];
        const option = updatedOptions[optionIndex];

        // Check if user already voted in this poll
        const alreadyVoted = updatedOptions.some(opt => opt.voters.includes(currentUserDb.id));
        if (alreadyVoted) return tweet; // prevent multiple voting

        option.votes += 1;
        option.voters.push(currentUserDb.id);

        tweetsDb[index] = {
          ...tweet,
          poll: {
            ...tweet.poll,
            options: updatedOptions,
            totalVotes: tweet.poll.totalVotes + 1,
          },
        };
        return tweetsDb[index];
      }
    }
    throw new Error('Poll not found');
  },

  async addComment(parentTweetId: string, content: string): Promise<Tweet> {
    await delay(500);
    const parentIndex = tweetsDb.findIndex(t => t.id === parentTweetId);
    if (parentIndex !== -1) {
      tweetsDb[parentIndex] = {
        ...tweetsDb[parentIndex],
        comments: tweetsDb[parentIndex].comments + 1,
      };
    }

    const replyTweet: Tweet = {
      id: `t_${Date.now()}`,
      user: currentUserDb,
      content,
      timestamp: 'Just now',
      likes: 0,
      reposts: 0,
      comments: 0,
      views: 1,
      parentTweetId,
      replyTo: parentIndex !== -1 ? tweetsDb[parentIndex].user.username : undefined,
    };

    tweetsDb = [...tweetsDb, replyTweet];
    return replyTweet;
  },

  async fetchReplies(parentTweetId: string): Promise<Tweet[]> {
    await delay(500);
    return tweetsDb.filter(t => t.parentTweetId === parentTweetId);
  },

  // Chats API
  async fetchConversations(): Promise<Conversation[]> {
    await delay(600);
    return conversationsDb;
  },

  async fetchMessages(conversationId: string): Promise<Message[]> {
    await delay(500);
    return messagesDb[conversationId] || [];
  },

  async sendChatMessage(conversationId: string, text: string, image?: string): Promise<Message> {
    await delay(200);
    const conversation = conversationsDb.find(c => c.id === conversationId);
    if (!conversation) throw new Error('Conversation not found');

    const newMessage: Message = {
      id: `m_${Date.now()}`,
      senderId: currentUserDb.id,
      receiverId: conversation.participant.id,
      text,
      image,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    if (!messagesDb[conversationId]) {
      messagesDb[conversationId] = [];
    }
    messagesDb[conversationId] = [...messagesDb[conversationId], newMessage];

    // Update conversation last message
    conversationsDb = conversationsDb.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: text || 'Photo',
          lastUpdated: 'Just now',
        };
      }
      return c;
    });

    return newMessage;
  },

  // Notifications API
  async fetchNotifications(): Promise<Notification[]> {
    await delay(600);
    return notificationsDb;
  },

  async markAllNotificationsAsRead(): Promise<boolean> {
    notificationsDb = notificationsDb.map(n => ({ ...n, read: true }));
    return true;
  },

  // Trends API
  async fetchTrends(): Promise<Trend[]> {
    await delay(400);
    return MOCK_TRENDS;
  },

  // Lists API
  async fetchLists(): Promise<List[]> {
    await delay(500);
    return listsDb;
  },

  async createList(name: string, description: string, isPrivate: boolean): Promise<List> {
    await delay(600);
    const newList: List = {
      id: `l_${Date.now()}`,
      name,
      description,
      memberCount: 0,
      followerCount: 0,
      avatar: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150',
      isPrivate,
      creatorId: currentUserDb.id,
      members: [],
    };
    listsDb = [newList, ...listsDb];
    return newList;
  },

  async addMemberToList(listId: string, userId: string): Promise<List> {
    await delay(400);
    const index = listsDb.findIndex(l => l.id === listId);
    if (index !== -1) {
      const list = listsDb[index];
      if (!list.members.includes(userId)) {
        const updatedMembers = [...list.members, userId];
        listsDb[index] = {
          ...list,
          members: updatedMembers,
          memberCount: updatedMembers.length,
        };
        return listsDb[index];
      }
      return list;
    }
    throw new Error('List not found');
  },

  async fetchTweetsByList(listId: string): Promise<Tweet[]> {
    await delay(600);
    const list = listsDb.find(l => l.id === listId);
    if (!list) return [];
    return tweetsDb.filter(t => list.members.includes(t.user.id));
  },

  // Followers & Following API
  async followUser(userId: string): Promise<User> {
    await delay(400);
    if (usersDb[userId]) {
      usersDb[userId] = {
        ...usersDb[userId],
        isFollowing: true,
        followersCount: usersDb[userId].followersCount + 1,
      };
      // Increment current user's following count
      currentUserDb = {
        ...currentUserDb,
        followingCount: currentUserDb.followingCount + 1,
      };
      return usersDb[userId];
    }
    throw new Error('User not found');
  },

  async unfollowUser(userId: string): Promise<User> {
    await delay(400);
    if (usersDb[userId]) {
      usersDb[userId] = {
        ...usersDb[userId],
        isFollowing: false,
        followersCount: Math.max(0, usersDb[userId].followersCount - 1),
      };
      // Decrement current user's following count
      currentUserDb = {
        ...currentUserDb,
        followingCount: Math.max(0, currentUserDb.followingCount - 1),
      };
      return usersDb[userId];
    }
    throw new Error('User not found');
  },

  async fetchUsers(type: 'followers' | 'following'): Promise<User[]> {
    await delay(500);
    const allUsers = Object.values(usersDb);
    if (type === 'following') {
      return allUsers.filter(u => u.isFollowing);
    }
    // Return a subset of mock users as followers
    return allUsers.slice(0, 4);
  }
};
