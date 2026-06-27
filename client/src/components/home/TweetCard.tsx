import React from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../providers/ThemeProvider';
import { Tweet } from '../../types';
import TweetActions from './TweetActions';
import Poll from './Poll';
import LinkPreview from './LinkPreview';
import VectorIcon from '../common/VectorIcon';

interface TweetCardProps {
  item: Tweet;
  onLike?: () => void;
  onRepost?: () => void;
  onBookmark?: () => void;
}

const TweetCard: React.FC<TweetCardProps> = ({
  item,
  onLike,
  onRepost,
  onBookmark,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  // Video State
  const [isPlayingVideo, setIsPlayingVideo] = React.useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = React.useState(0);

  // Audio State
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = React.useState(0);

  // Video interval timer
  React.useEffect(() => {
    let interval: any;
    if (isPlayingVideo) {
      interval = setInterval(() => {
        setVideoCurrentTime(prev => {
          if (prev >= 15) {
            setIsPlayingVideo(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingVideo]);

  // Audio interval timer
  React.useEffect(() => {
    let interval: any;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioCurrentTime(prev => {
          if (prev >= 12) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const handleCardPress = () => {
    navigation.push('TweetDetails', { tweetId: item.id });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `@${item.user.username} posted on X: "${item.content}"`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getVideoThumbnail = () => {
    if (item.video === 'mock_paris_drone.mp4') return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop';
    if (item.video === 'mock_waterfall.mp4') return 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop';
    if (item.video === 'mock_coding.mp4') return 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop';
  };

  const getVideoTitle = () => {
    if (item.video === 'mock_paris_drone.mp4') return 'Paris Drone Tour';
    if (item.video === 'mock_waterfall.mp4') return 'Waterfall Nature';
    if (item.video === 'mock_coding.mp4') return 'Matrix Coding';
    return 'Video Attachment';
  };

  const renderMedia = () => {
    if (!item.media || item.media.length === 0) return null;

    if (item.media.length === 1) {
      return (
        <Image
          source={{ uri: item.media[0] }}
          style={styles.singleImage}
          resizeMode="cover"
        />
      );
    }

    return (
      <View style={styles.mediaGrid}>
        {item.media.map((uri, idx) => (
          <Image
            key={idx}
            source={{ uri }}
            style={[
              styles.gridImage,
              { borderColor: theme.background },
            ]}
            resizeMode="cover"
          />
        ))}
      </View>
    );
  };

  const renderVideo = () => {
    if (!item.video) return null;

    const thumbnail = getVideoThumbnail();
    const title = getVideoTitle();

    return (
      <View style={[styles.videoContainer, { backgroundColor: theme.border }]}>
        <Image source={{ uri: thumbnail }} style={styles.videoCardImage} />
        
        {/* Play/Pause Button Overlay */}
        <TouchableOpacity
          onPress={() => setIsPlayingVideo(!isPlayingVideo)}
          style={styles.videoPlayOverlay}
        >
          <VectorIcon
            type="Ionicons"
            name={isPlayingVideo ? 'pause-circle' : 'play-circle'}
            size={56}
            color="#fff"
          />
        </TouchableOpacity>

        {/* Video Duration Badge */}
        <Text style={styles.videoBadge}>{title}</Text>

        {/* Playback Control Bar */}
        <View style={[styles.videoPlaybackBar, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
          <Text style={styles.playbackTimer}>
            0:{videoCurrentTime < 10 ? '0' : ''}{videoCurrentTime} / 0:15
          </Text>
          <View style={[styles.playbackProgressBg, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
            <View
              style={[
                styles.playbackProgressActive,
                {
                  width: `${(videoCurrentTime / 15) * 100}%`,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderAudio = () => {
    if (!item.audio) return null;

    const barsCount = 18;
    const activeBarIndex = Math.floor((audioCurrentTime / 12) * barsCount);
    const barHeights = [
      12, 24, 18, 30, 22, 14, 28, 34, 40, 32, 20, 26, 36, 22, 12, 18, 24, 10
    ];

    return (
      <View style={[styles.audioCard, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        {/* Play/Pause Button */}
        <TouchableOpacity
          onPress={() => setIsPlayingAudio(!isPlayingAudio)}
          style={[styles.audioPlayBtn, { backgroundColor: theme.primary }]}
        >
          <VectorIcon
            type="Ionicons"
            name={isPlayingAudio ? 'pause' : 'play'}
            size={18}
            color="#fff"
          />
        </TouchableOpacity>

        {/* Waveform Visualizer */}
        <View style={styles.audioWaveform}>
          {barHeights.map((height, idx) => {
            const isActive = idx <= activeBarIndex && audioCurrentTime > 0;
            return (
              <View
                key={idx}
                style={[
                  styles.audioWaveBar,
                  {
                    height: height * 0.7,
                    backgroundColor: isActive ? theme.primary : theme.textMuted,
                    opacity: isActive ? 1 : 0.4,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Time counter */}
        <Text style={[styles.audioDurationText, { color: theme.textMuted }]}>
          0:{audioCurrentTime < 10 ? '0' : ''}{audioCurrentTime} / 0:12
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={handleCardPress}
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <View style={styles.cardInner}>
        {/* Left Side: Avatar */}
        <TouchableOpacity
          onPress={() => navigation.push('Profile', { userId: item.user.id })}
          style={styles.avatarWrapper}
        >
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        </TouchableOpacity>

        {/* Right Side: Content info */}
        <View style={styles.contentColumn}>
          {/* Author info row */}
          <View style={styles.authorRow}>
            <TouchableOpacity
              onPress={() => navigation.push('Profile', { userId: item.user.id })}
              style={styles.nameContainer}
            >
              <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
                {item.user.name}
              </Text>
              {item.user.isVerified && (
                <VectorIcon
                  type="MaterialIcons"
                  name="verified"
                  size={15}
                  color={theme.primary}
                  style={styles.verifiedIcon}
                />
              )}
              <Text style={[styles.username, { color: theme.textMuted }]} numberOfLines={1}>
                @{item.user.username}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.timestamp, { color: theme.textMuted }]}>
              · {item.timestamp}
            </Text>
          </View>

          {/* Reply line identifier */}
          {item.replyTo && (
            <Text style={[styles.replyingToText, { color: theme.textMuted }]}>
              Replying to <Text style={{ color: theme.primary }}>@{item.replyTo}</Text>
            </Text>
          )}

          {/* Tweet Text */}
          <Text style={[styles.tweetText, { color: theme.text }]}>
            {item.content}
          </Text>

          {/* Optional Attachments */}
          {renderMedia()}
          {renderVideo()}
          {renderAudio()}
          {item.poll && <Poll tweetId={item.id} poll={item.poll} />}
          {item.linkPreview && <LinkPreview preview={item.linkPreview} />}

          {/* Views count display */}
          <View style={styles.metaRow}>
            <VectorIcon type="Feather" name="bar-chart-2" size={13} color={theme.textMuted} />
            <Text style={[styles.metaText, { color: theme.textMuted }]}>
              {item.views > 999999
                ? `${(item.views / 1000000).toFixed(1)}M`
                : item.views > 999
                ? `${(item.views / 1000).toFixed(1)}K`
                : item.views}{' '}
              views
            </Text>
          </View>

          {/* Action row (Scale animated) */}
          <TweetActions
            comments={item.comments}
            reposts={item.reposts}
            likes={item.likes}
            isLiked={item.isLiked}
            isReposted={item.isReposted}
            isBookmarked={item.isBookmarked}
            onComment={handleCardPress}
            onLike={onLike}
            onRepost={onRepost}
            onBookmark={onBookmark}
            onShare={handleShare}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(TweetCard);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  cardInner: {
    flexDirection: 'row',
  },
  avatarWrapper: {
    marginRight: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  contentColumn: {
    flex: 1,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  name: {
    fontWeight: '800',
    fontSize: 14,
    marginRight: 3,
  },
  verifiedIcon: {
    marginRight: 4,
  },
  username: {
    fontSize: 13,
  },
  timestamp: {
    fontSize: 13,
    marginLeft: 4,
  },
  replyingToText: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 4,
  },
  tweetText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  singleImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginTop: 10,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 10,
    height: 180,
  },
  gridImage: {
    width: '50%',
    height: '100%',
    borderWidth: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  videoContainer: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 10,
  },
  videoCardImage: {
    width: '100%',
    height: '100%',
  },
  videoPlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  videoBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontWeight: '700',
  },
  videoPlaybackBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  playbackTimer: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginRight: 8,
  },
  playbackProgressBg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  playbackProgressActive: {
    height: '100%',
  },
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  audioPlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioWaveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    marginHorizontal: 16,
  },
  audioWaveBar: {
    width: 3,
    borderRadius: 1.5,
    marginHorizontal: 1.5,
  },
  audioDurationText: {
    fontSize: 11,
    fontWeight: '700',
  },
});