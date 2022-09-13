import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Modal = (props) => {
    
  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      ><View style={styles.centeredView}>
          <View style={styles.modalView}>
          <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
            <Text style={{color:'red',fontSize:25,paddingBottom:20,alignSelf:'center',fontFamily:FONTS.SemiBold}}>Pemberitahuan!</Text>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <Icon name="close" size={30} color="red" style={{alignSelf:'flex-start',paddingTop:-20}}/>
            </TouchableOpacity>
          </View>
          </View>
        </View>
    </Modal>
  )
}

export default Modal

const styles = StyleSheet.create({
       centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
})