import { StyleSheet, Text, View,TouchableOpacity,Dimensions } from 'react-native'
import React from 'react'
import { COLORS, FONTS } from '../Utils'
const CardBorder = ({onPress,value,color,label}) => {
  return (
    <View>
        <View style={styles.cardInfo}>
            <View style={{flexDirection:'column'}}>
                <Text style={[styles.textCard2,{color:color}]}>{value}</Text>
                <Text style={[styles.textCard]}>{label}</Text>
            </View>
        </View>
    </View>
  )
}

export default CardBorder
const screen = Dimensions.get("screen");
const styles = StyleSheet.create({
  cardInfo:{
    backgroundColor:COLORS.white,
    marginHorizontal:5,
    borderRadius:13,
    flexDirection:'row',
    borderWidth:1.5,
    borderColor:COLORS.green,
    justifyContent:'center',
  },
  textCard:{
    fontSize:17,
    color:COLORS.black,
    alignSelf:'center',
    fontFamily:FONTS.Regular,
  },
  textCard2:{
    fontSize:20,
    color:COLORS.black,
    alignSelf:'center',
    fontFamily:FONTS.SemiBold,
    paddingTop:10,
    paddingHorizontal:15
  }
})