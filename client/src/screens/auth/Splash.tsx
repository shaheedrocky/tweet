import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/ThemeProvider';
import VectorIcon from '../../components/common/VectorIcon';

const { width } = Dimensions.get('window');

const Splash = ({ navigation }: { navigation: any }) => {
  const { theme } = useTheme();
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Logo entry spring animation, then navigate to Sign In
    scale.value = withSequence(
      withTiming(0.8, { duration: 400 }),
      withSpring(1.2, { damping: 4, stiffness: 80 }),
      withSpring(1.0)
    );
    opacity.value = withTiming(1, { duration: 500 });

    const timeout = setTimeout(() => {
      navigation.replace('SignIn');
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <VectorIcon
          type="Ionicons"
          name="logo-twitter"
          size={width * 0.25}
          color={theme.primary}
        />
      </Animated.View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
