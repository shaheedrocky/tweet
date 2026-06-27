import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import FlashList from '../../components/common/AppFlashList';
import { useTheme } from '../../providers/ThemeProvider';
import { useTweets } from '../../hooks/useTweets';
import { Tweet } from '../../types';
import TweetCard from '../../components/home/TweetCard';
import VectorIcon from '../../components/common/VectorIcon';
import { fontSize } from '../../utils/color';

const TweetDetails = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const { tweets, addComment, fetchReplies, likeTweet, repostTweet, bookmarkTweet } = useTweets();

  const { tweetId } = route.params;
  const [commentText, setCommentText] = useState('');
  const [replies, setReplies] = useState<Tweet[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRepliesLoading, setIsRepliesLoading] = useState(true);

  // Find the tweet in the local context state so updates (like/repost) are automatically reflected
  const tweet = tweets.find(t => t.id === tweetId);

  useEffect(() => {
    const loadReplies = async () => {
      try {
        const res = await fetchReplies(tweetId);
        setReplies(res);
      } catch (e) {
        console.error(e);
      } finally {
        setIsRepliesLoading(false);
      }
    };
    loadReplies();
  }, [tweetId, tweets]); // reload replies if tweets context updates

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      const newComment = await addComment(tweetId, commentText);
      setReplies(prev => [...prev, newComment]);
      setCommentText('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tweet) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Tweet not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <VectorIcon type="Ionicons" name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Post</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={{ flex: 1 }}
      >
        <FlashList
          data={replies}
          keyExtractor={(item: any) => item.id}
          estimatedItemSize={120}
          ListHeaderComponent={
            <View>
              {/* Parent Tweet */}
              <TweetCard
                item={tweet}
                onLike={() => likeTweet(tweet.id)}
                onRepost={() => repostTweet(tweet.id)}
                onBookmark={() => bookmarkTweet(tweet.id)}
              />
              {/* Divider */}
              <View style={[styles.repliesHeader, { borderBottomColor: theme.border, backgroundColor: theme.divider }]}>
                <Text style={[styles.repliesTitle, { color: theme.textMuted }]}>Replies</Text>
              </View>
              {isRepliesLoading && (
                <View style={styles.loader}>
                  <ActivityIndicator size="small" color={theme.primary} />
                </View>
              )}
            </View>
          }
          renderItem={({ item }: { item: any }) => (
            <TweetCard
              item={item}
              onLike={() => likeTweet(item.id)}
              onRepost={() => repostTweet(item.id)}
              onBookmark={() => bookmarkTweet(item.id)}
            />
          )}
          ListEmptyComponent={
            !isRepliesLoading ? (
              <View style={styles.emptyContainer}>
                <Text style={{ color: theme.textMuted }}>Be the first to reply!</Text>
              </View>
            ) : null
          }
        />

        {/* Quick Reply Bar */}
        <View style={[styles.replyContainer, { borderTopColor: theme.border, backgroundColor: theme.surface }]}>
          <TextInput
            placeholder={`Reply to @${tweet.user.username}`}
            placeholderTextColor={theme.textMuted}
            style={[styles.replyInput, { color: theme.text, backgroundColor: theme.background }]}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: theme.primary, opacity: commentText.trim() ? 1 : 0.6 },
            ]}
            disabled={!commentText.trim() || isSubmitting}
            onPress={handleSendComment}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>Reply</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TweetDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: '700',
  },
  repliesHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  repliesTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  loader: {
    padding: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
  },
  replyInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});
