import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import FastImage from 'react-native-fast-image';
import ToastServicios from '../components/ToastServicios';
import OneSignal from 'react-native-onesignal';
import axios from 'axios';
import { openDatabase } from "react-native-sqlite-storage";
import ModalView from '../components/ModalView';
const db = openDatabase({ name: "appLikes" });
import ModalHome from '../texto/ModalHome.json';
import { loadReten } from '../redux/slices/SegmentoReten';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../config';
import { loadsancion } from '../redux/slices/sancion';
import ModalPrivacidad from '../components/ModalPrivacidad';
import { notiContext } from '../context/notiContext';
import { magnetometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";

const API_KEY = config.API_KEY;
const RUTA_IMG_USER = config.RUTA_IMG_USER;
const MAPA_KEY = config.API_KEY_MAPS;
const RUTA_HOME_CERO = config.RUTA_HOME_CERO;
const RUTA_HOME_UNO = config.RUTA_HOME_UNO;
const RUTA_HOME_DOS = config.RUTA_HOME_DOS;
const RUTA_HOME_TRES = config.RUTA_HOME_TRES;

function Home({ navigation }) {

  setUpdateIntervalForType(SensorTypes.magnetometer, 1200);

  const { enterNoti, setEnterNoti, msjNoti, setMsjNoti, itemBorrado } = useContext(notiContext);
  const { primvez } = useSelector(state => state.primvez);
  const [modalVisiblePVez, setModalVisiblePVez] = useState(false);
  const [conex, setConex] = useState(1);
  const [reload, setReload] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { reten } = useSelector(state => state.reten);
  const { pricarga } = useSelector(state => state.pricarga);
  const [modalVisible, setModalVisible] = useState(false);
  const [positionIni, setPositionIni] = useState('');
  const { camara } = useSelector(state => state.camara);
  const [ToastServ, setToastServ] = useState('');
  const [SDM, setSDM] = useState(false);
  const [SNT, setSNT] = useState(false);
  const [msjCam, setMsjCam] = useState('');
  const [bloqueoButtons, setBloqueoButtons] = useState(false);
  const [compassAccuracy, setCompassAccuracy] = useState('unknown');
  const [color, setcolor] = useState('');
  const [pais, setPais] = useState('');
  const [mostrarsinpais, setmostrarsinpais] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#000' },
      headerTitle: '',
      headerShown: true,
      headerTintColor: '#000',
      headerLeft: () => (
        camara === true &&
        <Text style={{
          color: '#90670B',
          fontSize: 10,
          fontWeight: 'bold',
        }}>Atajo a Cámara</Text>
      )
    });
  }, [camara]);

  useEffect(() => {
    const subscription = magnetometer.subscribe(data => {
      setCompassAccuracy(determineAccuracy(data));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const calculateMagnetometerStrength = ({ x, y, z }) => {
    return Math.sqrt(x * x + y * y + z * z);
  };

  const determineAccuracy = (data) => {
    const strength = calculateMagnetometerStrength(data);
    if (strength >= 30 && strength <= 60) {
      setcolor('green');
      return 'Buena';
    } else if ((strength >= 20 && strength < 30) || (strength > 60 && strength <= 70)) {
      setcolor('orange');
      return 'Regular';
    } else {
      setcolor('red');
      return 'Baja';
    }
  };

  useEffect(() => {
    requestWifiDevicesPermission();
    if (camara === true && enterNoti !== 0 && primvez !== 0) {
      setMsjCam('');
      setBloqueoButtons(true);
    } else if (camara === true && enterNoti === 0 && primvez !== 0) {
      setMsjCam('Abriendo Cámara');
      setBloqueoButtons(true);
    } else {
      setBloqueoButtons(true);
      if (user) {
        setMsjCam('Espere...');
      }
    };

    if (primvez !== 0) {
      setTimeout(() => {
        if (enterNoti === 0) {
          OneSignal.setNotificationOpenedHandler(openedEvent => {
            const { action, notification } = openedEvent;
            const data = notification.additionalData
            if (data !== undefined && data !== null) {
              axios.post(RUTA_HOME_DOS, {
                codigo: data.codigoId,
                emailusu: data.emailUsu
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
            };
          });
        }
      }, 2300);

      if (!user) {
        navigation.navigate('LoginUser');
      } else {

        OneSignal.setAppId(API_KEY);
        axios.post(RUTA_HOME_UNO, {
          dato: user.email
        })
          .then(resp => {
            setConex(1);
            dispatch(loadsancion({
              tiempoRestante: resp.data[0].tiemposancion,
              veces: resp.data[0].veces,
              deletemes: resp.data[0].deletemes,
              rango: resp.data[0].rango,
            }));
            Geolocation.getCurrentPosition((pos) => {
              const crd = pos.coords;
              setPositionIni({
                latitude: crd.latitude,
                longitude: crd.longitude,
                latitudeDelta: 0.12,
                longitudeDelta: 0.12,
              });
              const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&key=${MAPA_KEY}`;
              fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                  const result = data.results[0];
                  function getAddressComponent() {
                    for (let i = 0; i < result.address_components.length; i++) {
                      let component = result.address_components[i];
                      if (component.types.includes('administrative_area_level_1')) {
                        return component.long_name;
                      }
                    }
                  };
                  function getAddressComponent2() {
                    for (let i = 0; i < result.address_components.length; i++) {
                      let component = result.address_components[i];
                      if (component.types.includes('country')) {
                        return component.long_name;
                      }
                    }
                  };
                  setPais(getAddressComponent2());
                  const paisActual = getAddressComponent2();
                  const locationdpto = getAddressComponent();
                  const resultdos = data.results[2]?.address_components[2]?.short_name;
                  const resultres = data.results[2]?.address_components[3]?.short_name;
                  const resultcuatro = data.results[2]?.address_components[4]?.short_name;
                  gpsDpto(locationdpto, resultdos, resultres, resultcuatro, paisActual);

                  if (getAddressComponent2() === 'Colombia') {
                    setBloqueoButtons(false);
                  } else if (getAddressComponent2() === '' || getAddressComponent2() === undefined || getAddressComponent2() === null) {
                    setTimeout(() => {
                      setmostrarsinpais(1);
                      setToastServ('sinDpto1');
                    }, 1500);
                    setMsjCam('');
                  }
                });
            }, (error) => {
              setToastServ('sinGpsHome');
              setMsjCam('Verifíca el GPS');
              setPositionIni(0);
            });

          }).catch(function (error) {
            setToastServ('sinConexHome');
            setConex(0);
            setMsjCam('Sin Conexión, recargue');
          });
      }
    } else {
      setModalVisiblePVez(true);
    }
  }, [reload, pricarga, reten, primvez, enterNoti, itemBorrado, user]);

  const requestWifiDevicesPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
          {
            title: "Permiso para dispositivos Wi-Fi cercanos",
            message: "Esta aplicación necesita acceso a los dispositivos Wi-Fi cercanos.",
            buttonNeutral: "Preguntar más tarde",
            buttonNegative: "Cancelar",
            buttonPositive: "Aceptar"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //console.log("Permiso concedido");
        } else {
          //console.log("Permiso denegado");
        }
      } catch (err) {
        //console.warn(err);
      }
    }
  };

  const gpsDpto = (locationdpto, resultdos, resultres, resultcuatro, paisActual) => {
    if (locationdpto !== undefined && paisActual === 'Colombia') {
      if (locationdpto === "Amazonas" || locationdpto === "Antioquia" || locationdpto === "Arauca" || locationdpto === "Atlántico" || locationdpto === "Bolívar" || locationdpto === "Boyacá" || locationdpto === "Caldas" || locationdpto === "Caquetá" || locationdpto === "Casanare" || locationdpto === "Cauca" || locationdpto === "Cesar" || locationdpto === "Chocó" || locationdpto === "Córdoba" || locationdpto === "Cundinamarca" || locationdpto === "Guainía" || locationdpto === "Guaviare" || locationdpto === "Huila" || locationdpto === "La Guajira" || locationdpto === "Magdalena" || locationdpto === "Meta" || locationdpto === "Nariño" || locationdpto === "Norte de Santander" || locationdpto === "Putumayo" || locationdpto === "Quindío" || locationdpto === "Risaralda" || locationdpto === "San Andrés y Providencia" || locationdpto === "Santander" || locationdpto === "Sucre" || locationdpto === "Tolima" || locationdpto === "Valle del Cauca" || locationdpto === "Vaupés" || locationdpto === "Vichada" || locationdpto === 'Bogotá') {
        if (locationdpto === 'Bogotá') {
          OneSignal.sendTag("key", "Cundinamarca");
          dispatch(loadReten("Cundinamarca"));
        } else {
          OneSignal.sendTag("key", locationdpto);
          dispatch(loadReten(locationdpto));
        }
        if (itemBorrado === 0) {
          if (camara === true) {
            navigation.navigate('Camara', {
              datoGps: positionIni,
              brujula: compassAccuracy,
              pais: pais
            });
            setMsjNoti('');
            setMsjCam('');
            setTimeout(() => {
              setBloqueoButtons(false);
            }, 1000);
          } else if (camara === false) {
            setMsjCam('');
            if (!user) {
              setBloqueoButtons(false);
              navigation.navigate('LoginUser');
            } else {
              if (enterNoti !== 0) {
                setMsjNoti('');
                navigation.navigate('Individual', {
                  datoItem: enterNoti
                });
                setTimeout(() => {
                  setBloqueoButtons(false);
                }, 1000);
              } else {
                setBloqueoButtons(false);
              }
            }
          }
        } else {
          setMsjNoti('');
          setMsjCam('');
          setBloqueoButtons(false);
          if (SNT === false) {
            setToastServ('itemBorrado');
            setSNT(true);
          } else {
            setToastServ('itemBorrado');
            setSNT(false);
          }
        }
      } else {
        const locationdpto2 = 'Colombia';
        dispatch(loadReten(locationdpto2));
        OneSignal.sendTag("key", "");
        setBloqueoButtons(false);
        setTimeout(() => {
          if (enterNoti !== 0) {
            setMsjNoti('')
            navigation.navigate('Individual', {
              datoItem: enterNoti
            })

          } else if (locationdpto2 === 'Colombia' || pais === 'Colombia') {
            setToastServ('sinDpto');
          } else {
            setToastServ('sinDpto2');
          }
        }, 1200);
      }
    } else if (resultdos !== undefined && paisActual === 'Colombia') {
      if (resultdos === "Amazonas" || resultdos === "Antioquia" || resultdos === "Arauca" || resultdos === "Atlántico" || resultdos === "Bolívar" || resultdos === "Boyacá" || resultdos === "Caldas" || resultdos === "Caquetá" || resultdos === "Casanare" || resultdos === "Cauca" || resultdos === "Cesar" || resultdos === "Chocó" || resultdos === "Córdoba" || resultdos === "Cundinamarca" || resultdos === "Guainía" || resultdos === "Guaviare" || resultdos === "Huila" || resultdos === "La Guajira" || resultdos === "Magdalena" || resultdos === "Meta" || resultdos === "Nariño" || resultdos === "Norte de Santander" || resultdos === "Putumayo" || resultdos === "Quindío" || resultdos === "Risaralda" || resultdos === "San Andrés y Providencia" || resultdos === "Santander" || resultdos === "Sucre" || resultdos === "Tolima" || resultdos === "Valle del Cauca" || resultdos === "Vaupés" || resultdos === "Vichada" || resultdos === 'Bogotá') {
        if (resultdos === 'Bogotá') {
          OneSignal.sendTag("key", "Cundinamarca");
          dispatch(loadReten("Cundinamarca"));
        } else {
          OneSignal.sendTag("key", locationdpto);
          dispatch(loadReten(locationdpto));
        }
        if (itemBorrado === 0) {
          if (camara === true) {
            navigation.navigate('Camara', {
              datoGps: positionIni,
              brujula: compassAccuracy,
              pais: pais
            });
            setMsjNoti('');
            setMsjCam('');
            setTimeout(() => {
              setBloqueoButtons(false);
            }, 1000);
          } else if (camara === false) {
            setMsjCam('');
            if (!user) {
              setBloqueoButtons(false);
              navigation.navigate('LoginUser');
            } else {
              if (enterNoti !== 0) {
                setMsjNoti('');
                navigation.navigate('Individual', {
                  datoItem: enterNoti
                });
                setTimeout(() => {
                  setBloqueoButtons(false);
                }, 1000);
              } else {
                setBloqueoButtons(false);
              }
            }
          }
        } else {
          setMsjNoti('');
          setMsjCam('');
          setBloqueoButtons(false);
          if (SNT === false) {
            setToastServ('itemBorrado');
            setSNT(true);
          } else {
            setToastServ('itemBorrado');
            setSNT(false);
          }
        }
      } else {
        const locationdpto2 = 'Colombia';
        dispatch(loadReten(locationdpto2));
        OneSignal.sendTag("key", "");
        setBloqueoButtons(false);
        setTimeout(() => {
          if (enterNoti !== 0) {
            setMsjNoti('')
            navigation.navigate('Individual', {
              datoItem: enterNoti
            })

          } else if (locationdpto2 === 'Colombia' || pais === 'Colombia') {
            setToastServ('sinDpto');
          } else {
            setToastServ('sinDpto2');
          }
        }, 1200);
      }
    } else if (resultres !== undefined && paisActual === 'Colombia') {
      if (resultres === "Amazonas" || resultres === "Antioquia" || resultres === "Arauca" || resultres === "Atlántico" || resultres === "Bolívar" || resultres === "Boyacá" || resultres === "Caldas" || resultres === "Caquetá" || resultres === "Casanare" || resultres === "Cauca" || resultres === "Cesar" || resultres === "Chocó" || resultres === "Córdoba" || resultres === "Cundinamarca" || resultres === "Guainía" || resultres === "Guaviare" || resultres === "Huila" || resultres === "La Guajira" || resultres === "Magdalena" || resultres === "Meta" || resultres === "Nariño" || resultres === "Norte de Santander" || resultres === "Putumayo" || resultres === "Quindío" || resultres === "Risaralda" || resultres === "San Andrés y Providencia" || resultres === "Santander" || resultres === "Sucre" || resultres === "Tolima" || resultres === "Valle del Cauca" || resultres === "Vaupés" || resultres === "Vichada" || resultres === "Bogotá") {
        if (resultres === 'Bogotá') {
          OneSignal.sendTag("key", "Cundinamarca");
          dispatch(loadReten("Cundinamarca"));
        } else {
          OneSignal.sendTag("key", resultres);
          dispatch(loadReten(resultres));
        }
        if (itemBorrado === 0) {
          if (camara === true) {
            navigation.navigate('Camara', {
              datoGps: positionIni,
              brujula: compassAccuracy,
              pais: pais
            });
            setMsjNoti('');
            setMsjCam('');
            setTimeout(() => {
              setBloqueoButtons(false);
            }, 1000);
          } else if (camara === false) {
            setMsjCam('');
            if (!user) {
              setBloqueoButtons(false);
              navigation.navigate('LoginUser');
            } else {
              if (enterNoti !== 0) {
                setMsjNoti('');
                navigation.navigate('Individual', {
                  datoItem: enterNoti
                });
                setTimeout(() => {
                  setBloqueoButtons(false);
                }, 1000);
              } else {
                setBloqueoButtons(false);
              }
            }
          }
        } else {
          setMsjNoti('');
          setMsjCam('');
          setBloqueoButtons(false);
          if (SNT === false) {
            setToastServ('itemBorrado');
            setSNT(true);
          } else {
            setToastServ('itemBorrado');
            setSNT(false);
          }
        }
      } else {
        const locationdpto2 = 'Colombia';
        dispatch(loadReten(locationdpto2));
        OneSignal.sendTag("key", "");
        setBloqueoButtons(false);
        setTimeout(() => {
          if (enterNoti !== 0) {
            setMsjNoti('')
            navigation.navigate('Individual', {
              datoItem: enterNoti
            })

          } else if (locationdpto2 === 'Colombia' || pais === 'Colombia') {
            setToastServ('sinDpto');
          } else {
            setToastServ('sinDpto2');
          }
        }, 1200);
      }
    } else if (resultcuatro !== undefined && paisActual === 'Colombia') {
      if (resultcuatro === "Amazonas" || resultcuatro === "Antioquia" || resultcuatro === "Arauca" || resultcuatro === "Atlántico" || resultcuatro === "Bolívar" || resultcuatro === "Boyacá" || resultcuatro === "Caldas" || resultcuatro === "Caquetá" || resultcuatro === "Casanare" || resultcuatro === "Cauca" || resultcuatro === "Cesar" || resultcuatro === "Chocó" || resultcuatro === "Córdoba" || resultcuatro === "Cundinamarca" || resultcuatro === "Guainía" || resultcuatro === "Guaviare" || resultcuatro === "Huila" || resultcuatro === "La Guajira" || resultcuatro === "Magdalena" || resultcuatro === "Meta" || resultcuatro === "Nariño" || resultcuatro === "Norte de Santander" || resultcuatro === "Putumayo" || resultcuatro === "Quindío" || resultcuatro === "Risaralda" || resultcuatro === "San Andrés y Providencia" || resultcuatro === "Santander" || resultcuatro === "Sucre" || resultcuatro === "Tolima" || resultcuatro === "Valle del Cauca" || resultcuatro === "Vaupés" || resultcuatro === "Vichada" || resultcuatro === "Bogotá") {
        if (resultcuatro === 'Bogotá') {
          OneSignal.sendTag("key", "Cundinamarca");
          dispatch(loadReten("Cundinamarca"));
        } else {
          OneSignal.sendTag("key", resultcuatro);
          dispatch(loadReten(resultcuatro));
        }
        if (itemBorrado === 0) {
          if (camara === true) {
            navigation.navigate('Camara', {
              datoGps: positionIni,
              brujula: compassAccuracy,
              pais: pais
            });
            setMsjNoti('');
            setMsjCam('');
            setTimeout(() => {
              setBloqueoButtons(false);
            }, 1000);
          } else if (camara === false) {
            setMsjCam('');
            if (!user) {
              setBloqueoButtons(false);
              navigation.navigate('LoginUser');
            } else {
              if (enterNoti !== 0) {
                setMsjNoti('');
                navigation.navigate('Individual', {
                  datoItem: enterNoti
                });
                setTimeout(() => {
                  setBloqueoButtons(false);
                }, 1000);
              } else {
                setBloqueoButtons(false);
              }
            }
          }
        } else {
          setMsjNoti('');
          setMsjCam('');
          setBloqueoButtons(false);
          if (SNT === false) {
            setToastServ('itemBorrado');
            setSNT(true);
          } else {
            setToastServ('itemBorrado');
            setSNT(false);
          }
        }
      } else {
        const locationdpto2 = 'Colombia';
        dispatch(loadReten(locationdpto2));
        OneSignal.sendTag("key", "");
        setBloqueoButtons(false);
        setTimeout(() => {
          if (enterNoti !== 0) {
            setMsjNoti('')
            navigation.navigate('Individual', {
              datoItem: enterNoti
            })

          } else if (locationdpto2 === 'Colombia' || pais === 'Colombia') {
            setToastServ('sinDpto');
          } else {
            setToastServ('sinDpto2');
          }
        }, 1200);
      }

    } else {
      const locationdpto2 = 'Colombia';
      dispatch(loadReten(locationdpto2));
      OneSignal.sendTag("key", "");
      setBloqueoButtons(false);
      setTimeout(() => {
        if (enterNoti !== 0) {
          setMsjNoti('')
          navigation.navigate('Individual', {
            datoItem: enterNoti
          })

        } else if (locationdpto2 === 'Colombia' && pais === 'Colombia') {
          setToastServ('sinDpto');
        } else {
          setToastServ('sinDpto2');
        }
      }, 1200);
    }
  };

  const mapa = () => {
    if (conex !== 0 && bloqueoButtons === false) {
      axios.post(RUTA_HOME_CERO, {
        dato: 1
      })
        .then(resp => {
          if (resp.data === 1) {
            if (!user) {
              setToastServ('sinUser');
              navigation.navigate('LoginUser');
            } else {
              if (positionIni !== '' && positionIni !== 0) {
                navigation.navigate('Mapa', {
                  datoGps: positionIni,
                  pais: pais
                });
              } else {
                setMsjCam('Verifíca el GPS');
              }
            };
          } else {
            if (SDM === false) {
              setToastServ('sinDatosMapa');
              setSDM(true)
            } else {
              setToastServ('sinDatosMapa2');
              setSDM(false)
            }
          }
        }).catch(function (error) {
          setToastServ('sinConexHome');
        });
    }
  };

  const photo = () => {
    setEnterNoti(0);
    if (conex !== 0 && mostrarsinpais === 0 && bloqueoButtons === false) {
      if (!user) {
        setToastServ('sinUsertres');
        navigation.navigate('LoginUser');
      } else {
        const namex = user.nombre;
        if (namex.length > 25) {
          navigation.navigate('LoginUser');
        } else {
          navigation.navigate('Camara', {
            datoGps: positionIni,
            brujula: compassAccuracy,
            pais: pais
          })
        }
      };
    } else if (reten === 'Colombia' || mostrarsinpais === 1) {
      setToastServ('sinDpto4');
    }
  };

  const listaPhoto = () => {
    if (conex !== 0) {
      if (!user) {
        setToastServ('sinUserdos');
        navigation.navigate('LoginUser');
      } else {
        axios.get(RUTA_HOME_TRES)
          .then(function (listas) {
            db.transaction(txn => {
              txn.executeSql(
                `SELECT * FROM likes ORDER BY id ASC`,
                [],
                (sqlTxn, res) => {
                  let listax = [];
                  if (res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                      listax.push(res.rows.item(i));
                    }
                  }
                  navigation.navigate('Listados', {
                    lista: listas.data,
                    likes: listax
                  });
                })
            });
          })
          .catch(function (error) {
            setToastServ('sinConexHome');
          });
      };
    };
  };

  const config = () => {
    if (conex !== 0) {
      navigation.navigate('LoginUser');
    };
  };

  const infoFoto = (num) => {
    if(num === 1){
      setToastServ('sinFoto');
    }else{
      setToastServ('cambioFoto');
    }
   
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View
          style={{
            backgroundColor: '#000000',
            height: '5%',
            width: '220%',
          }}></View>

        <View style={styles.main}>
          <View>
            <Image style={styles.imgLogo}
              source={require('../imgs/logox.png')}
            />
            <Image style={styles.imgLogo2}
              source={require('../imgs/reporto.png')}
            />

            {reten === null && primvez !== 0 ?
              user !== null ?
                <Text style={styles.depto2}>
                  Cargando ubicación{'\n'}espere..
                </Text>
                :
                <Text style={styles.depto2}>
                  Registre un usuario{'\n'}Ingrese en Configuración
                </Text>
              :
              reten !== 'Colombia' && pais === 'Colombia' ?
                <>
                  <Text style={styles.depto}>{reten}</Text>
                  {conex !== 0 && reten !== null && bloqueoButtons === false &&
                    <Text style={{ color: 'White', textAlign: 'center', fontSize: 10, marginBottom: -20 }}>Precisión del GPS:  <Text style={{ color: color, textAlign: 'center', fontWeight: 'bold', fontSize: 11 }}>{compassAccuracy}</Text></Text>
                  }
                </>
                : reten === 'Colombia' && pais !== 'Colombia' && mostrarsinpais === 0 ?
                  <Text style={styles.sindepto}>
                    <Text style={{ color: 'gray' }}>Te encuentras en</Text>{'\n'}<Text style={{ color: '#FCB213' }}>{pais}</Text>
                  </Text>
                  : pais === 'Colombia' ?
                    <Text style={styles.sindepto2}>
                      Sin Departamento{'\n'}Estás en una zona sin cobertura
                    </Text>
                    : mostrarsinpais === 1 ?
                      <Text style={styles.sindepto2}>
                        Sin información del país
                      </Text>
                      : ''
            }
            {enterNoti !== 0 && reten !== 'Colombia' ?
              <Text style={styles.opencam}>
                {msjNoti}
              </Text>
              : msjCam !== '' && reten !== 'Colombia' ?
                <Text style={styles.opencam}>
                  {msjCam}
                </Text>
                : ''
            }

          </View>
          <View style={styles.section}>
            <View style={styles.containerUno}>
              <View>
                <TouchableOpacity onPress={() => mapa()}>
                  <Image style={styles.botonMapa}
                    source={require('../imgs/mapa.png')}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={() => photo()}>
                  <Image style={styles.botonCamara}
                    source={require('../imgs/camara.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.containerdos}>
              <View>
                <TouchableOpacity onPress={() => listaPhoto()}>
                  <Image style={styles.botonLista}
                    source={require('../imgs/listas.png')}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={() => config()}>
                  <Image style={styles.botonLogin}
                    source={require('../imgs/configuracion.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <ModalView
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          texto={ModalHome.texto}
        />
      </ScrollView>
      {
        conex === 0 || positionIni === 0 ?
          <View>
            <TouchableOpacity onPress={() => setReload(reload + 1)}>
              <Icon name='reload-circle-outline' color="white" size={35} style={{ alignSelf: 'center', justifyContent: 'center' }} />
              <Text style={styles.recargahome}> Recargar </Text>
            </TouchableOpacity>
          </View>
          : ''
      }
      <View style={styles.itemFooter}>
        <View style={styles.itemFooter2}>
          {user !== null ?
          <TouchableOpacity onPress={() => infoFoto(2)}>
            <FastImage
              source={{
                uri: RUTA_IMG_USER + user.foto,
                priority: FastImage.priority.normal
              }}
              resizeMode={FastImage.resizeMode.stretch}
              contentContainerStyle={{ padding: 20 }}
              style={styles.imgFooterUser}
            />
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => infoFoto(1)}>
            <Image style={styles.imgFooterUserLocal}
              source={require('../imgs/user.png')}
            />
            </TouchableOpacity>
          }
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image style={styles.botonModal}
              source={require('../imgs/information.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ModalPrivacidad
        modalVisiblePVez={modalVisiblePVez}
        setModalVisiblePVez={setModalVisiblePVez}
      />
      <ToastServicios dato={ToastServ} />
    </SafeAreaView>
  );
}

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  section: {
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#000000',
    marginTop: 60,
  },
  main: {
    marginTop: 30,
  },
  containerUno: {
    flexDirection: 'row',
    top: 0,
    marginTop: 20,
  },
  containerdos: {
    flexDirection: 'row',
    top: 0,
    marginTop: 10,
    marginBottom: 120,
  },
  imgLogo: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 130,
    height: 125,
    top: -20,
  },
  imgLogo2: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 230,
    height: 80,
    top: -20,
  },
  textApp: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 30,
    color: '#fff',
    top: -10,
  },
  botonMapa: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 130,
    height: 130,
    top: -20,
    right: 5,
    borderRadius: 30,
    borderColor: '#fff',
    borderWidth: 5,
  },
  botonCamara: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 130,
    height: 130,
    top: -20,
    left: 5,
    borderRadius: 30,
    borderColor: '#fff',
    borderWidth: 5,
  },
  botonLista: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 130,
    height: 130,
    top: -20,
    right: 5,
    borderRadius: 30,
    borderColor: '#fff',
    borderWidth: 5,
  },
  botonLogin: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 130,
    height: 130,
    top: -20,
    left: 5,
    borderRadius: 30,
    borderColor: '#fff',
    borderWidth: 5,
  },
  itemFooter: {
    backgroundColor: '#000000',
    height: '10%',
    width: '220%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  itemFooter2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  imgFooterUser: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 60,
    height: 60,
    marginRight: 100,
    borderRadius: 30,
    marginBottom: 30,
    borderColor: '#FCB213',
    borderWidth: 5,
  },
  imgFooterUserLocal: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 60,
    height: 60,
    marginRight: 100,
    marginBottom: 30,
    borderRadius: 30,
    borderColor: '#FCB213',
    borderWidth: 5,
  },
  botonModal: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 60,
    height: 60,
    marginLeft: 100,
    marginBottom: 30
  },
  depto: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 15,
    fontFamily: 'Arial',
    color: '#BEBEBE',
    fontWeight: 'bold',
    marginTop: -10
  },
  depto2: {
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontFamily: 'Arial',
    color: '#E67373',
    fontWeight: 'bold',
    marginTop: -10
  },
  recargahome: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontFamily: 'Arial',
    color: 'gray',
    fontWeight: 'bold'
  },
  opencam: {
    position: 'absolute',
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontFamily: 'Arial',
    color: '#E67373',
    fontWeight: 'bold',
    marginTop: 5,
    top: '103%'
  },
  sindepto: {
    position: 'absolute',
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontFamily: 'Arial',
    color: '#E67373',
    fontWeight: 'bold',
    top: '95%'
  },
  sindepto2: {
    position: 'absolute',
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontFamily: 'Arial',
    color: 'gray',
    fontWeight: 'bold',
    top: '95%'
  },
});
