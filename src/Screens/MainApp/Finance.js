import { StyleSheet,View,NativeModules, StatusBar, Dimensions } from 'react-native'
import React  ,{useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import {ms} from 'react-native-size-matters';
import { connectionChecker, getTransactions,  getProducts, FinanceScreen } from '../../Redux/actions';
import { useIsFocused } from '@react-navigation/native';
import { COLORS,FONTS } from '../../Utils';
import FinanceProduct from './Finance/FinanceProduct';
import FinanceTransaction from './Finance/FinanceTransaction';

const Finance = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.appData.accessToken);
  const financeScreen = useSelector(state => state.appData.financeScreen);
  const getData = () =>{
    dispatch(getTransactions(accessToken))
    dispatch(getProducts(accessToken))
  }


  useEffect(() => {
    if(isFocused){
        dispatch(connectionChecker());
        getData()
        dispatch(FinanceScreen('Product'))
    }
     getData()
  }, [isFocused]);

  return (
    <View style={styles.Container}> 
      <StatusBar
        backgroundColor={"transparent"}
        barStyle="dark-content"
        translucent
      />
      {financeScreen=='Product'?
      <FinanceProduct/>
      :
      <FinanceTransaction/>
      }
       
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