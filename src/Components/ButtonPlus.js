import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../Utils';
import {ms} from 'react-native-size-matters';
const ButtonPlus = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.Button} onPress={onPress}>
        <Icon name={'plus'} size={ms(25)} color={COLORS.white} />
    </TouchableOpacity>
  )
}

export default ButtonPlus

const styles = StyleSheet.create({
    Button :{
        width:60,
        height:60,
        borderRadius:60,
        backgroundColor:COLORS.green,
        justifyContent:'center',
        alignItems:'center',
        position: 'absolute',
        right:ms(15),
        bottom:ms(65)
    }
})