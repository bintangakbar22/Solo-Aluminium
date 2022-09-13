import { StyleSheet, Text, View,Modal ,Dimensions,PanResponder,Animated} from 'react-native'
import React ,{useEffect,useRef,useState} from 'react'

const BottomModal = (props) => {
  const panY = useRef(new Animated.Value(window.height)).current;
  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 200,
    useNativeDriver: true,
  });

  const closeAnim = Animated.timing(panY, {
    toValue: window.height,
    duration: 100,
    useNativeDriver: true,
  });

  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const handleDismiss = () => closeAnim.start(props.onDismiss);

  useEffect(() => {
    resetPositionAnim.start();
  }, [resetPositionAnim]);

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([null, {dy: panY}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 0 && gs.vy > 2) {
          return handleDismiss();
        }
        return resetPositionAnim.start();
      },
    }),
  ).current;

  return (
    <Modal
      animated
      animationType='none'
      visible={props.visible}
      transparent
      onRequestClose={handleDismiss}>
      <View style={styles.overlay}>
        <Animated.View
          style={{
            ...styles.container,
            transform: [{translateY: translateY}],
          }}
          {...panResponders.panHandlers}>
          <View style={styles.sliderIndicatorRow}>
            <View style={styles.sliderIndicator} />
          </View>
          {props.children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BottomModal
const window = Dimensions.get('window');
const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  },
  container: {
    backgroundColor: 'white',
    paddingTop: 12,
    width:window.width*0.95,
    borderRadius:5
  },
});