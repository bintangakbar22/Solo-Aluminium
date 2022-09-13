import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ms} from 'react-native-size-matters';
import { useSelector} from 'react-redux';
import { Home,Product,Finance,Account, Category } from '../Screens';
import { COLORS } from '../Utils';
import Toast from 'react-native-toast-message';
const Tab = createBottomTabNavigator();

const MainApp = () => {

  const loginUser = useSelector(state => state.appData.loginUser);
  const userData = useSelector(state => state.appData.userData);

  const handleNotLogin = ({navigation}) => ({
    tabPress: e => {
      if (!loginUser) {
        e.preventDefault();
        navigation.replace('Auth');
        Toast.show({
          type: 'error',
          text1: 'You are not login!',
        });
      }
    },
  });

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({color}) => {
          if (route.name === 'Beranda') {
            return <Icon name={'home-outline'} size={ms(22)} color={color} />;
          } else if (route.name === 'Barang') {
            return <Icon name={'package-variant-closed'} size={ms(22)} color={color} />;
          } else if (route.name === 'Kategori') {
            return <Icon name={'shape-outline'} size={ms(22)} color={color} />;
          } else if (route.name === 'Transaksi') {
            return <Icon name={'currency-usd'} size={ms(22)} color={color} />;
          } else if (route.name === 'Akun') {
            return <Icon name={'account-outline'} size={ms(22)} color={color} />;
          } 
        },
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: COLORS.black,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: COLORS.white,
          height: ms(60),
        //   borderTopLeftRadius: ms(30),
        //   borderTopRightRadius: ms(30),
          paddingHorizontal: ms(20),
          bottom:  ms(0),
        },
        tabBarItemStyle: {
          height: ms(40),
          marginHorizontal: ms(5),
          alignSelf:'center',
        },
        tabBarActiveBackgroundColor:COLORS.white
      })}>
      <Tab.Screen name="Beranda" component={Home} listeners={handleNotLogin}  />
      <Tab.Screen name="Kategori" component={Category} listeners={handleNotLogin} />
      <Tab.Screen name="Barang" component={Product} listeners={handleNotLogin} />
      {userData?.role_id!=2 &&
      <Tab.Screen name="Transaksi" component={Finance} listeners={handleNotLogin} />
      }
      <Tab.Screen name="Akun" component={Account} listeners={handleNotLogin} />
    </Tab.Navigator>
  )
}

export default MainApp