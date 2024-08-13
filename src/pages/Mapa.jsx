import React, { useEffect, useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { ActivityIndicator } from 'react-native-paper';
import ToastServicios from '../components/ToastServicios';
import config from '../config';
import { useRoute, useNavigation } from '@react-navigation/native';

const RUTA_MAPA_UNO = config.RUTA_MAPA_UNO;
const RUTA_HOME_DOS = config.RUTA_HOME_DOS;

function Mapa() {

  const route = useRoute();
  const navigation = useNavigation();

  const { datoGps, pais } = route.params;
  const { user } = useSelector(state => state.user);
  const [position, setPosition] = useState(datoGps);
  const [listaIni, setlistaIni] = useState([]);
  const [toastServ, setToastServ] = useState('');
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const memoizedMarkers = useMemo(() => listaIni, [listaIni]);

  const titulo = () => {
    return (
      <View>
        <Text style={{
          fontSize: 1,
          color: '#000000',
        }}></Text>
      </View>
    )
  };

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#000000' },
      headerTitle: titulo,
      headerShown: true,
      headerTintColor: '#fff',
      headerRight: () => (
        <Text style={{
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
        }}>Mapa</Text>
      )
    });

    if (pais === 'Colombia') {

      Geolocation.getCurrentPosition((pos) => {
        const crd = pos.coords;
        setPosition({
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 0.12,
          longitudeDelta: 0.12,
        });
        axios.get(RUTA_MAPA_UNO)
          .then(function (listas) {
            setlistaIni(listas.data);
            setLoading(false);
          })
          .catch(function (error) {
            setToastServ('sinConexHome');
            setTimeout(() => {
              navigation.navigate('Home');
              setLoading(false);
            },
              4000);
          });
      }, (error) => {
        setToastServ('sinGpsMapa');
        setTimeout(() => {
          setReload(true);
          setLoading(false);
        }, 3500);
      },
        {
          accuracy: {
            android: 'high'
          },
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000,
          distanceFilter: 0,
          forceRequestLocation: true,
          forceLocationManager: true,
        });

    } else {
      setPosition({
        latitude: 4.5709,
        longitude: -74.2973,
        latitudeDelta: 15.0,
        longitudeDelta: 15.0,
      });

      axios.get(RUTA_MAPA_UNO)
        .then(function (listas) {
          setlistaIni(listas.data);
          setLoading(false);
          setToastServ('fueraPais');
        })
        .catch(function (error) {
          setToastServ('sinConexHome');
          setTimeout(() => {
            navigation.navigate('Home');
            setLoading(false);
          },
            4000);
        });

    }
  }, [reload]);

  const verPunto = (emailUsu, codigo) => {
    axios.post(RUTA_HOME_DOS, {
      codigo: codigo,
      emailusu: emailUsu
    }).then(resp => {
      if (resp.data !== 0) {
        const datos = resp.data;
        const item = datos[0];
        navigation.navigate('Individual', {
          datoItem: item
        });
      } else {
        setToastServ('itemBorrado');
      };
    }).catch(function (error) {
      setToastServ('sinConexHome');
    });
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FCB213" style={styles.spinner} />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={position}
          mapType="standard"
          customMapStyle={mapStyles}
          provider={PROVIDER_GOOGLE}
        >
          {memoizedMarkers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(marker.lat),
                longitude: parseFloat(marker.lng),
              }}
              image={marker.problem === 'Accidente'
                ? require('../imgs/Accidente.png')
                : marker.problem === 'Evento vial'
                  ? require('../imgs/Evento_Vial.png')
                  : require('../imgs/Reten.png')
              }
              onPress={() => verPunto(marker.emailusu, marker.codigo)}
            />
          ))
          }

          {pais === 'Colombia' &&
            <Marker
              title='Mi Ubicación'
              description={user.nombre}
              coordinate={position}
              image={require("../imgs/pin1.png")}
            />
          }
        </MapView>
      )}
      <ToastServicios dato={toastServ} />
    </View>
  )
}

export default Mapa;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: '#000000',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStyles = [
  {
    featureType: "poi.business",
    stylers: [
      { visibility: "off" }
    ]
  },
  {
    featureType: "poi.medical",
    stylers: [
      { visibility: "off" }
    ]
  },
  {
    featureType: "poi.school",
    stylers: [
      { visibility: "off" }
    ]
  },
  {
    featureType: "poi.government",
    stylers: [
      { visibility: "off" }
    ]
  },
  {
    featureType: "poi.place_of_worship",
    stylers: [
      { visibility: "off" }
    ]
  },
  {
    featureType: "poi.attraction",
    stylers: [
      { visibility: "off" }
    ]
  },
  {
    featureType: "poi.sports_complex",
    stylers: [
      { visibility: "off" }
    ]
  },
  {
    featureType: "transit.station",
    stylers: [
      { visibility: "off" }
    ]
  }
];
