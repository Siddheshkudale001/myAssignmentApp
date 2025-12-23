// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import ProductListScreen from './ProductListScreen';
// import HistoryScreen from './HistoryScreen';

// const Tab = createMaterialTopTabNavigator();

// export default function ProductTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarIndicatorStyle: { backgroundColor: '#000' },
//         tabBarStyle: { elevation: 0 },
//         tabBarSafeAreaInsets: { top: 0 },
//       }}
//     >
//       <Tab.Screen name="Products" component={ProductListScreen} />
//       <Tab.Screen name="History" component={HistoryScreen} />
//     </Tab.Navigator>
//   );
// }
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductListScreen from './ProductListScreen';
import HistoryScreen from './HistoryScreen';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export default function ProductTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
        },
      }}
    >
      <Tab.Screen
        name="Products"
        component={ProductListScreen}
        options={{
          tabBarIcon: () => <Text>🛍️</Text>,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: () => <Text>🕘</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
