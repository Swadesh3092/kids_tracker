import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { KidProvider } from './src/context/KidContext';
import { getAllKids } from './src/db/kid';
import { initDatabase } from './src/db/database';
import { AddKidScreen } from './src/screens/AddKidScreen';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { DayDetailScreen } from './src/screens/DayDetailScreen';
import { EditKidScreen } from './src/screens/EditKidScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { WeightScreen } from './src/screens/WeightScreen';
import { colors } from './src/theme';
import { MainTabParamList, RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function OnboardingRoute({ navigation }: NativeStackScreenProps<RootStackParamList, 'Onboarding'>) {
  return <OnboardingScreen onDone={() => navigation.replace('Main')} />;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarIcon: ({ focused }) => (
          <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.5 }]}>
            {route.name === 'CalendarTab' ? '📅' : '⚖️'}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="CalendarTab" component={CalendarScreen} options={{ title: 'Calendar' }} />
      <Tab.Screen name="WeightTab" component={WeightScreen} options={{ title: 'Weight' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [hasKid, setHasKid] = useState(false);

  useEffect(() => {
    initDatabase();
    setHasKid(getAllKids().length > 0);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <KidProvider>
        <StatusBar style="dark" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName={hasKid ? 'Main' : 'Onboarding'} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Onboarding" component={OnboardingRoute} />
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="DayDetail"
              component={DayDetailScreen}
              options={{
                headerShown: true,
                headerTitle: '',
                headerShadowVisible: false,
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
              }}
            />
            <Stack.Screen name="AddKid" component={AddKidScreen} />
            <Stack.Screen name="EditKid" component={EditKidScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </KidProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  tabIcon: {
    fontSize: 22,
  },
});
