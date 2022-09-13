import { StyleSheet, Text, View,NativeModules, StatusBar, FlatList,Dimensions, TouchableOpacity,RefreshControl } from 'react-native'
import React  ,{useEffect,useState,useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux/';
import {ms} from 'react-native-size-matters';
import { connectionChecker, getTransactions, createTransaction, updateTransaction, deleteTransaction,rupiah, getProducts } from '../../Redux/actions';
import { useIsFocused } from '@react-navigation/native';
import { COLORS,FONTS } from '../../Utils';
import {Formik} from 'formik';
import * as yup from 'yup';
import { Input,BottomModal,Header,Button,CardBorder, ButtonBorder } from '../../Components';
import DropDownPicker from 'react-native-dropdown-picker';

const Finance = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.appData.accessToken);
  const transactions = useSelector(state => state.appData.transactions);
  const products = useSelector(state => state.appData.products);

  const transDebit = transactions.filter(i=>i.type=="debit")
  const transCredit = transactions.filter(i=>i.type=="credit")
  const totalDebit = transDebit.map(i=>i.total).reduce((a, b) => a + b, 0) 
  const totalCredit = transCredit.map(i=>i.total).reduce((a, b) => a + b, 0) 

  const [openModal, setopenModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [label, setLabel] = useState('');
  const [item, setItem] = useState(null);
  
  const productItems = products.map(i=>({
    label:i.name +"  "+i.code,
    value:i.id
  }))


  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Debit', value: "debit"},
    {label: 'Credit', value: "credit"},
  ]);
  const [value, setValue] = useState([]);

  const [openProduct, setOpenProduct] = useState(false);
  const [itemsProduct, setItemsProduct] = useState(productItems);
  const [valueProduct, setValueProduct] = useState([]);


  const getData = () =>{
    dispatch(getTransactions(accessToken))
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
     getData()
  }, [isFocused]);

  const categoryValidation = yup.object().shape({
    quantity: yup
      .string()
      .required('Quantity is Required!')
    ,
  });

  const goInput = useCallback(values => {
      const data = {
        type:value,
        quantity:values.quantity,
        product_id:valueProduct
      }
      dispatch(createTransaction(data,accessToken))
      .then(()=>{
        setopenModal(false);
        getData();
        setValue([]);
        setValueProduct([])
      })
  }, [value,valueProduct]);

  const goUpdate = useCallback((values,id) => {
      const data = {
        type:value,
        quantity:values.quantity,
        product_id:valueProduct,
        id:id
      }
      dispatch(updateTransaction(data,accessToken)).then(()=>{setopenModal(false);getData()})
  }, [value,valueProduct]);

  const goDelete = useCallback((id) => {
      dispatch(deleteTransaction(accessToken,id)).then(()=>{setopenModal(false);getData()})
  }, []);

  const renderItem = ({item}) => {
    const productT = products.filter(i=>{
        return i.id==item.product_id
    })
    const productName = productT.map(p=>p.name.toString())
    return(
      <View style={{marginVertical:ms(5)}} >
        <ButtonBorder label={productName} value={`Rp. ${rupiah(item.total)}`} 
          color={item.type=='debit'?COLORS.green:COLORS.red}
          onPress={()=>{
            setLabel('update');
            setItem(item)
            setValue(item.type)
            setValueProduct(item.product_id)
            setopenModal(true)
          }} />
      </View>
    )

  }

  const headerComponent = (
    <View style={{flexDirection:'row',justifyContent:'center',marginBottom:ms(20)}} >
        <CardBorder label={'debit'} color={COLORS.green} value={`Rp. ${rupiah(totalDebit)}`}/>
        <CardBorder label={'credit'} color={COLORS.red} value={`Rp. ${rupiah(totalCredit)}`}/>
    </View>
  )
  return (
    <View style={styles.Container}>
      <StatusBar
        backgroundColor={openModal==true?'rgba(0,0,0,0.2)':"transparent"}
        barStyle="dark-content"
        translucent
      />
      <Header title={'Transaksi'} input onPress={()=>{setopenModal(true);setLabel('input')}} />
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          numColumns={1}
          data={transactions}
          renderItem={renderItem}
          refreshing={true}
          onRefresh={() => onRefresh()}
          contentContainerStyle={styles.FlatlistContainer}
          ListHeaderComponent={headerComponent}
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
            <Formik
              initialValues={{
                quantity: label=='input'?'':item.quantity.toString(),
              }}
              validationSchema={categoryValidation}
              onSubmit={
                values => {
                    label=='input'?goInput(values):goUpdate(values,item.id)}
                }>
              {({handleChange, handleBlur, handleSubmit, values, errors}) => (
                <View style={{padding:20}}>
                  <Header title={label=='input'?'Tambah Transaksi':'Update Transaksi'} />
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
                    placeholder="Select Type"
                    listMode="SCROLLVIEW"
                  />
                  <Input
                    icon={'currency-try'}
                    onChangeText={handleChange('quantity')}
                    onBlur={handleBlur('quantity')}
                    value={values.quantity}
                    placeholder={'Product Qty'}
                    error={errors.quantity}
                    numeric
                  />
                  <DropDownPicker
                    open={openProduct}
                    value={valueProduct}
                    items={itemsProduct}
                    setOpen={setOpenProduct}
                    setValue={setValueProduct}
                    setItems={setItemsProduct}
                    style={styles.Dropdown}
                    textStyle={styles.dropDownText}
                    containerStyle={styles.dropdownView}
                    placeholder="Select Product"
                    listMode="SCROLLVIEW"
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
                    disabled={value==[]&&valueProduct==[] ? true :false}
                    caption={'Submit'}
                    onPress={handleSubmit}
                    style={{height:50,backgroundColor:COLORS.green}}
                  />
                  }
                  
                </View>
              )}
            </Formik>
          </BottomModal>
        )}
    </View>
  )
}
const window = Dimensions.get('window');
export default Finance
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