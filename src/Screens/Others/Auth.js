import { StyleSheet, Text, View,SafeAreaView,StatusBar,ImageBackground,ScrollView,Image,Dimensions } from 'react-native'
import React, {useEffect,useCallback,useMemo} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native';
import { connectionChecker,getUserData,fetchingLogin } from '../../Redux/actions';
import { COLORS,FONTS } from '../../Utils';
import {ms} from 'react-native-size-matters';
import {Formik} from 'formik';
import * as yup from 'yup';
import { Input,Button } from '../../Components';
import { BG, BGAuth } from '../../Assets/Images';
const Auth = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const connection = useSelector(state => state.appData.connection);
  const loginUser = useSelector(state => state.appData.loginUser);
  const idUser = useSelector(state => state.appData.idUser);
  const accessToken = useSelector(state => state.appData.accessToken);
  console.log(accessToken)
  const loginValidation = yup.object().shape({
    email: yup
      .string()
      .email('Please Enter Valid Email!')
      .required('Email is Required!'),
    password: yup
      .string()
      .required('Password is Required!')
      
  });

  const goLogin = useCallback(values => {
    dispatch(fetchingLogin(values));
  }, []);

  useMemo(() => {
    loginUser && navigation.replace('MainApp');
  }, [loginUser]);

  useEffect(() => {
    dispatch(connectionChecker);
    if (loginUser) {
      navigation.replace('MainApp');
      dispatch(getUserData(accessToken,idUser));
    }
  }, [loginUser]);

  return (
     <Formik
      initialValues={{email: '', password: ''}}
      validationSchema={loginValidation}
      onSubmit={values => goLogin(values)}>
      {({handleChange, handleBlur, handleSubmit, values, errors}) => (
        <SafeAreaView style={styles.Container}>
          <StatusBar backgroundColor={'transparent'} translucent />
          <ImageBackground source={BGAuth} style={styles.ImageBackground} />
          <ScrollView contentContainerStyle={styles.Box}>
            <View style={styles.SoloAluminium}>
              <Text style={[styles.ImageSoloAluminium, {color: COLORS.black}]}>Solo </Text>
              <Text style={[styles.ImageSoloAluminium, {color: COLORS.green}]}>
                Aluminium
              </Text>
            </View>
            <View style={styles.Card}>
              <Text style={styles.ActivePage}>Login</Text>
              <Input
                icon={'email-outline'}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder={'Email'}
                error={errors.email}
              />
              <Input
                icon={'lock-outline'}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder={'Password'}
                error={errors.password}
                secureTextEntry={true}
              />
              <Button
                caption={'Masuk'}
                onPress={handleSubmit}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      )}


    </Formik>
  )
}

export default Auth
const window = Dimensions.get('screen');
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  ImageBackground: {
    position: 'absolute',
    width: window.width * 1,
    height: window.height * 1,
    backgroundColor:COLORS.black
  },
  Box: {
    flexGrow: 1,
    justifyContent: 'center',

    paddingVertical: ms(75),
  },
  ImageLogo: {
    width: ms(300),
    height: ms(100),
    marginRight: ms(10),
  },
  SoloAluminium: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ms(25),
  },
  ImageSoloAluminium: {
    fontFamily: FONTS.Regular,
    fontSize: ms(30),
    fontWeight: '700',
    color: COLORS.white,
  },
  Card: {
    backgroundColor:COLORS.green,
    width: window.width * 0.9,
    alignSelf: 'center',
    borderRadius: ms(15),
    paddingVertical: ms(20)
  },
  ActivePage: {
    fontFamily: FONTS.Bold,
    fontSize: ms(20),
    color: COLORS.white,
    alignSelf:'center',
    // borderBottomWidth: ms(4),
    // borderColor: COLORS.red,
    marginBottom:ms(15)
  },
})