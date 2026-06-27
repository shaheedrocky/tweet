import { useApp } from '../providers/AppProvider';

export const useTweets = () => {
  const {
    tweets,
    isFeedLoading,
    isRefreshing,
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
  } = useApp();

  return {
    tweets,
    isFeedLoading,
    isRefreshing,
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
  };
};
