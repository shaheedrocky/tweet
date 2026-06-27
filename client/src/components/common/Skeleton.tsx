import React, { useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/ThemeProvider';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 600 }),
        withTiming(0.3, { duration: 600 })
      ),
      -1, // infinite loop
      true // reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height: height as any,
          borderRadius,
          backgroundColor: theme.border,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export const TweetSkeleton = () => {
  return (
    <View style={styles.tweetSkeletonWrapper}>
      <Skeleton width={50} height={50} borderRadius={25} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Skeleton width={100} height={16} style={{ marginRight: 8 }} />
          <Skeleton width={80} height={16} />
        </View>
        <Skeleton width="90%" height={14} style={{ marginBottom: 6 }} />
        <Skeleton width="95%" height={14} style={{ marginBottom: 6 }} />
        <Skeleton width="40%" height={14} style={{ marginBottom: 12 }} />
        <Skeleton width="100%" height={160} borderRadius={12} />
      </View>
    </View>
  );
};

export default Skeleton;

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  tweetSkeletonWrapper: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0', // replaced dynamically in parents, standard divider
  },
});
