import React from "react"
import { useWindowDimensions } from "react-native";
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, } from "react-native";
import {MD2Colors as Colors} from 'react-native-paper'
 
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

  return (  
    <View style={styles.modal_overlay}>
        <TouchableOpacity activeOpacity={1} style={styles.modal_overlay}>
            <View style={[styles.modal]}  >
        <TouchableOpacity onPress={onClose}style={styles.modal_close}>
          <Image source={{uri : '../../../assets/cross.png'}} />
        </TouchableOpacity>
        {children}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    modal_overlay : {position: 'absolute', top:0, left: 0, width: '100%', height: '100%', backgroundColor: Colors.grey50,
                    display: 'flex', justifyContent:'center', alignItems:'center'},
    modal : {backgroundColor: 'white', borderRadius:8, padding: 20, position:'relative'},
    modal_close : {position: 'absolute', width: 20, height: 20, right: 5, top: 5}
})

export default Modal;