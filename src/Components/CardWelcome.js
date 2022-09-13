import {Text, View ,Dimensions,StyleSheet,Image} from 'react-native'
import { Aluminium } from '../Assets/Images'
import React from 'react'
import { COLORS,FONTS } from '../Utils'

const CardWelcome = ({date}) => {
  return (
    <View style={styles.headerTopBlue}>
        <View style={styles.bgBlue}>
          <View style={{flexDirection:'column',width:window.width*0.55}}  >
            <Text style={{color:COLORS.white,fontSize:16,paddingTop :24,paddingLeft : 24,fontFamily:FONTS.SemiBold}} >
            Selamat Datang di Solo Aluminium App</Text>
            <Text style={{color:COLORS.white,fontSize:13,paddingTop :25,paddingLeft : 24,fontFamily:FONTS.Regular}} >
            {date}</Text>
          </View>
            <View style={styles.bgBottomCar}>
                <Image source={Aluminium} style = {styles.imagesCar}/>
            </View>
        </View>
    </View>
  )
}
const window = Dimensions.get("window");
export default CardWelcome

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  headerTopBlue :{
    width: screen.width * 1.0,
    alignItems :'center',
  },
  bgBlue :{
    backgroundColor : COLORS.black,
    width: screen.width * 0.915, 
    height: 140,
    borderRadius :8,
    justifyContent : 'space-between',
    alignItems:'flex-start'
  },
  bgBottomCar : {
    width : screen.width * 0.50,
    alignSelf :'flex-end',
    height: 140,
    flexDirection:'column',
    position: 'absolute',
    top:80,
  },
  imagesCar : {
      width : screen.width * 0.30,
      height:100,
      position: 'absolute',
      top:-60,
      right:20
  },
}) 

