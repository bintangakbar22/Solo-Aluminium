import { StyleSheet, View,NativeModules, StatusBar, FlatList,Dimensions,RefreshControl, ScrollView } from 'react-native'
import React  ,{useEffect,useState,useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux/';
import {ms} from 'react-native-size-matters';

import { connectionChecker, createAdmin, deleteAdmin, getAllUser, resetPassword, rupiah, updateAdmin} from '../../../Redux/actions';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { COLORS,FONTS } from '../../../Utils';
import {Formik} from 'formik';
import * as yup from 'yup';
import { Input,BottomModal,Header,Button, ButtonBorder,ImageShow } from '../../../Components';
import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker from 'react-native-image-picker';
import { URL } from '../../../Utils';
import { URLAPI } from '../../../Utils/Url';
import RNFetchBlob from 'rn-fetch-blob';

const Users = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const accessToken = useSelector(state => state.appData.accessToken);
  const allUser = useSelector(state => state.appData.allUser);

  const [openModal, setopenModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [label, setLabel] = useState('');
  const [item, setItem] = useState(null);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Super Admin', value: 1},
    {label: 'Admin Cowok', value: 2},
    {label: 'Admin Cewek', value: 3},
  ]);
  const [value, setValue] = useState([]);

  const [imageTrue,setImageTrue] = useState(false);
  const [ImageSource,setImageSource] = useState(null);
  const [imageName,setImageName] = useState('');

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

  const getData = () =>{
    dispatch(getAllUser(accessToken))
  }

  const onRefresh = useCallback(() => {
    getData();
  }, []);

  useEffect(() => {
    if(isFocused){
        dispatch(connectionChecker());
        getData()
    }
  }, [isFocused]);

  const categoryValidation = yup.object().shape({
    name: yup
      .string()
      .required('Name is Required!'),
    email: yup
      .string()
      .email('Please Enter Valid Email!')
      .required('Email is Required!'),
    address: yup.string().required('Address is Required!'),
    password: yup.string().required('Pasword is Required!'),
  });

  const reset = () => {
      setValue([]);
      setImageSource(null);
      setImageTrue(false);
  }
  const goInput = (values) => {
      const role = value
      dispatch(createAdmin(values,accessToken,imageTrue,imageName,role))
      .then(()=>{
        setopenModal(false);
        getData();
        reset();
      })
  };

  const goUpdate = (values,id) => {
    if(imageTrue==false){
      dispatch(updateAdmin(values,accessToken,value,id))
      .then(()=>{
        setopenModal(false);
        getData();
        reset();
      })
    }else{
      RNFetchBlob.fetch('POST', URLAPI + 'admin/'+id+'/update', {
            Authorization: `Bearer ${accessToken}`,
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
          }, [
              { name: 'picture', filename: imageName, type: 'image/png', data: values.image },
      ]).then((resp) => {
        console.log("Upload Picture Berhasil")
        dispatch(updateAdmin(values,accessToken,value,id))
        .then(()=>{
          setopenModal(false);
          getData();
          reset();
        })
      }).catch((err) => {
        console.log("Update gagal")
      })
    }
  }

  const goDelete = useCallback((id) => {
      dispatch(deleteAdmin(accessToken,id)).then(()=>{setopenModal(false);getData();reset();})
  }, []);

  const goReset = useCallback((id) => {
      dispatch(resetPassword(accessToken,id)).then(()=>{setopenModal(false);getData();reset();})
  }, []);

  const renderItem = ({item}) => {
    return(
      <View style={{marginVertical:ms(5)}} >
        <ButtonBorder label={item.email} 
          color={COLORS.green}
          caption
          onPress={()=>{
            setLabel('update');
            setItem(item)
            setValue(item.role_id)
            setopenModal(true)
          }} 
          />
      </View>
    )
  }
  return (
    <View style={styles.Container}>
      <StatusBar
        backgroundColor={openModal==true?'rgba(0,0,0,0.2)':"transparent"}
        barStyle="dark-content"
        translucent
      />
      <Header title={'Karyawan'} navigation={navigation} input onPress={()=>{setopenModal(true);setLabel('input');setValue([]);}} />
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          numColumns={1}
          data={allUser}
          renderItem={renderItem}
          refreshing={true}
          onRefresh={() => onRefresh()}
          contentContainerStyle={styles.FlatlistContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getData()}
              tintColor={COLORS.softDark}
              colors={[COLORS.green]}
            />
          }
        />
        {openModal && (
          <BottomModal 
          onDismiss={()=>{
            setopenModal(false);
            setImageSource(null);
            setImageTrue(false);
          }}>
            <Formik
              initialValues={{
                name: label=='input'?'':item.name,
                email: label=='input'?'':item.email,
                password: label=='input'&&'',
                address: label=='input'?'':item.address,
                image: label=='input'?'':URL+item.picture,
              }}
              validationSchema={categoryValidation}
              onSubmit={
                values => {
                    label=='input'?goInput(values):goUpdate(values,item.id)}
                }>
              {({handleChange, handleBlur, handleSubmit, values, errors}) => (
                <View style={{padding:20}}>
                  <ScrollView showsVerticalScrollIndicator={false} >
                  <Header title={label=='input'?'Tambah Karyawan':'Update Karyawan'} />
                  {label=='update'&&
                  <>
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
                  </>
                  }
                  <Input
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    placeholder={'Name'}
                    error={errors.name}
                  />
                  <Input
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    placeholder={'email'}
                    error={errors.email}
                  />
                  {label=='input'&&
                  <Input
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    placeholder={'password'}
                    error={errors.password}
                  />
                  }
                  <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={styles.Dropdown}
                    textStyle={styles.dropDownText}
                    containerStyle={styles.dropdownView}
                    placeholder="Select Role"
                    listMode="SCROLLVIEW"
                  />
                  <Input
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                    value={values.address}
                    placeholder={'address'}
                    error={errors.address}
                  />
                  
                  {label=='update'?
                  <View>
                    <Button
                        caption={'Reset Password'}
                        onPress={()=>{goReset(item.id)}}
                        style={{height:50,backgroundColor:COLORS.black}}
                    />
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Button
                            disabled={value==[] ? true :false}
                            caption={'Update'}
                            onPress={handleSubmit}
                            style={{height:50,backgroundColor:COLORS.green,width:window.width*0.4}}
                        />
                        <Button
                            disabled={value==[] ? true :false}
                            caption={'Delete'}
                            onPress={()=>{goDelete(item.id)}}
                            style={{height:50,backgroundColor:COLORS.red,width:window.width*0.4}}
                        />
                    </View>           
                  </View>
                  :
                  <Button
                    caption={'Submit'}
                    onPress={handleSubmit}
                    style={{height:50,backgroundColor:COLORS.green}}
                  />
                  }
                  </ScrollView>
                </View>
              )}
            </Formik>
          </BottomModal>
        )}
    </View>
  )
}
const window = Dimensions.get('window');
export default Users
const {StatusBarManager} = NativeModules;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: StatusBarManager.HEIGHT,
    paddingBottom:  ms(60),
  },
  ImageBackground: {
    position: 'absolute',
    width: window.width * 1,
    height: window.height * 1,
    backgroundColor:COLORS.black
  },
  Box: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: ms(25),
  },
  FlatlistContainer: {
    alignItems: 'center',
    flexDirection:'column', 
    marginVertical:ms(10),
    paddingBottom:ms(35)
  },
  Text: {
    fontFamily: FONTS.Regular,
    fontSize: ms(16),
    color: COLORS.black,
  },
  dropDownText:{
    fontSize: ms(12),
    color: COLORS.black,
    paddingLeft: ms(10),
  },
  dropdownView:{
    width: window.width * 0.8,
    alignSelf: 'center',
    marginBottom:20
  }
})