import {View, StatusBar, StyleSheet, NativeModules} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ms} from 'react-native-size-matters';
import { connectionChecker,updatePassword } from '../../Redux/actions';
import {Formik} from 'formik';
import * as yup from 'yup';
import { Header,Input,Button } from '../../Components';
import { COLORS } from '../../Utils';

const EditPassword = ({navigation}) => {
  const dispatch = useDispatch();

  const connection = useSelector(state => state.appData.connection);
  const loginUser = useSelector(state => state.appData.loginUser);
  const accessToken = useSelector(state => state.appData.accessToken);
  const userData = useSelector(state => state.appData.userData);
  const idUser = useSelector(state => state.appData.idUser);
  const registerValidation = yup.object().shape({
    newPassword: yup
      .string()
      .required('New Password is Required!')
,
    confirmPassword: yup
      .string()
      .required('Confirm Password is Required!')
      .oneOf([yup.ref('newPassword')], 'Confirm Password Must Match')
  });

  useEffect(() => {
    dispatch(connectionChecker());
  }, [connection]);

  const goUpdate = useCallback(values => {
    dispatch(updatePassword(values, accessToken,idUser))
  }, []);

  return (
    <Formik
      initialValues={{
        newPassword: '',
        confirmPassword: '',
      }}
      validationSchema={registerValidation}
      onSubmit={values => goUpdate(values)}>
      {({handleChange, handleBlur, handleSubmit, values, errors}) => (
        <View style={styles.Container}>
          <StatusBar
            backgroundColor={'transparent'}
            translucent
            barStyle={'dark-content'}
          />
          <Header title={'Edit Password'} navigation={navigation} />
          <Input
            icon={'lock-reset'}
            onChangeText={handleChange('newPassword')}
            onBlur={handleBlur('newPassword')}
            value={values.newPassword}
            placeholder={'New Password'}
            error={errors.newPassword}
            secureTextEntry={true}
          />
          <Input
            icon={'lock-check-outline'}
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            value={values.confirmPassword}
            placeholder={'Confirm Password'}
            error={errors.confirmPassword}
            secureTextEntry={true}
          />
          <Button
            disabled={connection ? false : true}
            caption={'Update'}
            onPress={handleSubmit}
          />
        </View>
      )}
    </Formik>
  );
};

export default EditPassword;

const {StatusBarManager} = NativeModules;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: StatusBarManager.HEIGHT + ms(20),
  },
});
