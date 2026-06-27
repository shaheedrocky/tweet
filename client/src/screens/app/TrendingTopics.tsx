import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import FlashList from '../../components/common/AppFlashList';
import { useTheme } from '../../providers/ThemeProvider';
import { useTweets } from '../../hooks/useTweets';
import { Tweet } from '../../types';
import TweetCard from '../../components/home/TweetCard';
import EmptyState from '../../components/common/EmptyState';
import VectorIcon from '../../components/common/VectorIcon';
import { fontSize } from '../../utils/color';

const TrendingTopics = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { tweets, likeTweet, repostTweet, bookmarkTweet } = useTweets();

  const category = route.params?.category || 'Trending';
  const [loading, setLoading] = useState(true);
  const [topicTweets, setTopicTweets] = useState<Tweet[]>([]);

  useEffect(() => {
    // Simulate loading category-specific tweets
    const timer = setTimeout(() => {
      // Filter tweets that have tags or mock some topic matches
      let filtered = tweets;
      if (category && category !== 'Trending') {
        filtered = tweets.filter(t => t.content.toLowerCase().includes(category.toLowerCase()));
      }
      setTopicTweets(filtered);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [category]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <VectorIcon type="Ionicons" name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{category}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Feed */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlashList
          data={topicTweets}
          keyExtractor={(item: any) => item.id}
          estimatedItemSize={120}
          renderItem={({ item }: { item: any }) => (
            <TweetCard
              item={item}
              onLike={() => likeTweet(item.id)}
              onRepost={() => repostTweet(item.id)}
              onBookmark={() => bookmarkTweet(item.id)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title={`No posts in ${category}`}
              subtitle="Be the first to post about this trending topic!"
              icon="hash"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default TrendingTopics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: '700',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
