import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {ms} from 'react-native-size-matters';
import ButtonIcon from './ButtonIcon';
import { COLORS,FONTS } from '../Utils';
import { FinanceScreen } from '../Redux/actions';
import { useDispatch,useSelector } from 'react-redux'
const Header = ({navigation, title,input,onPress,finance}) => {
  const financeScreen = useSelector(state => state.appData.financeScreen);
  const dispatch = useDispatch();
  return (
    <View style={{flexDirection:'column',paddingHorizontal: window.width * 0.03,marginBottom: ms(5),}}>
      <View style={styles.Container}>
      {navigation && (
        <ButtonIcon
          icon="keyboard-backspace"
          onPress={() => navigation.goBack()}
          color={COLORS.black}
        />
      )}
      <Text style={[styles.Title,{textAlign:input?'left':'center'},{textAlign:navigation&&'center'}]}>{title}</Text>
      <View style={{flexDirection:'row'}}>
      {input && (
        <>
        <ButtonIcon
          icon="plus"
          onPress={onPress}
          color={COLORS.green}
        />
        </>
      )}
      </View>
      </View>
        {finance&&
        <>
          {financeScreen == 'Product' && (  
            <View style={{flexDirection:'row',alignSelf:'center'}}>
              <TouchableOpacity onPress={()=>{dispatch(FinanceScreen('Product'))}}>
                <Text style={styles.ActivePage}>Product</Text>
              </TouchableOpacity>
              <Text style={{fontFamily: FONTS.Regular,fontSize: ms(16),color: COLORS.black,}}> | </Text>
              <TouchableOpacity onPress={()=>{dispatch(FinanceScreen('Finance'))}}>
                <Text style={[styles.PasivePage,{marginRight:10}]}>Finance</Text>
              </TouchableOpacity>
            </View>
          )}
          {financeScreen == 'Finance' && (  
            <View style={{flexDirection:'row',alignSelf:'center'}}>
              <TouchableOpacity onPress={()=>{dispatch(FinanceScreen('Product'))}}>
                <Text style={styles.PasivePage}>Product</Text>
              </TouchableOpacity>
              <Text style={{fontFamily: FONTS.Regular,fontSize: ms(16),color: COLORS.black,}}> | </Text>
              <TouchableOpacity onPress={()=>{dispatch(FinanceScreen('Finance'))}}>
                <Text style={[styles.ActivePage,{marginRight:10}]}>Finance</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
        }
    </View>
  );
};

export default Header;

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: window.width * 0.03,
    marginBottom: ms(5),
  },
  Title: {
    flex: 1,
    fontFamily: FONTS.Bold,
    fontSize: ms(18),
    textAlign: 'center',
    color: COLORS.black,
    paddingVertical:ms(5)
  },
  ActivePage: {
    fontFamily: FONTS.Regular,
    fontSize: ms(16),
    color: COLORS.black,
    borderBottomWidth: 2,
    borderColor: COLORS.red,
  },
  PasivePage: {
    fontFamily: FONTS.Regular,
    color: COLORS.grey,
    fontSize: ms(14),
  },
});
