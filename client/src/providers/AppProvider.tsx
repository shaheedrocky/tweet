import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, Tweet, Message, Conversation, Notification, Trend, List } from '../types';
import { apiService } from '../services/api';

interface AppContextType {
  // Auth
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, avatar?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;

  // Tweets Feed
  tweets: Tweet[];
  isFeedLoading: boolean;
  isRefreshing: boolean;
  feedPage: number;
  hasMoreFeed: boolean;
  fetchTweetsFeed: (reset?: boolean) => Promise<void>;
  refreshFeed: () => Promise<void>;
  createTweet: (content: string, media?: string[], pollOptions?: string[], linkUrl?: string, video?: string, audio?: string) => Promise<void>;
  likeTweet: (tweetId: string) => Promise<void>;
  repostTweet: (tweetId: string) => Promise<void>;
  bookmarkTweet: (tweetId: string) => Promise<void>;
  voteInPoll: (tweetId: string, optionIndex: number) => Promise<void>;
  addComment: (parentTweetId: string, content: string) => Promise<Tweet>;
  fetchReplies: (parentTweetId: string) => Promise<Tweet[]>;

  // Chats
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  isConversationsLoading: boolean;
  isMessagesLoading: boolean;
  setActiveConversationId: (id: string | null) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendChatMessage: (conversationId: string, text: string, image?: string) => Promise<void>;

  // Notifications
  notifications: Notification[];
  isNotificationsLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;

  // Trends
  trends: Trend[];
  isTrendsLoading: boolean;
  fetchTrends: () => Promise<void>;

  // Lists
  lists: List[];
  isListsLoading: boolean;
  fetchLists: () => Promise<void>;
  createList: (name: string, description: string, isPrivate: boolean) => Promise<void>;
  addMemberToList: (listId: string, userId: string) => Promise<void>;
  fetchTweetsByList: (listId: string) => Promise<Tweet[]>;

  // Followers & Following
  followers: User[];
  following: User[];
  isFollowersLoading: boolean;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  fetchFollowersAndFollowing: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tweets State
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isFeedLoading, setIsFeedLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedPage, setFeedPage] = useState(1);
  const [hasMoreFeed, setHasMoreFeed] = useState(true);

  // Chats State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isConversationsLoading, setIsConversationsLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);

  // Trends State
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isTrendsLoading, setIsTrendsLoading] = useState(false);

  // Lists State
  const [lists, setLists] = useState<List[]>([]);
  const [isListsLoading, setIsListsLoading] = useState(false);

  // Followers / Following
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [isFollowersLoading, setIsFollowersLoading] = useState(false);

  // Initialize App (Simulate checking stored token/session)
  useEffect(() => {
    const checkSession = async () => {
      try {
        await new Promise<void>(resolve => setTimeout(resolve, 1500)); // splash duration
        // Automatically login mock user
        const loggedInUser = await apiService.updateProfile({});
        setUser(loggedInUser);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // Fetch dependencies once user is logged in
  useEffect(() => {
    if (user) {
      fetchTweetsFeed(true);
      fetchConversations();
      fetchNotifications();
      fetchTrends();
      fetchLists();
      fetchFollowersAndFollowing();
    }
  }, [user]);

  // Auth Functions
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await apiService.login(email, password);
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, username: string, email: string, avatar?: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await apiService.register(name, username, email, avatar);
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    await apiService.forgotPassword(email);
  };

  const logout = async () => {
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const updatedUser = await apiService.updateProfile(updates);
    setUser(updatedUser);
  };

  // Tweets Feed Functions
  const fetchTweetsFeed = async (reset: boolean = false) => {
    if (isFeedLoading) return;
    setIsFeedLoading(true);
    try {
      const pageToFetch = reset ? 1 : feedPage;
      const response = await apiService.fetchTweets(pageToFetch, 5);
      if (response.length === 0) {
        setHasMoreFeed(false);
      } else {
        if (reset) {
          setTweets(response);
          setFeedPage(2);
          setHasMoreFeed(true);
        } else {
          // Filter duplicates
          setTweets(prev => {
            const existingIds = new Set(prev.map(t => t.id));
            const newTweets = response.filter(t => !existingIds.has(t.id));
            return [...prev, ...newTweets];
          });
          setFeedPage(prev => prev + 1);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFeedLoading(false);
    }
  };

  const refreshFeed = async () => {
    setIsRefreshing(true);
    try {
      await fetchTweetsFeed(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const createTweet = async (
    content: string,
    media?: string[],
    pollOptions?: string[],
    linkUrl?: string,
    video?: string,
    audio?: string
  ) => {
    const newTweet = await apiService.createTweet(content, media, pollOptions, linkUrl, video, audio);
    setTweets(prev => [newTweet, ...prev]);
  };

  // OPTIMISTIC UPDATES for Likes
  const likeTweet = async (tweetId: string) => {
    // 1. Optimistic State Update
    setTweets(prev =>
      prev.map(t => {
        if (t.id === tweetId) {
          const isLiked = !t.isLiked;
          return {
            ...t,
            isLiked,
            likes: t.likes + (isLiked ? 1 : -1),
          };
        }
        return t;
      })
    );

    // 2. Perform API Mutation in background
    try {
      await apiService.likeTweet(tweetId);
    } catch (err) {
      // Revert if error
      console.error('Like failed, reverting', err);
      setTweets(prev =>
        prev.map(t => {
          if (t.id === tweetId) {
            const isLiked = !t.isLiked;
            return {
              ...t,
              isLiked,
              likes: t.likes + (isLiked ? 1 : -1),
            };
          }
          return t;
        })
      );
    }
  };

  // OPTIMISTIC UPDATES for Reposts
  const repostTweet = async (tweetId: string) => {
    setTweets(prev =>
      prev.map(t => {
        if (t.id === tweetId) {
          const isReposted = !t.isReposted;
          return {
            ...t,
            isReposted,
            reposts: t.reposts + (isReposted ? 1 : -1),
          };
        }
        return t;
      })
    );

    try {
      await apiService.repostTweet(tweetId);
    } catch (err) {
      console.error('Repost failed, reverting', err);
      setTweets(prev =>
        prev.map(t => {
          if (t.id === tweetId) {
            const isReposted = !t.isReposted;
            return {
              ...t,
              isReposted,
              reposts: t.reposts + (isReposted ? 1 : -1),
            };
          }
          return t;
        })
      );
    }
  };

  // OPTIMISTIC UPDATES for Bookmarks
  const bookmarkTweet = async (tweetId: string) => {
    setTweets(prev =>
      prev.map(t => {
        if (t.id === tweetId) {
          return {
            ...t,
            isBookmarked: !t.isBookmarked,
          };
        }
        return t;
      })
    );

    try {
      await apiService.bookmarkTweet(tweetId);
    } catch (err) {
      console.error('Bookmark failed, reverting', err);
      setTweets(prev =>
        prev.map(t => {
          if (t.id === tweetId) {
            return {
              ...t,
              isBookmarked: !t.isBookmarked,
            };
          }
          return t;
        })
      );
    }
  };

  const voteInPoll = async (tweetId: string, optionIndex: number) => {
    // Find tweet
    const tweet = tweets.find(t => t.id === tweetId);
    if (!tweet || !tweet.poll || !user) return;

    // Check if user already voted in local state
    const alreadyVoted = tweet.poll.options.some(opt => opt.voters.includes(user.id));
    if (alreadyVoted) return;

    // Optimistic Update
    setTweets(prev =>
      prev.map(t => {
        if (t.id === tweetId && t.poll) {
          const updatedOptions = t.poll.options.map((opt, idx) => {
            if (idx === optionIndex) {
              return {
                ...opt,
                votes: opt.votes + 1,
                voters: [...opt.voters, user.id],
              };
            }
            return opt;
          });
          return {
            ...t,
            poll: {
              ...t.poll,
              options: updatedOptions,
              totalVotes: t.poll.totalVotes + 1,
            },
          };
        }
        return t;
      })
    );

    try {
      await apiService.castVote(tweetId, optionIndex);
    } catch (err) {
      console.error('Voting failed, reverting', err);
      // Revert code if needed, for simplicity we trust the vote
    }
  };

  const addComment = async (parentTweetId: string, content: string): Promise<Tweet> => {
    const commentTweet = await apiService.addComment(parentTweetId, content);
    // Increment local comment count on parent tweet
    setTweets(prev =>
      prev.map(t => {
        if (t.id === parentTweetId) {
          return { ...t, comments: t.comments + 1 };
        }
        return t;
      }).concat(commentTweet)
    );
    return commentTweet;
  };

  const fetchReplies = async (parentTweetId: string): Promise<Tweet[]> => {
    return await apiService.fetchReplies(parentTweetId);
  };

  // Chats Functions
  const fetchConversations = async () => {
    setIsConversationsLoading(true);
    try {
      const res = await apiService.fetchConversations();
      setConversations(res);
    } finally {
      setIsConversationsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setIsMessagesLoading(true);
    try {
      const res = await apiService.fetchMessages(conversationId);
      setMessages(res);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  const sendChatMessage = async (conversationId: string, text: string, image?: string) => {
    if (!text && !image) return;
    const sentMsg = await apiService.sendChatMessage(conversationId, text, image);
    setMessages(prev => [...prev, sentMsg]);

    // Update conversation list locally
    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text || 'Photo',
            lastUpdated: 'Just now',
          };
        }
        return c;
      })
    );
  };

  // Notifications Functions
  const fetchNotifications = async () => {
    setIsNotificationsLoading(true);
    try {
      const res = await apiService.fetchNotifications();
      setNotifications(res);
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  const markAllNotificationsAsRead = async () => {
    await apiService.markAllNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Trends Functions
  const fetchTrends = async () => {
    setIsTrendsLoading(true);
    try {
      const res = await apiService.fetchTrends();
      setTrends(res);
    } finally {
      setIsTrendsLoading(false);
    }
  };

  // Lists Functions
  const fetchLists = async () => {
    setIsListsLoading(true);
    try {
      const res = await apiService.fetchLists();
      setLists(res);
    } finally {
      setIsListsLoading(false);
    }
  };

  const createList = async (name: string, description: string, isPrivate: boolean) => {
    const newList = await apiService.createList(name, description, isPrivate);
    setLists(prev => [newList, ...prev]);
  };

  const addMemberToList = async (listId: string, userId: string) => {
    const updatedList = await apiService.addMemberToList(listId, userId);
    setLists(prev => prev.map(l => (l.id === listId ? updatedList : l)));
  };

  const fetchTweetsByList = async (listId: string): Promise<Tweet[]> => {
    return await apiService.fetchTweetsByList(listId);
  };

  // Followers & Following Functions
  const fetchFollowersAndFollowing = async () => {
    setIsFollowersLoading(true);
    try {
      const [fllwers, fllwing] = await Promise.all([
        apiService.fetchUsers('followers'),
        apiService.fetchUsers('following'),
      ]);
      setFollowers(fllwers);
      setFollowing(fllwing);
    } finally {
      setIsFollowersLoading(false);
    }
  };

  const followUser = async (userId: string) => {
    const updatedUser = await apiService.followUser(userId);
    // Add to following list
    setFollowing(prev => [...prev, updatedUser]);
    // Update followers/following counters on tweets user
    setTweets(prev =>
      prev.map(t => {
        if (t.user.id === userId) {
          return { ...t, user: updatedUser };
        }
        return t;
      })
    );
  };

  const unfollowUser = async (userId: string) => {
    const updatedUser = await apiService.unfollowUser(userId);
    // Remove from following list
    setFollowing(prev => prev.filter(u => u.id !== userId));
    // Update tweets user
    setTweets(prev =>
      prev.map(t => {
        if (t.user.id === userId) {
          return { ...t, user: updatedUser };
        }
        return t;
      })
    );
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      forgotPassword,
      logout,
      updateProfile,
      tweets,
      isFeedLoading,
      isRefreshing,
      feedPage,
      hasMoreFeed,
      fetchTweetsFeed,
      refreshFeed,
      createTweet,
      likeTweet,
      repostTweet,
      bookmarkTweet,
      voteInPoll,
      addComment,
      fetchReplies,
      conversations,
      messages,
      activeConversationId,
      isConversationsLoading,
      isMessagesLoading,
      setActiveConversationId,
      fetchConversations,
      fetchMessages,
      sendChatMessage,
      notifications,
      isNotificationsLoading,
      fetchNotifications,
      markAllNotificationsAsRead,
      trends,
      isTrendsLoading,
      fetchTrends,
      lists,
      isListsLoading,
      fetchLists,
      createList,
      addMemberToList,
      fetchTweetsByList,
      followers,
      following,
      isFollowersLoading,
      followUser,
      unfollowUser,
      fetchFollowersAndFollowing,
    }),
    [
      user,
      isLoading,
      tweets,
      isFeedLoading,
      isRefreshing,
      feedPage,
      hasMoreFeed,
      conversations,
      messages,
      activeConversationId,
      isConversationsLoading,
      isMessagesLoading,
      notifications,
      isNotificationsLoading,
      trends,
      isTrendsLoading,
      lists,
      isListsLoading,
      followers,
      following,
      isFollowersLoading,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
};
export default AppContext;
