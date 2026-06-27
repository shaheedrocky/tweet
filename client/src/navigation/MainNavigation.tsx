import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from './BottomNavigation';
import TweetDetails from '../screens/app/TweetDetails';
import Profile from '../screens/app/Profile';
import EditProfile from '../screens/app/EditProfile';
import Settings from '../screens/app/Settings';
import FollowersFollowing from '../screens/app/FollowersFollowing';
import Bookmarks from '../screens/app/Bookmarks';
import Lists from '../screens/app/Lists';
import ListDetails from '../screens/app/ListDetails';
import TrendingTopics from '../screens/app/TrendingTopics';
import ChatConversation from '../screens/app/ChatConversation';
import { RootStackParamList } from './types';
import Subscription from '../screens/app/Subscription';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Main" component={BottomNavigation} />
      <Stack.Screen name="TweetDetails" component={TweetDetails} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen name="FollowersFollowing" component={FollowersFollowing} />
      <Stack.Screen name="Bookmarks" component={Bookmarks} />
      <Stack.Screen name="Lists" component={Lists} />
      <Stack.Screen name="ListDetails" component={ListDetails} />
      <Stack.Screen name="TrendingTopics" component={TrendingTopics} />
      <Stack.Screen name="ChatConversation" component={ChatConversation} />
    </Stack.Navigator>
  );
};

export default MainNavigation;