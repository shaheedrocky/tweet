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
import { useApp } from '../../providers/AppProvider';
import { useTweets } from '../../hooks/useTweets';
import { Tweet, List } from '../../types';
import TweetCard from '../../components/home/TweetCard';
import EmptyState from '../../components/common/EmptyState';
import VectorIcon from '../../components/common/VectorIcon';
import { fontSize } from '../../utils/color';

const ListDetails = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { fetchTweetsByList, lists } = useApp();
  const { likeTweet, repostTweet, bookmarkTweet } = useTweets();

  const { listId } = route.params;
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  const list = lists.find(l => l.id === listId);

  useEffect(() => {
    const loadTweets = async () => {
      setLoading(true);
      try {
        const res = await fetchTweetsByList(listId);
        setTweets(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadTweets();
  }, [listId]);

  if (!list) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>List not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <VectorIcon type="Ionicons" name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
            {list.name}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
            List · {list.memberCount} members
          </Text>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={{ color: theme.primary, fontWeight: '700' }}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Description Panel */}
      {list.description ? (
        <View style={[styles.descPanel, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}>
          <Text style={[styles.descText, { color: theme.text }]}>{list.description}</Text>
        </View>
      ) : null}

      {/* Feed */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlashList
          data={tweets}
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
              title="No posts in this List yet"
              subtitle="When people in this list post, their tweets will appear here. Try adding more accounts to the list."
              icon="list"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ListDetails;

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
  headerTitleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  editBtn: {
    padding: 8,
    marginRight: -8,
  },
  descPanel: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  descText: {
    fontSize: 14,
    lineHeight: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
