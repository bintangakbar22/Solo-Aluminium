import {Text, TouchableOpacity, StyleSheet,Dimensions,View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ms} from 'react-native-size-matters';
import { COLORS,FONTS } from '../Utils';
const CardIcon = ({shadowColor, onPress, icon, caption,value,caption1,caption2,value1,value2,icon1,icon2}) => {
  return (
    <TouchableOpacity
      style={{...styles.Box, shadowColor: shadowColor}}
      onPress={onPress}>
      <View style={{flexDirection:'row'}} >
        <Icon style={styles.Icon} name={icon} size={60} color={COLORS.black} />
        <View style={{flexDirection:'column'}} >
            <Text style={[styles.Text,{fontSize:20}]}>{caption}</Text>
            <View style={{flexWrap:'wrap',width:window.width*0.3,flexDirection:'row'}} >
              <Text style={[styles.Text,{color:shadowColor,fontSize:17}]}>{value}</Text>
            </View>
        </View>
      </View>
      {caption1=='Masuk' &&
      <View style={{flexDirection:'column'}} >
        <View style={{flexDirection:'column'}} >
            <View style={{flexDirection:'row'}} >
                <Icon style={[styles.Icon,{color:COLORS.green}]} name={icon1} size={35} color={COLORS.black} />
                <View style={{flexDirection:'column'}} >
                    <Text style={[styles.Text,{color:COLORS.green}]}>{caption1}</Text>
                    <View style={{flexWrap:'wrap',width:window.width*0.22,flexDirection:'row'}} >
                      <Text style={[styles.Text,{alignSelf:'center',color:COLORS.green}]}>{value1}</Text>
                    </View>
                </View>
            </View>
        </View>
        <View style={{flexDirection:'column',paddingTop:5}} >
            <View style={{flexDirection:'row'}} >
                <Icon style={[styles.Icon,{color:COLORS.red}]} name={icon2} size={35} color={COLORS.black} />
                <View style={{flexDirection:'column'}} >
                    <Text style={[styles.Text,{color:COLORS.red}]}>{caption2}</Text>
                    <View style={{flexWrap:'wrap',width:window.width*0.24,flexDirection:'row'}} >
                      <Text style={[styles.Text,{alignSelf:'center',color:COLORS.red}]}>{value2}</Text>
                    </View>
                </View>
            </View>
        </View>
        
      </View>
      }
    </TouchableOpacity>
  );
};

export default CardIcon;
const window = Dimensions.get("window");
const styles = StyleSheet.create({
  Box: {
    backgroundColor: COLORS.white,
    width: ms(320),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ms(15),
    borderRadius: ms(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: ms(0.25),
    shadowRadius: ms(2),
    elevation: ms(2),
    padding:ms(15),
    justifyContent:'space-between'
  },
  Icon: {
    marginHorizontal: ms(5),
  },
  Text: {
    fontFamily: FONTS.Regular,
    fontSize: ms(12),
    color: COLORS.black,
  },
});

