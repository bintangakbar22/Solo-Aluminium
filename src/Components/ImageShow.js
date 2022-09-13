import {Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ms} from 'react-native-size-matters';
import { COLORS } from '../Utils';

const ImageShow = ({onPress, uri}) => {
  let image = uri;

  return (
    <TouchableOpacity style={styles.Button} onPress={onPress}>
      {image == '' ? (
        <Image style={styles.Image} />
      ) : (
        <Image source={{uri: image}} style={styles.Image} />
      )}
      <Icon
        name="camera-outline"
        size={ms(25)}
        color={COLORS.white}
        style={styles.Icon}
      />
    </TouchableOpacity>
  );
};

export default ImageShow;

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  Button: {
    width: ms(100),
    height: ms(100),
    backgroundColor: COLORS.lightGrey,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(25),
    borderRadius: ms(10),
  },
  Image: {
    width: ms(100),
    height: ms(100),
    borderRadius: ms(10),
  },
  Icon: {
    position: 'absolute',
    color: COLORS.black,
  },
});
