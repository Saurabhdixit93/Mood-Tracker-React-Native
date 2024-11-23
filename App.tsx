import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import MoodEntryScreen from './src/screens/MoodEntryScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import { MoodProvider } from './src/context/MoodContext';

export interface MoodEntry {
  mood: number;
  moodEmoji: string;
  moodLabel: string;
  note: string;
  timestamp: string;
}

export type RootStackParamList = {
  Home: undefined;
  MoodEntry: undefined;
  Insights: { 
    moodData: MoodEntry[];
    newEntry?: boolean;
    latestMood?: MoodEntry;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <MoodProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Mood Tracker' }}
          />
          <Stack.Screen 
            name="MoodEntry" 
            component={MoodEntryScreen} 
            options={{ title: 'Log Your Mood' }}
          />
          <Stack.Screen 
            name="Insights" 
            component={InsightsScreen} 
            options={{ title: 'Mood Insights' }}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </MoodProvider>
  );
}
