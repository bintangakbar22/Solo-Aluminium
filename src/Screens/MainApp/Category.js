import { StyleSheet, Text, View,NativeModules, StatusBar, FlatList,Dimensions, TouchableOpacity,RefreshControl } from 'react-native'
import React  ,{useEffect,useState,useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux/';
import {ms} from 'react-native-size-matters';
import { getCategory,connectionChecker, createCategory,updateCategory,deleteCategory } from '../../Redux/actions';
import { useIsFocused } from '@react-navigation/native';
import { COLORS,FONTS } from '../../Utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Formik} from 'formik';
import * as yup from 'yup';
import { Input,BottomModal,Header,ButtonPlus,Button } from '../../Components';
const Category = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.appData.accessToken);
  const category = useSelector(state => state.appData.category);
  const connection = useSelector(state => state.appData.connection);

  const [openModal, setopenModal] = useState(false);
  const [component, setComponent] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const getData = () =>{
    dispatch(getCategory(accessToken))
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
  });

  const goInput = useCallback(values => {
      dispatch(createCategory(values,accessToken)).then(()=>{setopenModal(false);getData()})
  }, []);

  const goUpdate = useCallback((values,idCate) => {
      dispatch(updateCategory(values,accessToken,idCate)).then(()=>{setopenModal(false);getData()})
  }, []);

  const goDelete = useCallback((idCate) => {
      dispatch(deleteCategory(accessToken,idCate)).then(()=>{setopenModal(false);getData()})
  }, []);

  const onOpen = (label,item) => {
    setopenModal(true);
    label=='input'||label=='update'?
    setComponent(
    <Formik
      initialValues={{
        name: label=='input'?'':item.name,
      }}
      validationSchema={categoryValidation}
      onSubmit={
        values => {
          label=='input'?goInput(values):goUpdate(values,item.id)}
        }>
      {({handleChange, handleBlur, handleSubmit, values, errors}) => (
        <View style={{padding:20}}>
          <Header title={label=='input'?'Tambah Kategori':'Update Kategori'} />
          <Input
            icon={'card-account-details'}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
            placeholder={'Nama Kategori'}
            error={errors.name}
          />
          <Button
            disabled={connection ? false : true}
            caption={label=='input'?'Submit':'Update'}
            onPress={handleSubmit}
            style={{height:50,backgroundColor:COLORS.green}}
          />
        </View>
      )}
    </Formik>
    )
    :
    setComponent(
    <View style={{padding:20}}>
      <Header title={'Apakah kamu yakin menghapus Kategori ini?'} />
      <Button
        disabled={connection ? false : true}
        caption={'Delete'}
        onPress={()=>goDelete(item.id)}
        style={{height:50,backgroundColor:COLORS.green}}
      />
    </View>
    )
  }


  const renderItem = ({item}) => (
    <View style={{width:window.width,justifyContent:'space-between',flexDirection:'row',padding:10,borderBottomWidth:1,borderColor:COLORS.black}} >
      <Text style={styles.Text}>{item.name}</Text>
      <View style={{flexDirection:'row'}}>
        <TouchableOpacity>
          <Icon name={'pencil-box'} size={ms(25)} color={COLORS.green} onPress={()=>{onOpen('update',item)}} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name={'delete'} size={ms(25)} color={COLORS.red} onPress={()=>{onOpen('delete',item)}}/>
        </TouchableOpacity>
      </View>
    </View>

  );
  return (
    <View style={styles.Container}>
      <StatusBar
        backgroundColor={openModal==true?'rgba(0,0,0,0.2)':'transparent'}
        barStyle="dark-content"
        translucent
      />
      <Header title={'Kategori'} input onPress={()=>{onOpen('input')}} />
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          numColumns={1}
          data={category}
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
          <BottomModal onDismiss={()=>{setopenModal(false)}}>
            {component}
          </BottomModal>
        )}
    </View>
  )
}
const window = Dimensions.get('window');
export default Category
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
    alignItems: 'flex-start',
    flexDirection:'column',
  },
  Text: {
    fontFamily: FONTS.Regular,
    fontSize: ms(16),
    color: COLORS.black,
  },
  
})