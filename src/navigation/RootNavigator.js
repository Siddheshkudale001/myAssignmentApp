import { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../core/firebase/authInstance";
import SplashScreen from "../screens/Splash/SplashScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import ProductListScreen from "../screens/Products/ProductListScreen";
import ProductDetailScreen from "../screens/Products/ProductDetailScreen";
import FavoritesScreen from "../screens/Favorites/FavoritesScreen";
import ProfileSettingsScreen from "../screens/Profile/ProfileSettingsScreen";
import AuthFlow from "./AuthFlow";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [user, setUser] = useState(undefined); 

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
    });
    return unsub;
  }, []);

  if (user === undefined) {
    return <SplashScreen />; // waiting for auth hydration
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ProductList" component={ProductListScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen
            name="ProfileSettings"
            component={ProfileSettingsScreen}
          />
        </>
      ) : (
        <Stack.Screen name="AuthFlow" component={AuthFlow} />
      )}
    </Stack.Navigator>
  );
}
