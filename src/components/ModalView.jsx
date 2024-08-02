import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity
} from 'react-native';

function ModalView({ modalVisible, setModalVisible, texto }) {

  return (
    <View >
      <Modal
        animationType="fade"
        transparent={false}
        visible={modalVisible}
      >
        <ScrollView style={{ backgroundColor: '#FFF8E9' }}>
          <View style={styles.centeredView}>
            <Text style={{
              marginTop: 30,
              fontSize: 25,
              color: '#000',
              justifyContent: 'center',
              alignSelf: 'center',
              fontWeight: 'bold',
            }}>Información</Text>
            <Text style={{
              marginTop: 30,
              fontSize: 15,
              color: '#000',
              marginLeft: 15,
              marginRight: 17,
              textAlign: 'justify'
            }}>
              {texto}
            </Text>
          </View>
        </ScrollView>

        <View style={{ backgroundColor: '#000', height: 60 }}>
          <TouchableOpacity
            style={styles.buttonDos}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{
              color: '#fff',
              top: 5
            }}>Ocultar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

export default ModalView;

const styles = StyleSheet.create({

  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#FFF8E9',
  },

  buttonDos: {
    position: 'absolute',
    backgroundColor: '#000',
    bottom: 8,
    right: 20,
    height: 40,
    width: 80,
    borderRadius: 10,
    borderColor: '#FCB213',
    borderWidth: 2,
    alignItems: 'center',

  },
  bold: {
    fontWeight: 'bold',
  },



});