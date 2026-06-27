import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import VectorIcon from '../common/VectorIcon';
import { useTheme } from '../../providers/ThemeProvider';

interface TweetActionsProps {
  comments?: number;
  reposts?: number;
  likes?: number;
  isLiked?: boolean;
  isReposted?: boolean;
  isBookmarked?: boolean;

  onComment?: () => void;
  onRepost?: () => void;
  onLike?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

const TweetActions: React.FC<TweetActionsProps> = ({
  comments = 0,
  reposts = 0,
  likes = 0,
  isLiked = false,
  isReposted = false,
  isBookmarked = false,
  onComment,
  onRepost,
  onLike,
  onShare,
  onBookmark,
}) => {
  const { theme } = useTheme();

  // Reanimated values for click feedback
  const likeScale = useSharedValue(1);
  const repostScale = useSharedValue(1);
  const bookmarkScale = useSharedValue(1);

  const handleLikePress = () => {
    likeScale.value = withSequence(
      withTiming(1.3, { duration: 100 }),
      withSpring(1, { damping: 4, stiffness: 150 })
    );
    if (onLike) onLike();
  };

  const handleRepostPress = () => {
    repostScale.value = withSequence(
      withTiming(1.3, { duration: 100 }),
      withSpring(1, { damping: 4, stiffness: 150 })
    );
    if (onRepost) onRepost();
  };

  const handleBookmarkPress = () => {
    bookmarkScale.value = withSequence(
      withTiming(1.3, { duration: 100 }),
      withSpring(1, { damping: 4, stiffness: 150 })
    );
    if (onBookmark) onBookmark();
  };

  const likeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const repostStyle = useAnimatedStyle(() => ({
    transform: [{ scale: repostScale.value }],
  }));

  const bookmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Comment */}
      <TouchableOpacity onPress={onComment} style={styles.actionBtn}>
        <VectorIcon type="Feather" name="message-circle" size={17} color={theme.textMuted} />
        <Text style={[styles.countText, { color: theme.textMuted }]}>{comments}</Text>
      </TouchableOpacity>

      {/* Repost */}
      <TouchableOpacity onPress={handleRepostPress} style={styles.actionBtn}>
        <Animated.View style={repostStyle}>
          <VectorIcon
            type="Feather"
            name="repeat"
            size={16}
            color={isReposted ? theme.success : theme.textMuted}
          />
        </Animated.View>
        <Text style={[styles.countText, { color: isReposted ? theme.success : theme.textMuted }]}>
          {reposts}
        </Text>
      </TouchableOpacity>

      {/* Like */}
      <TouchableOpacity onPress={handleLikePress} style={styles.actionBtn}>
        <Animated.View style={likeStyle}>
          <VectorIcon
            type="Ionicons"
            name={isLiked ? 'heart' : 'heart-outline'}
            size={18}
            color={isLiked ? theme.error : theme.textMuted}
          />
        </Animated.View>
        <Text style={[styles.countText, { color: isLiked ? theme.error : theme.textMuted }]}>
          {likes}
        </Text>
      </TouchableOpacity>

      {/* Bookmark */}
      <TouchableOpacity onPress={handleBookmarkPress} style={styles.actionBtn}>
        <Animated.View style={bookmarkStyle}>
          <VectorIcon
            type="Ionicons"
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={17}
            color={isBookmarked ? theme.primary : theme.textMuted}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Share */}
      <TouchableOpacity onPress={onShare} style={styles.actionBtn}>
        <VectorIcon type="Feather" name="share" size={16} color={theme.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

export default TweetActions;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
    paddingRight: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  countText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
});