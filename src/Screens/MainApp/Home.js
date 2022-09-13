import { StyleSheet, Text, View,SafeAreaView,StatusBar,ScrollView,Dimensions,Image } from 'react-native'
import React ,{useEffect,useState} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { COLORS, FONTS } from '../../Utils';
import CardWelcome from '../../Components/CardWelcome';
import { connectionChecker,getAllInProducts,getAllOutProducts,getAllUser,getProducts,getTotalExpense,getTotalIncome,getUserData,rupiah ,getCategory} from '../../Redux/actions';
import { useNavigation,useIsFocused } from '@react-navigation/native';
import CardIcon from '../../Components/CardIcon';
import { ms } from 'react-native-size-matters';
import moment from 'moment';
import 'moment/locale/id'

const Home = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [currentDate, setCurrentDate] = useState('');

  const connection = useSelector(state => state.appData.connection);
  const loginUser = useSelector(state => state.appData.loginUser);
  const userData = useSelector(state => state.appData.userData);
  const accessToken = useSelector(state => state.appData.accessToken);
  const idUser = useSelector(state => state.appData.idUser);

  const products = useSelector(state => state.appData.products);
  const allProductsIn = useSelector(state => state.appData.allProductsIn);
  const allProductsOut = useSelector(state => state.appData.allProductsOut);
  const totalIncome = useSelector(state => state.appData.totalIncome);
  const totalExpense = useSelector(state => state.appData.totalExpense);
  const allUser = useSelector(state => state.appData.allUser);
  const category = useSelector(state => state.appData.category);
  const data ={
    totalProducts:products?.length,
    totalProductsIn:allProductsIn?.length,
    totalProductsOut:allProductsOut?.length,
    totalIncome:totalIncome!==0?totalIncome:0,
    totalExpense:totalExpense!==0?totalExpense:0,
    // totalTransaction:totalIncome&&totalExpense?totalIncome-totalExpense:0,
    allUser:allUser?.length,
    category:category?category?.length:0
  }
  
  // console.log("data",data)
  const getData = () =>{

    var date = moment().locale('id').format('dddd Do MMMM YYYY');
    setCurrentDate(date);
    dispatch(getUserData(accessToken,idUser))
    dispatch(getProducts(accessToken))
    dispatch(getAllInProducts(accessToken))
    dispatch(getAllOutProducts(accessToken))
    dispatch(getCategory(accessToken))
    dispatch(getTotalIncome(accessToken));
    dispatch(getTotalExpense(accessToken))
    userData?.role_id==1&& dispatch(getAllUser(accessToken));
  }

  useEffect(() => {
    if (isFocused) {
      dispatch(connectionChecker());
      loginUser
        && getData()
    }
  }, [connection, loginUser,isFocused]);

  // console.log("user home ",userData)

  return (
  <View style={styles.page}>
    <StatusBar  backgroundColor={'transparent'} translucent/>
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={{height:ms(1000)}}>
      <View style={styles.headerTop}>
        <View style={styles.headerTopNamePhoto}>
          <View style={styles.headerText}>
              <Text style={{color:COLORS.white,fontFamily:FONTS.Regular}}>Hi, {userData?.name}</Text>    
              <Text style={{color:COLORS.black,marginTop:4,fontFamily:FONTS.SemiBold}}>{userData?.address} </Text>
          </View>
           <Image  style = {styles.photo}/>
        </View>
      <CardWelcome date={currentDate}/> 
      </View>
      <View style={styles.layanan}>
        <View style={styles.iconLayanan}>
        </View>
      </View>
      <View style={{ width:window,alignItems:'center'}}>
        <Text style={[styles.text,{fontSize:23,paddingVertical:ms(10)}]}>Beranda</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'center',justifyContent:'center'}} >
          <CardIcon
            onPress={()=>{userData?.role_id!=2&&navigation.navigate("Transaksi")}}  
            caption={'Transaksi'} 
            icon={'currency-usd'}
            icon1={'currency-usd'}
            icon2={'currency-usd-off'}
            value={totalIncome!==0?`Rp. ${rupiah(data?.totalIncome-data?.totalExpense)}`:`Rp. ${rupiah(0)}`}
            caption1={'Masuk'}
            value1={totalIncome!==0?`Rp. ${rupiah(data?.totalIncome)}`:`Rp. ${rupiah(0)}`}
            caption2={'Keluar'}
            value2={totalExpense!==0?`Rp. ${rupiah(data?.totalExpense)}`:`Rp. ${rupiah(0)}`}
            shadowColor={COLORS.green}/>
          <CardIcon
            onPress={()=>{navigation.navigate("Barang")}} 
            caption={'Barang'} 
            icon={'package'}
            icon1={'package-down'}
            icon2={'package-up'} 
            value={data.totalProducts}
            caption1={'Masuk'}
            value1={data.totalProductsIn}
            caption2={'Keluar'}
            value2={data.totalProductsOut}  
            shadowColor={COLORS.primaryBlue}/>

            <CardIcon
              onPress={()=>{navigation.navigate("Kategori")}}  
              caption={'Kategori'} 
              icon={'shape-outline'}
              value={data.category}
              shadowColor={COLORS.dark}/>
            {userData?.role_id==1&&
              <CardIcon
              onPress={()=>{navigation.navigate("Karyawan")}}  
              caption={'Karyawan'} 
              icon={'account-outline'}
              value={data.allUser}
              shadowColor={COLORS.black}/>
            }
        </View>
      </View>
    </View>
    </ScrollView>
  </View>
  )
}

export default Home
const window = Dimensions.get('window').width;

const styles = StyleSheet.create({
  text:{
    fontSize:14,
    fontFamily:FONTS.Bold,
    color:COLORS.black
  },
  page : {
    backgroundColor: COLORS.white,
    width: window,
    flexGrow:1,
  },
  headerTop:{
    width: window,
    height:200,
    backgroundColor : COLORS.green,
  },
  headerTopNamePhoto:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom:16
  },
  headerText : {
    paddingTop :56,
    paddingLeft:16,
    flexDirection:'column'
  },
  photo :{
    width:28,
    height:28,
    marginRight:16,
    marginTop :50,
    borderRadius:15
  },
  layanan : {
    margin:20,
    paddingTop :15,
  },
   iconLayanan : {
    flexDirection:'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginRight:16,
  },
})