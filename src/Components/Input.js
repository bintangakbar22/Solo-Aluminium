import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {ms} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS,FONTS } from '../Utils';

const Input = ({
  icon,
  placeholder,
  onChangeText,
  value,
  error,
  secureTextEntry,
  screen,
  onPress,
  numeric
}) => {
  const [isSecureText, setIsSecureText] = useState(secureTextEntry);
  const [isActive, setIsActive] = useState(false);

  return (
    <View style={styles.Container}>
      <View
        style={{
          ...styles.Content,
          borderColor: isActive ? COLORS.black : COLORS.grey,
          width:placeholder=='Search'?window.width * 0.75:window.width * 0.8,
          paddingHorizontal:icon?ms(15):ms(0)
        }}>
        <Icon style={styles.Icon} name={icon} size={20} color={COLORS.dark} />
        {numeric ?  
          <TextInput
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          style={[styles.Input, {marginHorizontal: screen == 'jual' ? 0 : 15}]}
          keyboardType='numeric'
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
          secureTextEntry={isSecureText}
          placeholderTextColor={COLORS.grey}
          maxLength={10}
        />
        :
          <TextInput
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          style={[styles.Input, {marginHorizontal: screen == 'jual' ? 0 : 15}]}
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
          secureTextEntry={isSecureText}
          placeholderTextColor={COLORS.grey}
        />
        }
        {placeholder == 'Password' ||
          placeholder == 'Current Password' ||
          placeholder == 'New Password' ||
          (placeholder == 'Confirm Password' && (
            <TouchableOpacity
              onPress={() => {
                setIsSecureText(val => !val);
              }}>
              <Icon
                name={isSecureText ? 'eye-outline' : 'eye-off-outline'}
                size={ms(20)}
                color={COLORS.dark}
              />
            </TouchableOpacity>
          ))}
        {placeholder == 'Search' && (
          <TouchableOpacity onPress={onPress}>
            <Icon name={'store-search'} size={ms(30)} color={COLORS.dark} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.Text}>{error}</Text>
    </View>
  );
};

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  Container: {
    alignItems: 'center',
  },
  Content: {
    backgroundColor: COLORS.white,
    width: window.width * 0.8,
    height: ms(45),
    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: ms(1),
    borderRadius: ms(10),

    paddingHorizontal: ms(15),
  },
  Input: {
    width: '75%',
    paddingVertical: ms(6),

    fontFamily: FONTS.Regular,
    fontSize: ms(12),
    color: COLORS.black,
  },
  Text: {
    width: window.width * 0.7,

    fontFamily: FONTS.Regular,
    fontSize: ms(10),
    color: COLORS.red,
    textAlign: 'justify',

    marginVertical: ms(3),
  },
});

export default Input;
