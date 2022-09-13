import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import Router from './Router';
import Store ,{PersistStore} from './Redux/store/store';

const App = () => {
  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={PersistStore}>
        <NavigationContainer>
          <Router />
          <Toast />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
