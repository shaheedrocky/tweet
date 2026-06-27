import { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabParamList = {
  HomeTab: undefined;
  ExploreTab: undefined;
  NotificationsTab: undefined;
  MessagesTab: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Main: NavigatorScreenParams<BottomTabParamList>;
  TweetDetails: { tweetId: string };
  Profile: { userId?: string };
  EditProfile: undefined;
  Settings: undefined;
  Subscription: undefined;
  FollowersFollowing: { userId: string; initialTab: 'followers' | 'following' };
  Bookmarks: undefined;
  Lists: undefined;
  ListDetails: { listId: string };
  TrendingTopics: { category?: string };
  ChatConversation: { conversationId: string; participantName: string };
};
