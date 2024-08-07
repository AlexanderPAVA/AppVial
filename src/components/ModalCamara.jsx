import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity
} from 'react-native';
import Iconc from 'react-native-vector-icons/Entypo';
import { magnetometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";

function ModalCamara({ modalVisible, tomarVideo, tomarFoto, salirModal, brujula2 }) {

  setUpdateIntervalForType(SensorTypes.magnetometer, 5000);

  const [calibracionGps, setCalibracionGps] = useState(brujula2);
  const [colors, setColors] = useState('#000');

  useEffect(() => {
    if (calibracionGps !== 'unknown') {
      if (calibracionGps === 'Buena') {
        setColors('#064B00');
      } else if (calibracionGps === 'Regular') {
        setColors('#FFA500');
      } else {
        setColors('#FF0000');
      };
    } else {
      calibrar();
    }
  }, [])

  const calibrar = () => {
    const subscription = magnetometer.subscribe(data => {
      setCalibracionGps(determineAccuracy(data));
    });
    return () => {
      subscription.unsubscribe();
    };
  };

  const calculateMagnetometerStrength = ({ x, y, z }) => {
    return Math.sqrt(x * x + y * y + z * z);
  };

  const determineAccuracy = (data) => {
    const strength = calculateMagnetometerStrength(data);
    if (strength >= 30 && strength <= 60) {
      setColors('#064B00');
      return 'Buena';
    } else if ((strength >= 20 && strength < 30) || (strength > 60 && strength <= 70)) {
      setColors('#FFA500');
      return 'Regular';
    } else {
      setColors('#FF0000');
      return 'Baja';
    }
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <TouchableOpacity onPress={() => tomarVideo()}>
                <Iconc name='video-camera' color="#000000" size={60} style={{ marginRight: 70 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => tomarFoto()}>
                <Iconc name='camera' color="#000000" size={60} style={{ marginLeft: 0 }} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => salirModal()}>
              <Text style={styles.closeModalButton}>   salir   </Text>
            </TouchableOpacity>
            <View style={{ marginTop: 25 }}>
              <Text style={{ color: '#000000', textAlign: 'center', fontSize: 10 }}>Precisión del GPS:</Text>
              <Text style={{ color: colors, textAlign: 'center', fontWeight: 'bold', }}>{calibracionGps}</Text>
              {
                calibracionGps === 'Baja' &&
                <Text style={{ marginTop: 10, color: '#000000', textAlign: 'center', fontSize: 10 }}>Vuelve al inicio, ubícate en un mejor sitio e ingresa a la cámara cuando la precisión sea (BUENA)</Text>
              }
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ModalCamara;

const styles = StyleSheet.create({

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '70%',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
    borderColor: '#FCB213',
    borderWidth: 4,
  },
  closeModalButton: {
    fontSize: 20,
    marginTop: 30,
    color: '#964B00',
    fontWeight: 'bold',
    borderWidth: 3,
    borderRadius: 10,
    borderColor: '#FCB213',
  },
});
