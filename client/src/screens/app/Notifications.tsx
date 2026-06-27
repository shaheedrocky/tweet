import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FlashList from '../../components/common/AppFlashList';
import { useTheme } from '../../providers/ThemeProvider';
import { useApp } from '../../providers/AppProvider';
import VectorIcon from '../../components/common/VectorIcon';
import EmptyState from '../../components/common/EmptyState';
import { fontSize } from '../../utils/color';

const Notifications = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { notifications, isNotificationsLoading, fetchNotifications, markAllNotificationsAsRead } = useApp();

  const [activeTab, setActiveTab] = useState<'All' | 'Mentions'>('All');

  useEffect(() => {
    fetchNotifications();
    return () => {
      // Mark read on exit
      markAllNotificationsAsRead();
    };
  }, []);

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'Mentions') {
      return n.type === 'mention';
    }
    return true; // All
  });

  const renderIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <VectorIcon type="Ionicons" name="heart" size={24} color={theme.error} />;
      case 'repost':
        return <VectorIcon type="Feather" name="repeat" size={20} color={theme.success} />;
      case 'follow':
        return <VectorIcon type="Ionicons" name="person-add" size={22} color={theme.primary} />;
      case 'comment':
      case 'mention':
        return <VectorIcon type="Feather" name="message-circle" size={22} color={theme.primary} />;
      default:
        return null;
    }
  };

  const getNotificationText = (type: string) => {
    switch (type) {
      case 'like':
        return 'liked your post';
      case 'repost':
        return 'reposted your post';
      case 'follow':
        return 'followed you';
      case 'comment':
        return 'replied to your post';
      case 'mention':
        return 'mentioned you in a post';
      default:
        return '';
    }
  };

  const handleNotificationPress = (item: any) => {
    if (item.tweet) {
      navigation.navigate('TweetDetails', { tweetId: item.tweet.id });
    } else {
      navigation.navigate('Profile', { userId: item.user.id });
    }
  };

  const renderNotificationItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item)}
      style={[
        styles.notiItem,
        {
          borderBottomColor: theme.border,
          backgroundColor: item.read ? theme.background : `${theme.primary}10`,
        },
      ]}
    >
      <View style={styles.notiLeft}>{renderIcon(item.type)}</View>

      <View style={styles.notiRight}>
        <View style={styles.avatarRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: item.user.id })}>
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.notiBody, { color: theme.text }]}>
          <Text style={styles.boldText}>{item.user.name}</Text>{' '}
          {getNotificationText(item.type)}
        </Text>

        {item.tweet && (
          <Text style={[styles.tweetSnippet, { color: theme.textMuted }]} numberOfLines={2}>
            {item.tweet.content}
          </Text>
        )}

        <Text style={[styles.timeText, { color: theme.textMuted }]}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
        <TouchableOpacity onPress={() => fetchNotifications()} style={styles.refreshBtn}>
          <VectorIcon type="Feather" name="refresh-cw" size={18} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabContainer, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('All')}
          style={[styles.tabButton, activeTab === 'All' && { borderBottomColor: theme.primary }]}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'All' ? theme.text : theme.textMuted },
              activeTab === 'All' && { fontWeight: '700' },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('Mentions')}
          style={[styles.tabButton, activeTab === 'Mentions' && { borderBottomColor: theme.primary }]}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'Mentions' ? theme.text : theme.textMuted },
              activeTab === 'Mentions' && { fontWeight: '700' },
            ]}
          >
            Mentions
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {isNotificationsLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlashList
          data={filteredNotifications}
          keyExtractor={(item: any) => item.id}
          estimatedItemSize={100}
          renderItem={renderNotificationItem}
          ListEmptyComponent={
            <EmptyState
              title={activeTab === 'All' ? 'No notifications yet' : 'No mentions yet'}
              subtitle={
                activeTab === 'All'
                  ? 'When people like, repost, or reply to your posts, they will show up here.'
                  : 'When someone tags you in a post, it will show up here.'
              }
              icon="bell"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Notifications;

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
  headerTitle: {
    fontSize: fontSize.title,
    fontWeight: '800',
  },
  refreshBtn: {
    padding: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    height: 48,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notiItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  notiLeft: {
    width: 32,
    alignItems: 'flex-end',
    marginRight: 12,
  },
  notiRight: {
    flex: 1,
  },
  avatarRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  notiBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '700',
  },
  tweetSnippet: {
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
  timeText: {
    fontSize: 11,
    marginTop: 6,
  },
});
