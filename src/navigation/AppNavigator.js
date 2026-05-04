import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Radii } from '../constants/theme';

// Auth screens
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';

// Main screens
import { HomeScreen } from '../screens/HomeScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { ItemDetailScreen } from '../screens/ItemDetailScreen';
import { RewardsScreen } from '../screens/RewardsScreen';
import { CartScreen } from '../screens/CartScreen';
import { TrackOrderScreen } from '../screens/TrackOrderScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { CouponsScreen } from '../screens/CouponsScreen';

// Splash
import { SplashScreen } from '../screens/SplashScreen';

import { useApp } from '../context/AppContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Arabic tab labels
const TAB_CONFIG = {
  Home:    { icon: 'home',    label: 'الرئيسية' },
  Menu:    { icon: 'coffee',  label: 'القائمة'  },
  Rewards: { icon: 'award',   label: 'المكافآت' },
  Profile: { icon: 'user',    label: 'حسابي'    },
};

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.pill}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const cfg = TAB_CONFIG[route.name] || { icon: 'circle', label: route.name };
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.8}
              style={[tabStyles.tab, isFocused && tabStyles.tabActive]}
            >
              <Feather
                name={cfg.icon}
                size={18}
                color={isFocused ? Colors.background : Colors.textMuted}
              />
              {isFocused && (
                <Text style={tabStyles.label}>{cfg.label}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  pill: {
    flexDirection: 'row', gap: 4,
    backgroundColor: 'rgba(17,17,17,0.95)',
    borderRadius: Radii.pill, paddingHorizontal: 8, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 20,
  },
  tab: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: Radii.pill, gap: 6,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  icon: { fontSize: 20 },
  iconActive: { fontSize: 18 },
  label: {
    color: Colors.background,
    fontSize: Typography.xs, fontWeight: Typography.bold,
    letterSpacing: Typography.wide,
  },
});

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="Coupons" component={CouponsScreen} />
      <Stack.Screen name="Map" component={HelpScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const { user } = useApp();
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
