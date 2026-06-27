import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RouteWrapper from './src/navigation/RouteWrapper';
import { ThemeProvider } from './src/providers/ThemeProvider';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RouteWrapper />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;