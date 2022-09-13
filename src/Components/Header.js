import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React from 'react';
import {ms} from 'react-native-size-matters';
import ButtonIcon from './ButtonIcon';
import { COLORS,FONTS } from '../Utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Header = ({navigation, title,input,onPress}) => {
  return (
    <View style={styles.Container}>
      {navigation && (
        <ButtonIcon
          icon="keyboard-backspace"
          onPress={() => navigation.goBack()}
          color={COLORS.black}
        />
      )}
      <Text style={[styles.Title,{textAlign:input?'left':'center'},{textAlign:navigation&&'center'}]}>{title}</Text>
      {input && (
        <ButtonIcon
          icon="plus"
          onPress={onPress}
          color={COLORS.green}
        />
      )}
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
});
