import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FlashList from '../../components/common/AppFlashList';
import { useTheme } from '../../providers/ThemeProvider';
import { useApp } from '../../providers/AppProvider';
import { useTweets } from '../../hooks/useTweets';
import VectorIcon from '../../components/common/VectorIcon';
import TweetCard from '../../components/home/TweetCard';
import EmptyState from '../../components/common/EmptyState';

const tabs = ['For you', 'Trending', 'News', 'Sports', 'Entertainment'];

const Explore = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { trends, isTrendsLoading, fetchTrends } = useApp();
  const { tweets, likeTweet, repostTweet, bookmarkTweet } = useTweets();

  const [activeTab, setActiveTab] = useState('For you');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchTrends();
  }, []);

  const filteredTweets = tweets.filter(
    t =>
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTrendPress = (tag: string) => {
    setSearchQuery(`#${tag}`);
  };

  const renderTrendItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleTrendPress(item.tag)}
      style={[styles.trendItem, { borderBottomColor: theme.border }]}
    >
      <View>
        <Text style={[styles.trendCategory, { color: theme.textMuted }]}>
          {item.category}
        </Text>
        <Text style={[styles.trendTag, { color: theme.text }]}>#{item.tag}</Text>
        <Text style={[styles.trendCount, { color: theme.textMuted }]}>
          {item.tweetCount.toLocaleString()} posts
        </Text>
      </View>
      <TouchableOpacity style={styles.moreBtn}>
        <VectorIcon type="Feather" name="more-horizontal" size={16} color={theme.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Header */}
      <View style={[styles.searchHeader, { borderBottomColor: theme.border }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface }]}>
          <VectorIcon type="Feather" name="search" size={18} color={theme.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search X"
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearIcon}>
              <VectorIcon type="Ionicons" name="close-circle" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
          <VectorIcon type="Feather" name="settings" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      {!searchQuery && (
        <View style={[styles.tabsWrapper, { borderBottomColor: theme.border }]}>
          <FlashList
            horizontal
            data={tabs}
            keyExtractor={(item: any) => item}
            showsHorizontalScrollIndicator={false}
            estimatedItemSize={80}
            renderItem={({ item }: { item: any }) => {
              const active = item === activeTab;
              return (
                <TouchableOpacity
                  onPress={() => setActiveTab(item)}
                  style={[
                    styles.tabButton,
                    active && {
                      borderBottomColor: theme.primary, borderBottomWidth: 3,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: active ? theme.text : theme.textMuted },
                      active && { fontWeight: '700' },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      {/* Content */}
      {searchQuery ? (
        <FlashList
          data={filteredTweets}
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
              title="No results found"
              subtitle={`Try searching for something else or check your spelling for "${searchQuery}"`}
              icon="search"
            />
          }
        />
      ) : (
        // Trends List
        <View style={{ flex: 1, }}>
          {isTrendsLoading ? (
            <View style={styles.centerLoader}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : (
            <FlashList
              data={trends}
              keyExtractor={(item: any) => item.id}
              estimatedItemSize={85}
              renderItem={renderTrendItem}
              ListHeaderComponent={
                <View style={[styles.trendsHeader, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.trendsTitle, { color: theme.text }]}>Trending Topics</Text>
                </View>
              }
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    padding: 0,
  },
  clearIcon: {
    padding: 4,
  },
  settingsBtn: {
    marginLeft: 16,
    padding: 4,
  },
  tabsWrapper: {
    borderBottomWidth: 1,
    height: 48,
    marginTop: 12,
  },
  tabButton: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
     paddingBottom:10,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendsHeader: {
    padding: 16,
    borderBottomWidth: 1,
  },
  trendsTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  trendCategory: {
    fontSize: 12,
  },
  trendTag: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 4,
  },
  trendCount: {
    fontSize: 12,
  },
  moreBtn: {
    padding: 4,
  },
});
