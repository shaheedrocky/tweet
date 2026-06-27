import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import Home from '../screens/app/Home';
import Explore from '../screens/app/Explore';
import Notifications from '../screens/app/Notifications';
import Messages from '../screens/app/Messages';
import VectorIcon from '../components/common/VectorIcon';
import { useTheme } from '../providers/ThemeProvider';
import { useApp } from '../providers/AppProvider';
import { BottomTabParamList } from './types';
import Profile from '../screens/app/Profile';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomNavigation = () => {
  const { theme } = useTheme();
  const { notifications, conversations } = useApp();

  // Dynamic badge counts
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const TabBadge = ({ count }: { count: number }) => {
    if (count <= 0) return null;
    return (
      <View style={[styles.badge, { backgroundColor: theme.primary }]}>
        <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarShowLabel: false, // Clean minimalist design
        tabBarStyle: {
          height: 60,
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <VectorIcon
              type="Ionicons"
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ExploreTab"
        component={Explore}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <VectorIcon
              type="Ionicons"
              name={focused ? 'search' : 'search-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="NotificationsTab"
        component={Notifications}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconWrapper}>
              <VectorIcon
                type="Ionicons"
                name={focused ? 'notifications' : 'notifications-outline'}
                size={24}
                color={color}
              />
              <TabBadge count={unreadNotifications} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="MessagesTab"
        component={Messages}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconWrapper}>
              <VectorIcon
                type="Ionicons"
                name={focused ? 'mail' : 'mail-outline'}
                size={24}
                color={color}
              />
              <TabBadge count={unreadMessages} />
            </View>
          ),
        }}
      />

       <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconWrapper}>
              <VectorIcon
                type="Ionicons"
                name={focused ? 'person' : 'person-outline'}
                size={24}
                color={color}
              />
              <TabBadge count={unreadMessages} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  tabIconWrapper: {
    position: 'relative',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
});