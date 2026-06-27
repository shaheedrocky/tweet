import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import FlashList from '../../components/common/AppFlashList';
import { useTheme } from '../../providers/ThemeProvider';
import { useApp } from '../../providers/AppProvider';
import { apiService } from '../../services/api';
import { User } from '../../types';
import VectorIcon from '../../components/common/VectorIcon';
import EmptyState from '../../components/common/EmptyState';
import { fontSize } from '../../utils/color';

const FollowersFollowing = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { followUser, unfollowUser, following: myFollowingList } = useApp();

  const { userId, initialTab } = route.params;
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab || 'followers');
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await apiService.fetchUsers(activeTab);
      setUsers(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [activeTab]);

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFollowToggle = async (targetUser: User) => {
    const isFollowing = myFollowingList.some(u => u.id === targetUser.id);
    try {
      if (isFollowing) {
        await unfollowUser(targetUser.id);
      } else {
        await followUser(targetUser.id);
      }
      // Update local listing state dynamically
      setUsers(prev =>
        prev.map(u => {
          if (u.id === targetUser.id) {
            return {
              ...u,
              isFollowing: !isFollowing,
              followersCount: u.followersCount + (!isFollowing ? 1 : -1),
            };
          }
          return u;
        })
      );
    } catch (e) {
      console.error(e);
    }
  };

  const renderUserItem = ({ item }: { item: User }) => {
    // Check if we are following this user from global state
    const isFollowing = myFollowingList.some(u => u.id === item.id);
    const isMe = item.id === 'current_user';

    return (
      <TouchableOpacity
        onPress={() => navigation.push('Profile', { userId: item.id })}
        style={[styles.userRow, { borderBottomColor: theme.border }]}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />

        <View style={styles.userInfo}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {item.name} {item.isVerified && (
              <VectorIcon type="MaterialIcons" name="verified" size={14} color={theme.primary} />
            )}
          </Text>
          <Text style={[styles.username, { color: theme.textMuted }]} numberOfLines={1}>
            @{item.username}
          </Text>
          {item.bio ? (
            <Text style={[styles.bio, { color: theme.text }]} numberOfLines={1}>
              {item.bio}
            </Text>
          ) : null}
        </View>

        {!isMe && (
          <TouchableOpacity
            onPress={() => handleFollowToggle(item)}
            style={[
              styles.followBtn,
              {
                backgroundColor: isFollowing ? 'transparent' : theme.text,
                borderColor: isFollowing ? theme.border : theme.text,
              },
            ]}
          >
            <Text
              style={{
                color: isFollowing ? theme.text : theme.background,
                fontWeight: '700',
                fontSize: 12,
              }}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <VectorIcon type="Ionicons" name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>People</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabContainer, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('followers')}
          style={[styles.tabButton, activeTab === 'followers' && { borderBottomColor: theme.primary }]}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'followers' ? theme.text : theme.textMuted },
              activeTab === 'followers' && { fontWeight: '700' },
            ]}
          >
            Followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('following')}
          style={[styles.tabButton, activeTab === 'following' && { borderBottomColor: theme.primary }]}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'following' ? theme.text : theme.textMuted },
              activeTab === 'following' && { fontWeight: '700' },
            ]}
          >
            Following
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface }]}>
          <VectorIcon type="Feather" name="search" size={16} color={theme.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search users"
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlashList
          data={filteredUsers}
          keyExtractor={(item: any) => item.id}
          estimatedItemSize={70}
          renderItem={renderUserItem}
          ListEmptyComponent={
            <EmptyState
              title={activeTab === 'followers' ? 'No followers yet' : 'Not following anyone'}
              subtitle="This list will populate as follow relations occur."
              icon="users"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default FollowersFollowing;

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
  searchContainer: {
    padding: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    height: '100%',
    padding: 0,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
  username: {
    fontSize: 13,
    marginTop: 1,
  },
  bio: {
    fontSize: 13,
    marginTop: 4,
  },
  followBtn: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
});
