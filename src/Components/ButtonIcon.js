import {TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ms} from 'react-native-size-matters';

const ButtonIcon = ({icon, onPress, color}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name={icon} size={ms(25)} color={color} />
    </TouchableOpacity>
  );
};

export default ButtonIcon;
