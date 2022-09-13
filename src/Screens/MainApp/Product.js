import { StyleSheet, View,NativeModules, StatusBar, FlatList,Dimensions,RefreshControl, ScrollView } from 'react-native'
import React  ,{useEffect,useState,useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux/';
import {ms} from 'react-native-size-matters';
import { connectionChecker, rupiah, getProducts, createProduct, updateProduct, deleteProduct } from '../../Redux/actions';
import { useIsFocused } from '@react-navigation/native';
import { COLORS,FONTS } from '../../Utils';
import {Formik} from 'formik';
import * as yup from 'yup';
import { Input,BottomModal,Header,Button, ButtonBorder,ImageShow } from '../../Components';
import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker from 'react-native-image-picker';
import { URL } from '../../Utils';
import { URLAPI } from '../../Utils/Url';
import RNFetchBlob from 'rn-fetch-blob';

const Product = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const accessToken = useSelector(state => state.appData.accessToken);
  const products = useSelector(state => state.appData.products);
  const category = useSelector(state => state.appData.category);
  const userData = useSelector(state => state.appData.userData);
  const [openModal, setopenModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [label, setLabel] = useState('');
  const [item, setItem] = useState(null);

  const categoryItems = category.map(i=>({
    label:i.name,
    value:i.id
  }))

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(categoryItems);
  const [value, setValue] = useState([]);

  const [imageTrue,setImageTrue] = useState(false);
  const [ImageSource,setImageSource] = useState(null);
  const [imageName,setImageName] = useState(false);

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
    dispatch(getProducts(accessToken))
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
      .required('Name is Required!')
    ,
    code: yup
      .string()
      .required('Code is Required!')
    ,
    price: yup
      .string()
      .required('Price is Required!')
    ,
    stock: yup
      .string()
      .required('Stock is Required!')
    ,
    width: yup
      .string()
      .required('Width is Required!')
    ,
    length: yup
      .string()
      .required('Length is Required!')
    ,
  });

  const reset = () => {
      setValue([]);
      setImageSource(null);
      setImageTrue(false);
  }
  const goInput = (values) => {
      dispatch(createProduct(values,accessToken,imageTrue,imageName,value,userData.id))
      .then(()=>{
        setopenModal(false);
        getData();
        reset();
      })
  };

  const goUpdate = (values,id) => {
    if(imageTrue==false){
      dispatch(updateProduct(values,accessToken,value,id))
      .then(()=>{
        setopenModal(false);
        getData();
        reset();
      })
    }else{
      RNFetchBlob.fetch('POST', URLAPI + 'product/'+id+'/update', {
            Authorization: `Bearer ${accessToken}`,
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
          }, [
              { name: 'picture', filename: imageName, type: 'image/png', data: values.image },
      ]).then((resp) => {
        console.log("Upload Picture Berhasil")
        dispatch(updateProduct(values,accessToken,value,id))
        .then(()=>{
          setopenModal(false);
          getData();
          setValue([]);
          setImageSource(null);
          setImageTrue(false);
        })
      }).catch((err) => {
        console.log("Upload gagal")
      })
    }
  }

  const goDelete = useCallback((id) => {
      dispatch(deleteProduct(accessToken,id)).then(()=>{setopenModal(false);getData();reset();})
  }, []);

  const renderItem = ({item}) => {
    return(
      <View style={{marginVertical:ms(5)}} >
        <ButtonBorder label={item.name} value={`Rp. ${rupiah(item.price)}`} 
          color={COLORS.green}
          onPress={()=>{
            setLabel('update');
            setItem(item)
            setValue(item.category_id)
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
      <Header title={'Barang'} input onPress={()=>{setopenModal(true);setLabel('input');setValue([]);}} />
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          numColumns={1}
          data={products}
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
                stock: label=='input'?'':item.stock.toString(),
                code: label=='input'?'':item.code,
                price: label=='input'?'':item.price.toString(),
                length: label=='input'?'':item.width.toString(),
                width: label=='input'?'':item.length.toString(),
                image:label=='input'?'':URL+item.picture,

              }}
              validationSchema={categoryValidation}
              onSubmit={
                values => {
                    label=='input'?goInput(values):goUpdate(values,item.id)}
                }>
              {({handleChange, handleBlur, handleSubmit, values, errors}) => (
                <View style={{padding:20}}>
                  <ScrollView showsVerticalScrollIndicator={false} >
                  <Header title={label=='input'?'Tambah Barang':'Update Barang'} />
                  {label=='update' &&
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
                    placeholder={'Product Name'}
                    error={errors.name}
                  />
                  <Input
                    onChangeText={handleChange('code')}
                    onBlur={handleBlur('code')}
                    value={values.code}
                    placeholder={'Product Code'}
                    error={errors.code}
                  />
                  <Input
                    onChangeText={handleChange('price')}
                    onBlur={handleBlur('price')}
                    value={values.price}
                    placeholder={'Price'}
                    error={errors.price}
                    numeric
                  />
                  <Input
                    onChangeText={handleChange('stock')}
                    onBlur={handleBlur('stock')}
                    value={values.stock}
                    placeholder={'stock'}
                    error={errors.stock}
                    numeric
                  />
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
                    placeholder="Select Category"
                    listMode="SCROLLVIEW"
                  />
                  <Input
                    onChangeText={handleChange('length')}
                    onBlur={handleBlur('length')}
                    value={values.length}
                    placeholder={'length'}
                    error={errors.length}
                    numeric
                  />
                  <Input
                    onChangeText={handleChange('width')}
                    onBlur={handleBlur('width')}
                    value={values.width}
                    placeholder={'width'}
                    error={errors.width}
                    numeric
                  />
                  {label=='update'?
                  <View style={{flexDirection:'row',justifyContent:'center'}}>
                  <Button
                    disabled={value==[]&&valueProduct==[] ? true :false}
                    caption={'Update'}
                    onPress={handleSubmit}
                    style={{height:50,backgroundColor:COLORS.green,width:window.width*0.4}}
                  />
                  <Button
                    disabled={value==[]&&valueProduct==[] ? true :false}
                    caption={'Delete'}
                    onPress={()=>{goDelete(item.id)}}
                    style={{height:50,backgroundColor:COLORS.red,width:window.width*0.4}}
                  />
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
export default Product
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