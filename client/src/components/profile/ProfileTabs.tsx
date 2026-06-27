import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

const tabs = ['Posts', 'Media', 'Likes'];

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / tabs.length;

const ProfileTabs = () => {
  const { theme } = useTheme();
  const [active, setActive] = useState('Posts');

  const translateX = useRef(new Animated.Value(0)).current;

  const handleTabPress = (tab: string, index: number) => {
    setActive(tab);

    Animated.spring(translateX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
  };

  return (
    <View
      style={{
        marginTop: 24,
        marginBottom:12,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.8}
            onPress={() => handleTabPress(tab, index)}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingBottom: 10,
            }}
          >
            <Text
              style={{
                color:
                  active === tab
                    ? theme.text
                    : theme.textMuted,
                fontWeight:
                  active === tab ? '700' : '500',
                fontSize: 15,
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Animated Indicator */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: (TAB_WIDTH - 40) / 2,
          width: 40,
          height: 3,
          borderRadius: 20,
          backgroundColor: theme.primary,
          transform: [{ translateX }],
        }}
      />
    </View>
  );
};

export default ProfileTabs;