import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import FlashList from '../../components/common/AppFlashList';
import { useTheme } from '../../providers/ThemeProvider';
import { useTweets } from '../../hooks/useTweets';
import { useAuth } from '../../hooks/useAuth';
import TweetComposer from '../../components/home/TweetComposer';
import TweetCard from '../../components/home/TweetCard';
import BottomSheet, { BottomSheetRef } from '../../components/common/BottomSheet';
import { TweetSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import VectorIcon from '../../components/common/VectorIcon';

const HomeScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const {
    tweets,
    isFeedLoading,
    isRefreshing,
    hasMoreFeed,
    fetchTweetsFeed,
    refreshFeed,
    likeTweet,
    repostTweet,
    bookmarkTweet,
  } = useTweets();

  const composerSheetRef = useRef<BottomSheetRef>(null);
  const listRef = useRef<any>(null);
  const [page, setPage] = useState(1);

  // Load feed on mount
  useEffect(() => {
    fetchTweetsFeed(true);
  }, []);

  const handleLoadMore = () => {
    if (hasMoreFeed && !isFeedLoading) {
      fetchTweetsFeed();
    }
  };

  const handleLike = (id: string) => {
    likeTweet(id);
  };

  const handleRepost = (id: string) => {
    repostTweet(id);
  };

  const handleBookmark = (id: string) => {
    bookmarkTweet(id);
  };

  // Header display custom component matching Twitter aesthetics
  const RenderHeader = () => (
    <View style={[styles.headerContainer, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}>
      <TouchableOpacity onPress={toggleTheme} style={styles.avatarTouch}>
        <VectorIcon type="Ionicons" name="logo-twitter" size={28} color={theme.primary} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: theme.text }]}>Home</Text>
      <TouchableOpacity onPress={() => composerSheetRef.current?.open()} style={styles.composeHeaderIcon}>
        <VectorIcon type="Feather" name="edit" size={20} color={theme.text} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Custom App Header */}
      <RenderHeader />

      {/* Main FlashList Feed */}
      {isFeedLoading && tweets.length === 0 ? (
        // Initial Shimmer Loader
        <View style={{ flex: 1 }}>
          <TweetSkeleton />
          <TweetSkeleton />
          <TweetSkeleton />
        </View>
      ) : (
        <FlashList
          ref={listRef}
          data={tweets}
          keyExtractor={(item: any) => item.id}
          estimatedItemSize={180}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          onRefresh={refreshFeed}
          refreshing={isRefreshing}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }: { item: any }) => (
            <TweetCard
              item={item}
              onLike={() => handleLike(item.id)}
              onRepost={() => handleRepost(item.id)}
              onBookmark={() => handleBookmark(item.id)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title="Welcome to your timeline!"
              subtitle="This is where you'll see posts from people you follow. Start following accounts now to see their updates."
              icon="hash"
            />
          }
          ListFooterComponent={
            isFeedLoading && tweets.length > 0 ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={theme.primary} />
              </View>
            ) : null
          }
        />
      )}

      {/* Reusable Bottom Sheet for Tweet Creation */}
      <BottomSheet
        ref={composerSheetRef}
        snapPoints={['90%']}
        initialSnapIndex={0}
        // closeOnBackdropPress
        showHandle
      >
        <TweetComposer
          onClose={() => composerSheetRef.current?.close()}
          onPostSuccess={() => {
            setTimeout(() => {
              listRef.current?.scrollToOffset({ offset: 0, animated: true });
            }, 200);
          }}
        />
      </BottomSheet>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 0.5,
    zIndex: 10,
  },
  avatarTouch: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  composeHeaderIcon: {
    padding: 6,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4.5,
  },
});
