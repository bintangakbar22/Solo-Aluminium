import { StyleSheet, Dimensions, ImageBackground,StatusBar } from 'react-native'
import React ,{useEffect} from 'react'
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../Utils';
import { SPLASH } from '../../Assets/Images';
import { useDispatch,useSelector } from 'react-redux'
const Splash = () => {
  const navigation = useNavigation();
  const loginUser = useSelector(state => state.appData.loginUser);
  useEffect(() => {
    setTimeout(() => {
      loginUser ? navigation.replace('MainApp'):navigation.replace('Auth');
    }, 1000);
  }, []);
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground style={styles.Image} source={SPLASH} />
    </>
  )
}

export default Splash
const window = Dimensions.get('screen');
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Image: {
    flex: 1,
    width: window.width,
    height: window.height,
  },
})