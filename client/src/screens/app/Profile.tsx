import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useRoute, useNavigation } from '@react-navigation/native';
import FlashList from '../../components/common/AppFlashList';
import { useTheme } from '../../providers/ThemeProvider';
import { useApp } from '../../providers/AppProvider';
import { useTweets } from '../../hooks/useTweets';
import { apiService } from '../../services/api';
import { User, Tweet } from '../../types';
import TweetCard from '../../components/home/TweetCard';
import EmptyState from '../../components/common/EmptyState';
import VectorIcon from '../../components/common/VectorIcon';
import { HEIGHT, fontSize, WIDTH } from '../../utils/color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COVER_HEIGHT = HEIGHT * 0.18;
const AVATAR_SIZE = 76;

const Profile = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { user: currentUser, followUser, unfollowUser, following } = useApp();
  const { tweets, likeTweet, repostTweet, bookmarkTweet } = useTweets();

  // Determine user to display
  const routeUserId = route.params?.userId;
  const isMe = !routeUserId || routeUserId === currentUser?.id || routeUserId === 'current_user';

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'Posts' | 'Media' | 'Likes'>('Posts');
  const [loading, setLoading] = useState(true);

  // Scroll offset for Reanimated
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        if (isMe) {
          setProfileUser(currentUser);
        } else {
          // Fetch from mock user list
          const usersList = await apiService.fetchUsers('following');
          const found = usersList.find(u => u.id === routeUserId);
          setProfileUser(found || currentUser); // fallback
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [routeUserId, currentUser, isMe]);

  const isFollowingUser = profileUser ? following.some(u => u.id === profileUser.id) : false;

  const handleFollowPress = async () => {
    if (!profileUser) return;
    try {
      if (isFollowingUser) {
        await unfollowUser(profileUser.id);
        setProfileUser(prev => prev ? { ...prev, followersCount: Math.max(0, prev.followersCount - 1) } : null);
      } else {
        await followUser(profileUser.id);
        setProfileUser(prev => prev ? { ...prev, followersCount: prev.followersCount + 1 } : null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filter tweets based on active tab
  const profileTweets = React.useMemo(() => {
    if (!profileUser) return [];
    if (activeTab === 'Posts') {
      return tweets.filter(t => t.user.id === profileUser.id);
    } else if (activeTab === 'Likes') {
      return tweets.filter(t => t.isLiked);
    } else {
      // Media
      return tweets.filter(t => t.user.id === profileUser.id && t.media && t.media.length > 0);
    }
  }, [tweets, activeTab, profileUser]);

  // ANIMATED STYLES (Collapsible parallax header)
  const coverAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.5, 1.0],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, COVER_HEIGHT],
      [0, -COVER_HEIGHT * 0.4],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ scale }, { translateY }],
    };
  });

  const avatarAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, COVER_HEIGHT * 0.7],
      [1.0, 0.65],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, COVER_HEIGHT * 0.7],
      [0, COVER_HEIGHT * 0.15],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const headerTextAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [COVER_HEIGHT * 0.6, COVER_HEIGHT * 0.9],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const headerBgAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [COVER_HEIGHT * 0.6, COVER_HEIGHT * 0.9],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const tabIndicatorAnimatedStyle = useAnimatedStyle(() => {
    const tabWidth = SCREEN_WIDTH / 3;
    const index = activeTab === 'Posts' ? 0 : activeTab === 'Media' ? 1 : 2;
    return {
      transform: [{ translateX: index * tabWidth }],
    };
  });

  if (loading || !profileUser) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      {/* Cover Spacer */}
      <View style={{ height: COVER_HEIGHT }} />

      {/* Avatar Wrapper (overlapping cover) */}
      <Animated.View style={[styles.avatarContainer, avatarAnimatedStyle]}>
        <Image
          source={{ uri: profileUser.avatar }}
          style={[styles.avatar, { borderColor: theme.background }]}
        />
      </Animated.View>

      {/* Action Row: Edit Profile / Follow */}
      <View style={styles.actionRow}>
        <View style={{ flex: 1 }} />
        {isMe ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={[styles.editBtn, { borderColor: theme.border }]}
          >
            <Text style={[styles.editBtnText, { color: theme.text }]}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.followActions}>
            <TouchableOpacity
              style={[styles.mailBtn, { borderColor: theme.border }]}
              onPress={() =>
                navigation.navigate('ChatConversation', {
                  conversationId: 'c1',
                  participantName: profileUser.name,
                })
              }
            >
              <VectorIcon type="Feather" name="mail" size={16} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleFollowPress}
              style={[
                styles.followBtn,
                {
                  backgroundColor: isFollowingUser ? 'transparent' : theme.text,
                  borderColor: isFollowingUser ? theme.border : theme.text,
                },
              ]}
            >
              <Text style={{ color: isFollowingUser ? theme.text : theme.background, fontWeight: '700', fontSize: 13 }}>
                {isFollowingUser ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Profile Details */}
      <View style={styles.infoWrapper}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: theme.text }]}>{profileUser.name}</Text>
          {profileUser.isVerified && (
            <VectorIcon type="MaterialIcons" name="verified" size={18} color={theme.primary} style={styles.verified} />
          )}
        </View>
        <Text style={[styles.username, { color: theme.textMuted }]}>@{profileUser.username}</Text>

        {profileUser.bio ? (
          <Text style={[styles.bio, { color: theme.text }]}>{profileUser.bio}</Text>
        ) : null}

        {/* Location & Website & Join Date */}
        <View style={styles.metaRow}>
          {profileUser.location && (
            <View style={styles.metaItem}>
              <VectorIcon type="Feather" name="map-pin" size={13} color={theme.textMuted} />
              <Text style={[styles.metaText, { color: theme.textMuted }]}>{profileUser.location}</Text>
            </View>
          )}
          {profileUser.website && (
            <View style={styles.metaItem}>
              <VectorIcon type="Feather" name="link" size={12} color={theme.textMuted} />
              <Text style={[styles.metaText, { color: theme.primary }]}>{profileUser.website}</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <VectorIcon type="Feather" name="calendar" size={13} color={theme.textMuted} />
            <Text style={[styles.metaText, { color: theme.textMuted }]}>Joined March 2021</Text>
          </View>
        </View>

        {/* Followers / Following counts */}
        <View style={styles.relationsRow}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('FollowersFollowing', {
                userId: profileUser.id,
                initialTab: 'following',
              })
            }
            style={styles.relationsTouch}
          >
            <Text style={[styles.relationsCount, { color: theme.text }]}>
              {profileUser.followingCount}
            </Text>
            <Text style={[styles.relationsLabel, { color: theme.textMuted }]}>Following</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('FollowersFollowing', {
                userId: profileUser.id,
                initialTab: 'followers',
              })
            }
            style={styles.relationsTouch}
          >
            <Text style={[styles.relationsCount, { color: theme.text }]}>
              {profileUser.followersCount.toLocaleString()}
            </Text>
            <Text style={[styles.relationsLabel, { color: theme.textMuted }]}>Followers</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsRow, { borderBottomColor: theme.border }]}>
        {(['Posts', 'Media', 'Likes'] as const).map(tab => {
          const active = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={styles.tabItem}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: active ? theme.text : theme.textMuted },
                  active && { fontWeight: '800' },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Animated slider indicator */}
        <Animated.View
          style={[
            styles.tabIndicator,
            { backgroundColor: theme.primary },
            tabIndicatorAnimatedStyle,
          ]}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Floating Parallax Cover Image */}
      <Animated.Image
        source={{ uri: profileUser.cover || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600' }}
        style={[styles.coverImage, coverAnimatedStyle]}
        resizeMode="cover"
      />

      {/* Sticky Top Header Bar */}
      <View style={styles.stickyHeader}>
        <Animated.View
          style={[
            styles.stickyBg,
            { backgroundColor: theme.surface, borderBottomColor: theme.border },
            headerBgAnimatedStyle,
          ]}
        />
        <View style={styles.stickyContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 }]}>
            <VectorIcon type="Ionicons" name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <Animated.View style={[styles.headerTitles, headerTextAnimatedStyle]}>
            <Text style={[styles.headerNameText, { color: theme.text }]} numberOfLines={1}>
              {profileUser.name}
            </Text>
            <Text style={[styles.headerTweetsText, { color: theme.textMuted }]}>
              {profileTweets.length} posts
            </Text>
          </Animated.View>

          <TouchableOpacity onPress={()=> navigation.navigate('Settings')} style={[styles.moreBtn, { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 }]}>
            <VectorIcon type="Feather" name="settings" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Scroll Container */}
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {renderProfileHeader()}

        {/* Profile post feeds list */}
        <View style={{ minHeight: HEIGHT }}>
          <FlashList
            scrollEnabled={false}
            data={profileTweets}
            keyExtractor={(item: any) => item.id}
            estimatedItemSize={140}
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
                title="No posts here yet"
                subtitle="Posts, replies, and liked items will show up here."
                icon="message-square"
              />
            }
          />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: COVER_HEIGHT,
    zIndex: 1,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    zIndex: 5,
  },
  stickyBg: {
    ...StyleSheet.absoluteFill,
    borderBottomWidth: 0.5,
  },
  stickyContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    top: HEIGHT * 0.05
  },
  backBtn: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitles: {
    flex: 1,
    marginLeft: 16,
  },
  headerNameText: {
    fontSize: 15,
    fontWeight: '800',
  },
  headerTweetsText: {
    fontSize: 11,
  },
  moreBtn: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    backgroundColor: 'transparent',
  },
  avatarContainer: {
    position: 'absolute',
    top: COVER_HEIGHT - 38,
    left: 16,
    zIndex: 3,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
  },
  editBtn: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  followActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mailBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followBtn: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  infoWrapper: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
  },
  verified: {
    marginLeft: 4,
  },
  username: {
    fontSize: 13,
    marginTop: 1,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  relationsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 20,
    paddingBottom: 16,
  },
  relationsTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  relationsCount: {
    fontSize: 13,
    fontWeight: '800',
  },
  relationsLabel: {
    fontSize: 13,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    position: 'relative',
    height: 44,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: SCREEN_WIDTH / 3,
    height: 3,
  },
});