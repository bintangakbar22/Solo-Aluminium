import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ms} from 'react-native-size-matters';
import { COLORS,FONTS } from '../Utils';

const ButtonShadow = ({shadowColor, onPress, icon, caption}) => {
  return (
    <TouchableOpacity
      style={{...styles.Box, shadowColor: shadowColor}}
      onPress={onPress}>
      <Icon style={styles.Icon} name={icon} size={25} color={COLORS.black} />
      <Text style={styles.Text}>{caption}</Text>
    </TouchableOpacity>
  );
};

export default ButtonShadow;

const styles = StyleSheet.create({
  Box: {
    backgroundColor: COLORS.white,
    width: ms(320),
    height: ms(60),
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
  },
  Icon: {
    marginHorizontal: ms(20),
  },
  Text: {
    fontFamily: FONTS.Regular,
    fontSize: ms(12),
    color: COLORS.black,
  },
});
