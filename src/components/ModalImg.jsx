import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Modal,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import Iconm from 'react-native-vector-icons/AntDesign';
import config from '../config';
const RUTA_IMG_IMGS = config.RUTA_IMG_IMGS;
function ModalImg({ modalVisible, setModalVisible, anchoPantalla, altoModal, ratio2, itemImg}) {
  return (
    <View >
       <Modal
          animationType="fade"
          transparent={false}
          visible={modalVisible}>
          <ScrollView style={{ backgroundColor: '#000' }}>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <ReactNativeZoomableView
                    maxZoom={2} minZoom={0.5} zoomStep={0.5} initialZoom={1}
                  >
                    <FastImage
                      style={{
                        width: anchoPantalla,
                        height: altoModal * ratio2,
                      }}
                      source={{
                        uri: RUTA_IMG_IMGS + itemImg,
                        priority: FastImage.priority.normal
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />

                  </ReactNativeZoomableView>
                </View>
          </ScrollView>
          <View style={{ backgroundColor: '#260042', }}>
            <TouchableOpacity
              style={styles.buttonDos}
              onPress={() => setModalVisible(false)}
            >
              <Iconm name='close' color="#fff" size={25} />
            </TouchableOpacity>
          </View>
        </Modal>
    </View>
  )
};

ModalImg.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
  itemImg: PropTypes.string.isRequired,
  anchoPantalla: PropTypes.number.isRequired,
  altoModal: PropTypes.number.isRequired,
  ratio2: PropTypes.number.isRequired,
};

export default ModalImg;

const styles = StyleSheet.create({
    buttonDos: {
        position: 'absolute',
        backgroundColor: '#000',
        bottom: 8,
        right: 20,
        height: 30,
        width: 50,
        borderRadius: 25,
        borderColor: '#FCB213',
        borderWidth: 2,
        alignItems: 'center',
      },
});
