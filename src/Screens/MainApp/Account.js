import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  NativeModules,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux/';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {ms} from 'react-native-size-matters';
import {connectionChecker, getUserData, goLogout} from '../../Redux/actions';
import ButtonShadow from '../../Components/ButtonShadow';
import { COLORS,FONTS, URL } from '../../Utils';

const Akun = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const connection = useSelector(state => state.appData.connection);
  const loginUser = useSelector(state => state.appData.loginUser);
  const userData = useSelector(state => state.appData.userData);
  const idUser = useSelector(state => state.appData.idUser);
  const accessToken = useSelector(state => state.appData.accessToken);

  useEffect(() => {
    if (isFocused) {
      dispatch(connectionChecker());
      loginUser
        && dispatch(getUserData(accessToken,idUser))
    }
  }, [connection, loginUser]);

  return (
    <View style={styles.Container}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
        translucent
      />
        <ScrollView contentContainerStyle={styles.Box}>
          <View style={styles.Header}>
            <Text style={styles.Title}>Akun Saya</Text>
            {loginUser && userData ? (
              <>
              {userData?.picture!=null ?
                <Image source={{uri: URL+userData?.picture}} style={styles.Image} />
                :
                <Image  style={styles.Image} />
              }
              </>
            ) : (
              <Image  style={styles.Image} />
            )}
          </View>
          <View style={styles.Content}>
                <Text style={styles.Name} numberOfLines={1}>
                  {userData?.name}
                </Text>
                <ButtonShadow
                  shadowColor={COLORS.black}
                  onPress={() => navigation.navigate('EditAkun')}
                  icon={'account-edit-outline'}
                  caption={'Edit Akun'}
                />
                <ButtonShadow
                  shadowColor={COLORS.green}
                  onPress={() => navigation.navigate('EditPassword')}
                  icon={'lock-outline'}
                  caption={'Edit Password'}
                />
                <ButtonShadow
                  shadowColor={COLORS.red}
                  onPress={() => {
                    dispatch(goLogout(accessToken)).then(()=>{navigation.replace('Auth');});
                  }}
                  icon={'logout-variant'}
                  caption={'Keluar'}
                />
          </View>
        </ScrollView>
    </View>
  );
};

export default Akun;

const {StatusBarManager} = NativeModules;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: StatusBarManager.HEIGHT,
    paddingBottom: Platform.OS === 'ios' ? ms(75) : ms(60),
  },
  Box: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: ms(25),
  },
  Header: {
    backgroundColor: COLORS.green,
    width: ms(350),
    height: ms(175),
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomLeftRadius: ms(25),
    borderBottomRightRadius: ms(25),
  },
  Title: {
    fontFamily: FONTS.Bold,
    fontSize: ms(20),
    color: COLORS.white,

    top: ms(10),
  },
  Image: {
    backgroundColor: COLORS.grey,
    width: ms(120),
    height: ms(120),
    top: ms(50),
    borderRadius: ms(10),
  },
  Content: {
    width: ms(320),
    alignItems: 'center',

    marginTop: ms(65),
  },
  Name: {
    fontFamily: FONTS.Bold,
    fontSize: ms(15),
    color: COLORS.black,
  },
});
