// // src/navigation/RootNavigator.js

// import { createNativeStackNavigator } from "@react-navigation/native-stack";


// import SplashScreen from "../screens/Splash/SplashScreen";
// import HomeScreen from "../screens/Home/HomeScreen";
// import ProductListScreen from "../screens/Products/ProductListScreen";
// import ProductDetailScreen from "../screens/Products/ProductDetailScreen";
// import FavoritesScreen from "../screens/Favorites/FavoritesScreen";
// import ProfileSettingsScreen from "../screens/Profile/ProfileSettingsScreen";
// import AuthFlow from "./AuthFlow";

// const Stack = createNativeStackNavigator();

// export default function RootNavigator({ isSignedIn }) {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Splash" component={SplashScreen} />

//       {!isSignedIn ? (
//         <Stack.Screen name="AuthFlow" component={AuthFlow} />
//       ) : (
//         <>
//           <Stack.Screen name="Home" component={HomeScreen} />

//           <Stack.Screen name="ProductList" component={ProductListScreen} />
//           <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />

//           <Stack.Screen name="Favorites" component={FavoritesScreen} />

//           <Stack.Screen
//             name="ProfileSettings"
//             component={ProfileSettingsScreen}
//           />
//         </>
//       )}
//     </Stack.Navigator>
//   );
// }
// src/navigation/RootNavigator.js
import { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/Splash/SplashScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import ProductListScreen from "../screens/Products/ProductListScreen";
import ProductDetailScreen from "../screens/Products/ProductDetailScreen";
import FavoritesScreen from "../screens/Favorites/FavoritesScreen";
import ProfileSettingsScreen from "../screens/Profile/ProfileSettingsScreen";
import AuthFlow from "./AuthFlow";

import { getUserSession } from "../services/session";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Load session once
  useEffect(() => {
    (async () => {
      const session = await getUserSession();
      setIsSignedIn(!!session);
      setLoading(false);
    })();
  }, []);

  // Callback passed to Login + Signup
  const handleLoggedIn = () => {
    setIsSignedIn(true);
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isSignedIn ? (
        <Stack.Screen name="AuthFlow">
          {(props) => <AuthFlow {...props} onLoggedIn={handleLoggedIn} />}
        </Stack.Screen>
      ) : (
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
      )}
    </Stack.Navigator>
  );
}
