import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  NativeModules,
} from 'react-native';
import React, {useEffect,useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ms} from 'react-native-size-matters';
import { connectionChecker,updateUserData } from '../../Redux/actions';
import { Header,ImageShow,Input,Button } from '../../Components';
import { COLORS } from '../../Utils';
import { URL } from '../../Utils';
import {Formik} from 'formik';
import * as yup from 'yup';
import ImagePicker from 'react-native-image-picker';
import { URLAPI } from '../../Utils/Url';
import RNFetchBlob from 'rn-fetch-blob';

const EditAccount = ({navigation}) => {
  const dispatch = useDispatch();
  const connection = useSelector(state => state.appData.connection);
  const accessToken = useSelector(state => state.appData.accessToken);
  const userData = useSelector(state => state.appData.userData);
  const idUser = useSelector(state => state.appData.idUser);

  const [imageTrue,setImageTrue] = useState(false);
  const [ImageSource,setImageSource] = useState(null);
  const [imageName,setImageName] = useState(false);

  const dataValidation = yup.object().shape({
    name: yup.string().required('Name is Required!'),
    email: yup
      .string()
      .email('Please Enter Valid Email!')
      .required('Email is Required!'),
    address: yup.string().required('Address is Required!'),
  });

  const imagePicker = async handleChange => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        setImageTrue(true);
        setImageName(response.fileName)
        setImageSource(response.uri)
        handleChange(response.data);
      }
    });
  };

  const goUpdate = (values) => {
    if(imageTrue==false){
      dispatch(updateUserData(values, accessToken,idUser)).then(()=>{navigation.navigate("Akun")});
    }else{
        RNFetchBlob.fetch('POST', URLAPI + 'user/'+idUser+'/update', {
              Authorization: `Bearer ${accessToken}`,
              otherHeader: "foo",
              'Content-Type': 'multipart/form-data',
            }, [
                { name: 'picture', filename: imageName, type: 'image/png', data: values.image },
        ]).then((resp) => {
          console.log("Upload Picture Berhasil")
          dispatch(updateUserData(values, accessToken,idUser)).then(()=>{navigation.navigate("Akun")});
        }).catch((err) => {
          console.log("Upload gagal")
        })
      
    }
  }

  useEffect(() => {
    dispatch(connectionChecker());
  }, [connection]);

  return (
    <Formik
      initialValues={
        {
            name: userData.name,
            email: userData.email,
            address: userData.address,
            image: URL+userData.picture,
        }
      }
      validationSchema={dataValidation}
      onSubmit={values =>  goUpdate(values) }>
      {({handleChange, handleBlur, handleSubmit, values, errors}) => (
        <View style={styles.Container}>
        <StatusBar
            backgroundColor={'transparent'}
            translucent
            barStyle={'dark-content'}
        />
        <Header title={'Edit Akun'} navigation={navigation} />
        <ScrollView contentContainerStyle={styles.Box}>
          {imageTrue!=true ?
          <ImageShow
            onPress={() => imagePicker(handleChange('image'))}
            uri={values.image}
          />
          :
          <ImageShow
            onPress={() => imagePicker(handleChange('image'))}
            uri={ImageSource}
          />
          }
          
          <Input
            icon={'account-outline'}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
            placeholder={'Name'}
            error={errors.name}
          />
          <Input
            icon={'email-outline'}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            placeholder={'Email'}
            error={errors.email}
          />
          <Input
            icon={'home-outline'}
            onChangeText={handleChange('address')}
            onBlur={handleBlur('address')}
            value={values.address}
            placeholder={'Address'}
            error={errors.address}
          />
          <Button
            disabled={connection ? false : true}
            caption={'Update'}
            onPress={handleSubmit}
          />
        </ScrollView>
        </View>
      )}
    </Formik>
  );
};

export default EditAccount;

const {StatusBarManager} = NativeModules;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: StatusBarManager.HEIGHT + ms(20),
    paddingBottom:  ms(15),
  },
  Box: {
    flexGrow: 1,
    paddingVertical: ms(15),
  },
});
