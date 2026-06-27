import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FlashList from '../../components/common/AppFlashList';
import { useTheme } from '../../providers/ThemeProvider';
import { useTweets } from '../../hooks/useTweets';
import TweetCard from '../../components/home/TweetCard';
import EmptyState from '../../components/common/EmptyState';
import VectorIcon from '../../components/common/VectorIcon';
import { fontSize } from '../../utils/color';

const Bookmarks = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { tweets, likeTweet, repostTweet, bookmarkTweet } = useTweets();

  // Filter bookmarked tweets
  const bookmarkedTweets = tweets.filter(t => t.isBookmarked);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <VectorIcon type="Ionicons" name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Bookmarks</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlashList
        data={bookmarkedTweets}
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
            title="Save posts for later"
            subtitle="Don't let the good ones fly away! Bookmark posts to easily find them again in the future."
            icon="bookmark"
          />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmarks;

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
});
