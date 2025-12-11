// import React, { useState } from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// // Screens
// import LoginScreen from '../screens/Auth/LoginScreen';
// import SignupScreen from '../screens/Auth/SignupScreen';
// import FavoritesScreen from '../screens/Favorites/FavoritesScreen';
// import HomeScreen from '../screens/Home/HomeScreen';
// import ProductDetailScreen from '../screens/Products/ProductDetailScreen';
// import ProductListScreen from '../screens/Products/ProductListScreen';
// import ProfileSettingsScreen from '../screens/Profile/ProfileSettingsScreen';

// const Stack = createNativeStackNavigator();

// export default function RootNavigator() {
//   const [isSignedIn, setIsSignedIn] = useState(false);

//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {isSignedIn ? (
//         <>
//           <Stack.Screen name="Home">
//             {(props) => (
//               <HomeScreen {...props} userName="Siddhesh" />
//             )}
//           </Stack.Screen>

//           <Stack.Screen name="ProductList" component={ProductListScreen} />
//           <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />

//           <Stack.Screen name="Favorites">
//             {(props) => (
//               <FavoritesScreen {...props} userName="Siddhesh" />
//             )}
//           </Stack.Screen>

//           <Stack.Screen name="ProfileSettings">
//             {(props) => (
//               <ProfileSettingsScreen
//                 {...props}
//                 onLogout={() => setIsSignedIn(false)}
//               />
//             )}
//           </Stack.Screen>
//         </>
//       ) : (
//         <>
//           <Stack.Screen name="Login">
//             {(props) => (
//               <LoginScreen {...props} onLoggedIn={() => setIsSignedIn(true)} />
//             )}
//           </Stack.Screen>

//           <Stack.Screen name="Signup" component={SignupScreen} />
//         </>
//       )}
//     </Stack.Navigator>
//   );
// }

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

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  // 🔥 This is SAFE — conditional return does NOT break hooks
  if (!isSignedIn) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen {...props} onLoggedIn={() => setIsSignedIn(true)} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home">
        {(props) => <HomeScreen {...props} userName="Siddhesh" />}
      </Stack.Screen>

      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />

      <Stack.Screen name="Favorites">
        {(props) => <FavoritesScreen {...props} userName="Siddhesh" />}
      </Stack.Screen>

      <Stack.Screen name="ProfileSettings">
        {(props) => (
          <ProfileSettingsScreen {...props} onLogout={() => setIsSignedIn(false)} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
