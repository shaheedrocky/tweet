import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './MainNavigation';
import StackNavigation from './StackNavigation';
import { AppProvider, useApp } from '../providers/AppProvider';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

const Navigation = () => {
  const { user, isLoading } = useApp();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigation /> : <StackNavigation />}
    </NavigationContainer>
  );
};

const RouteWrapper = () => {
  return (
    <AppProvider>
      <Navigation />
    </AppProvider>
  );
};

export default RouteWrapper;