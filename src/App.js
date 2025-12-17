// import React from 'react';
// import { StatusBar } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import RootNavigator from './navigation/RootNavigator';

// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { store, persistor } from './store';
// import Toast from 'react-native-toast-message';


// export default function App() {
//   return (
//     <Provider store={store}>
//       {/* <PersistGate loading={null} persistor={persistor}> */}
//         <NavigationContainer>
//           <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
//           <RootNavigator />
//         </NavigationContainer>
//         <Toast />
//       {/* </PersistGate> */}
//     </Provider>
//   );
// }
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';

import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import Toast from 'react-native-toast-message';

import { initAuthListener } from './core/firebase/authListener';

function AppBootstrap() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = initAuthListener(dispatch);
    return unsubscribe;
  }, [dispatch]);

  return (
    <>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <RootNavigator />
      </NavigationContainer>
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppBootstrap />
    </Provider>
  );
}
