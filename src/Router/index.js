import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  Splash,
  Auth,
  EditAccount,
  EditPassword,
  Users,
  EditUser
} from '../Screens';
import MainApp from './MainApp';

const Router = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Splash">
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="MainApp" component={MainApp} />
      <Stack.Screen name="EditAkun" component={EditAccount} />
      <Stack.Screen name="EditPassword" component={EditPassword} />
      <Stack.Screen name="Karyawan" component={Users} />
      <Stack.Screen name="EditKaryawan" component={EditUser} />
    </Stack.Navigator>
  );
};

export default Router;
