
// navigation/RootNavigator.js
import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import FavoritesScreen from '../screens/Favorites/FavoritesScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ProductDetailScreen from '../screens/Products/ProductDetailScreen';
import ProductListScreen from '../screens/Products/ProductListScreen';
import ProfileSettingsScreen from '../screens/Profile/ProfileSettingsScreen';

// Stack creators
const Stack = createNativeStackNavigator();

function AuthStack({ onSignedIn }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" options={{ title: 'Login' }}>
        {(props) => (
          // ✅ Pass callback so Login can flip to the App stack on success
          <LoginScreen {...props} onLoggedIn={onSignedIn} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Sign Up' }} />
    </Stack.Navigator>
  );
}

function AppStack({ userName = 'Siddhesh' }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" options={{ title: 'Home' }}>
        {(props) => <HomeScreen {...props} userName={userName} />}
      </Stack.Screen>

      <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Products' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Details' }} />

      <Stack.Screen name="Favorites" options={{ title: 'Favorites' }}>
        {(props) => <FavoritesScreen {...props} userName={userName} />}
      </Stack.Screen>

      <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} options={{ title: 'Profile & Settings' }} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  // Local auth flag — replace with your real auth (token/context) later
  const [isSignedIn, setIsSignedIn] = useState(false);

  return isSignedIn
    ? <AppStack userName="Siddhesh" />
    : <AuthStack onSignedIn={() => setIsSignedIn(true)} />;
}
