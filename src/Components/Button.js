import React from 'react';
import {Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import { COLORS,FONTS } from '../Utils';

const Button = ({caption, onPress,disabled,style,styleText}) => {
  return (
    <TouchableOpacity style={[styles.Container,{width:caption=="Preview"||caption=="Posting"?window.width * 0.75:window.width * 0.75,marginHorizontal:5},style]} onPress={onPress} disabled={disabled}>
      <Text style={[styles.Text,styleText]}>{caption}</Text>
    </TouchableOpacity>
  );
};

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  Container: {
    backgroundColor: COLORS.black,
    width: window.width * 0.75,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 10,
  },
  Text: {
    fontFamily: FONTS.Bold,
    fontSize: 17,
    color: COLORS.white,
  },
});

export default Button;
