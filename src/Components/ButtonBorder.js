import { StyleSheet, Text, View,TouchableOpacity,Dimensions } from 'react-native'
import React from 'react'
import { COLORS, FONTS } from '../Utils'
const ButtonBorder = ({onPress,value,color,label,caption}) => {
  return (
    <TouchableOpacity onPress={onPress}>
        <View style={[styles.cardInfo,{borderColor:color}]}>
            <View style={{flexDirection:'row',width:screen.width*0.9,justifyContent:'space-between'}}>
                <View style={{flexDirection:'row',width:caption?screen.width*0.9:screen.width*0.45,flexWrap:'wrap'}} >
                    <Text style={[styles.textCard]}>{label}</Text>
                </View>
                <View style={{flexDirection:'row',flexWrap:'wrap'}} >
                    <Text style={[styles.textCard2]}>{value}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
  )
}

export default ButtonBorder
const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  cardInfo:{
    backgroundColor:COLORS.white,
    borderRadius:8,
    borderWidth:1.5,
    borderColor:COLORS.green,
    alignSelf:'center',
    padding:8
  },
  textCard:{
    fontSize:17,
    color:COLORS.black,
    fontFamily:FONTS.Regular,
  },
  textCard2:{
    fontSize:17,
    color:COLORS.black,
    fontFamily:FONTS.Regular,
  }
})