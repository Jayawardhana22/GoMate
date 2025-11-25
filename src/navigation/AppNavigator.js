import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import Icon from '../components/Icon'; // <--- We import Icon here

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../utils/colors';

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

// Home Stack Navigator (Home -> Details)
function HomeStackNavigator() {
  const { isDarkMode } = useSelector((state) => state.theme);

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? colors.darkCard : colors.white,
        },
        headerTintColor: isDarkMode ? colors.textDark : colors.textPrimary,
        headerShadowVisible: !isDarkMode,
      }}
    >
      <HomeStack.Screen
        name="TransportList"
        component={HomeScreen}
        options={{ 
          title: 'GoMate',
          headerLargeTitle: true,
        }}
      />
      <HomeStack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          title: 'Details',
          headerStyle: {
            backgroundColor: colors.gradientStart,
          },
          headerTintColor: colors.white,
        }}
      />
    </HomeStack.Navigator>
  );
}

// Main Tab Navigator
function AppTabs() {
  const { isDarkMode } = useSelector((state) => state.theme);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // FIX: Changed <Feather> to <Icon>
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'map';
          else if (route.name === 'Favorites') iconName = 'heart';
          else if (route.name === 'Profile') iconName = 'user';
          
          return (
            <Icon
              name={iconName}
              size={size}
              color={color}
              fill={focused && route.name === 'Favorites' ? color : 'none'}
            />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: isDarkMode ? colors.darkCard : colors.white,
          borderTopColor: isDarkMode ? colors.darkBorder : colors.lightBg,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: isDarkMode ? colors.darkCard : colors.white,
        },
        headerTintColor: isDarkMode ? colors.textDark : colors.textPrimary,
        headerShadowVisible: !isDarkMode,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favorites' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppTabs />
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}