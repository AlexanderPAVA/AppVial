import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registro } from '../redux/slices/login';
import { camaraload } from '../redux/slices/linkCamara';
import { loadNoti } from '../redux/slices/notificacion';
import axios from 'axios';
import OneSignal from 'react-native-onesignal';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { Button, Switch } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import ToastServicios from '../components/ToastServicios';
import { openDatabase } from "react-native-sqlite-storage";
import ModalView from '../components/ModalView';
import ModalConfig from '../texto/ModalConfig.json'
import config from '../config';
import ProAlert from '../components/ProAlert';
import UserLogin from '../components/UserLogin';
import { loadsancion } from '../redux/slices/sancion';
import Iconc from 'react-native-vector-icons/Entypo';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import ModalNombre from '../components/ModalNombre';

const GOOGLE_KEY = config.GOOGLE_KEY;
const RUTA_IMG_USER = config.RUTA_IMG_USER;
const RUTA_LOGIN_UNO = config.RUTA_LOGIN_UNO;
const RUTA_LOGIN_DOS = config.RUTA_LOGIN_DOS;
const RUTA_LOGIN_TRES = config.RUTA_LOGIN_TRES;
const RUTA_LOGIN_CUATRO = config.RUTA_LOGIN_CUATRO;
const RUTA_HOME_UNO = config.RUTA_HOME_UNO;

const db = openDatabase({ name: "appLikes" });

function LoginUser({ navigation }) {


  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { camara } = useSelector(state => state.camara);
  const { notiUp } = useSelector(state => state.notiUp);
  const { sancion } = useSelector(state => state.sancion);
  const { reten } = useSelector(state => state.reten);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibles, setModalVisibles] = useState(false);
  const [ToastServ, setToastServ] = useState('');
  const [isSwitchOnUno, setIsSwitchOnUno] = useState(camara);
  const [isSwitchOnDos, setIsSwitchOnDos] = useState(notiUp);
  const [espere, setEspere] = useState('');
  const [idPlay, setIdPlay] = useState('');
  const [msj, setMsj] = useState('');

  const onToggleSwitchUno = (switchx) => {
    if (reten !== 'Colombia') {
      setIsSwitchOnUno(!isSwitchOnUno);
      dispatch(camaraload(!isSwitchOnUno));
      setToastServ('camara');
      if (switchx === true) {
        setIsSwitchOnUno(!isSwitchOnUno);
        dispatch(camaraload(!isSwitchOnUno));
        setToastServ('camarano');
      } else {
        setIsSwitchOnUno(!isSwitchOnUno);
        dispatch(camaraload(!isSwitchOnUno));
        setToastServ('camara');
      }
    } else {
      setToastServ('sinDpto2');
      setIsSwitchOnUno(false);
      dispatch(camaraload(false));
    }
  }
  const onToggleSwitchDos = (switchs) => {
    if (switchs === true) {
      setIsSwitchOnDos(!isSwitchOnDos);
      dispatch(loadNoti(!isSwitchOnDos));
      setToastServ('notino');
    } else {
      setIsSwitchOnDos(!isSwitchOnDos);
      dispatch(loadNoti(!isSwitchOnDos));
      setToastServ('noti');
    }
  };

  const cargarplayerId = async () => {
    try {
      const datas = await OneSignal.getDeviceState();
      const player_id = datas.userId;
      if (player_id !== undefined) {
        setIdPlay(player_id);
      } else {
        cargarplayerId();
      }
    }
    catch (error) {
    }
  }

  const titulo = () => {
    return (
      <>
        <Text style={{
          fontSize: 1,
          color: '#000000',
        }}></Text>
      </>
    )
  };

  const listaReporte = () => {
    navigation.navigate('ListaReporte', {
      data: 0
    });
  };

  useEffect(() => {
    cargarplayerId();
    GoogleSignin.configure({
      webClientId: GOOGLE_KEY,
    });

    if (user) {
      const namex = user.nombre;
      if (namex.length > 25) {
        setToastServ('nombreLargo');
        setTimeout(() => {
          setModalVisibles(true);
        }, 3000);
      }
    }
    navigation.setOptions({
      headerStyle: { backgroundColor: '#000000' },
      headerTitle: titulo,
      headerShown: true,
      headerTintColor: '#fff',
      headerRight: () => (
        sancion !== 0 ?
          sancion.rango === 'adm' ?
            <TouchableOpacity onPress={() => listaReporte()}>
              <Text Text style={{
                color: '#FBA000',
                fontSize: 16,
                fontWeight: 'bold',
              }}> Configuración</Text >
            </TouchableOpacity>
            :
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
            }}>Configuración</Text>
          :
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
          }}>Configuración</Text>
      )

    });
  }, [user]);

  const logIn = () => {
    this.AlertPro.open()
    setMsj('¿Estás de acuerdo con nuestras condiciones de uso?');
  };
  const signInOut = async () => {
    if (!user?.email) {
      this.AlertPro.close();
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        setEspere('Espere...');
        const userCredential = await auth().signInWithCredential(googleCredential);
        const user = userCredential.user;
        axios.post(RUTA_LOGIN_UNO, {
          nombre: user.displayName,
          email: user.email,
          foto: 'user/user.jpg',
          idsignal: idPlay
        }).then(resp => {
          dispatch(registro({
            nombre: user.displayName,
            email: user.email,
            foto: 'user/user.jpg',
            idsignal: idPlay
          }));
          axios.post(RUTA_HOME_UNO, {
            dato: user.email
          })
            .then(resp => {
              dispatch(loadsancion({
                tiempoRestante: resp.data[0].tiemposancion,
                veces: resp.data[0].veces,
                deletemes: resp.data[0].deletemes,
                rango: resp.data[0].rango,
              }));
              return auth().signInWithCredential(googleCredential);
            }).catch(function (error) {
            });
          onToggleSwitchDos(!isSwitchOnDos);
          setTimeout(() => {
            setToastServ('cargaFotoUser');
          }, 5000);
          setTimeout(() => {
            db.transaction(txn => {
              txn.executeSql(
                `CREATE TABLE IF NOT EXISTS likes (id INTEGER PRIMARY KEY AUTOINCREMENT, idimg TEXT, mes TEXT)`,
                [],
                (sqlTxn, res) => {

                },
                error => {

                },
              );
            });

            axios.post(RUTA_LOGIN_DOS, {
              emailu: user.email
            }).then(response => {
              const listmsj = response.data;
              if (listmsj.length > 0) {
                Array.isArray(listmsj) && listmsj.map((data) => {
                  db.transaction(txn => {
                    txn.executeSql(
                      `INSERT INTO likes(idimg, mes) VALUES (?,?)`,
                      [data.idimg, data.mes],
                      (sqlTxn, res) => {
                        setEspere('');
                      },
                      error => {

                      },
                    )
                  })
                });
              }
            })
          }, 1000);
        }).catch(function (error) {

          setToastServ('sinConexHome');
          setTimeout(() => {
            dispatch(registro({
              nombre: '',
              email: '',
              foto: '',
              idsignal: '',
              imglocal: ''
            }));
            navigation.navigate('Home');
          }, 5000);

        });
      }
      catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          Alert.alert('Registro cancelado... intenta de nuevo')
        } else if (error.code === statusCodes.IN_PROGRESS) {
          Alert.alert('Status en progreso')
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Alert.alert('Servicio no habilitado')
        } else {
        }
      }

    } else {
      this.AlertPro.close();
      try {
        await GoogleSignin.signOut();
        axios.post(RUTA_LOGIN_TRES, {
          email: user.email,
          foto: user.foto
        }).then(resp => {
          dispatch(registro(null));
          setIsSwitchOnUno(false);
          dispatch(camaraload(false));
          setIsSwitchOnDos(false);
          dispatch(loadNoti(false));
          dispatch(loadsancion(0));
          OneSignal.disablePush(true);
          db.transaction(txn => {
            txn.executeSql(
              `DROP TABLE likes`,
              [],
              (sqlTxn, res) => {

              },
              error => {
              },
            )
          })
        }).catch(function (error) {
          setToastServ('sinConexHome');
        });

      }
      catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        } else if (error.code === statusCodes.IN_PROGRESS) {
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        } else {
        }
      }
    }
  }

  const logOut = () => {
    this.AlertPro.open()
    setMsj('Al eliminar este registro quedas sin acceso a varias funciones.');
  };

  const noPoliticas = () => {
    this.AlertPro.close();
  };

  const irPoliticas = () => {
    navigation.navigate('MyWebView');
  };

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        // Android 13 y posterior
        const result = await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
        handlePermissionResult(result, PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      } else {
        // Android 12 y anteriores
        const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        handlePermissionResult(result, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      }
    }
  };

  const handlePermissionResult = async (result, permission) => {
    console.log(result, permission)
    switch (result) {
      case RESULTS.UNAVAILABLE:
        Alert.alert('Permiso no disponible en este dispositivo');
        break;
      case RESULTS.DENIED:
        const requestResult = await request(permission);
        if (requestResult === RESULTS.GRANTED) {
          verGale(user);
        } else {
          Alert.alert('Permiso denegado');
        }
        break;
      case RESULTS.LIMITED:
        Alert.alert('Permiso limitado');
        break;
      case RESULTS.GRANTED:
        verGale(user);
        break;
      case RESULTS.BLOCKED:
        Alert.alert('Permiso bloqueado');
        break;
    }
  };

  const cargarImg = () => {
    checkPermission();
  };

  const verGale = (data) => {
    ImagePicker.openPicker({
      width: 120,
      height: 120,
      cropping: true
    }).then(image => {
      let localUri = image.path;
      let filename = localUri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      let formData = new FormData();
      formData.append('image', { uri: localUri, name: filename, type });
      formData.append("email", data.email);
      formData.append("foto", data.foto);
      axios.post(RUTA_LOGIN_CUATRO, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: formData => formData,
      }).then(res => {
        dispatch(registro({
          nombre: user.nombre,
          email: user.email,
          foto: res.data,
          idsignal: idPlay,
          imglocal: localUri
        }));
      }).catch(err => {
      });
    }).catch(err => {

    })

  };

  const cambiarNombre = () => {
    setModalVisibles(true);
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View
            style={{
              backgroundColor: '#000000',
              height: '2%',
              width: '220%',
            }}></View>

          <View style={{
            marginTop: 50,
          }}>
            {user === null ?
              <UserLogin
                idPlay={idPlay}
                logIn={logIn}
                espere={espere} />
              :
              <View style={{
                backgroundColor: '#000000',
                marginBottom: 100
              }}>
                <TouchableOpacity
                  onPress={() => cargarImg()}
                >
                  <FastImage
                    source={{
                      uri: RUTA_IMG_USER + user.foto,
                      priority: FastImage.priority.normal
                    }}
                    resizeMode={FastImage.resizeMode.stretch}
                    contentContainerStyle={{ padding: 20 }}
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'center',
                      height: 150,
                      width: 150,
                      bottom: 0,
                      borderRadius: 100

                    }} />

                  {user.foto === 'user/user.jpg' &&
                    <Iconc name='camera' color="#FCB213" size={23} style={{
                      justifyContent: 'center',
                      alignSelf: 'center',
                      position: 'absolute',
                      top: '80%',
                      color: '#000'
                    }} />
                  }

                </TouchableOpacity>
                <TouchableOpacity onPress={() => cambiarNombre()}>
                  <Text style={{ color: 'white', marginTop: 20, alignSelf: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 15 }}>{user.nombre}</Text>
                </TouchableOpacity>

                <Text style={{ color: '#FCB213', marginTop: 0, alignSelf: 'center', justifyContent: 'center', fontSize: 10 }}>{user.email}</Text>
                <Button mode="contained" onPress={() => logOut()}
                  style={{
                    backgroundColor: 'brown',
                    marginHorizontal: 36,
                    borderRadius: 20,
                    borderColor: '#FCB213',
                    borderWidth: 3,
                    marginTop: 50,
                  }}>
                  Borrar Usuario
                </Button>

                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 40,
                  marginTop: 50
                }}>
                  <Text style={{ color: 'white' }}>Abrir App en Cámara</Text>
                  <Switch value={isSwitchOnUno} onValueChange={() => onToggleSwitchUno(isSwitchOnUno)} />
                </View>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 40,
                  marginTop: 35,
                  marginBottom: 30
                }}>
                  <Text style={{ color: 'white' }}>Recibir Notificaciones</Text>
                  <Switch value={isSwitchOnDos} onValueChange={() => onToggleSwitchDos(isSwitchOnDos)} />
                </View>

                <View>

                  {sancion !== 0 ?
                    sancion.tiempoRestante !== '0' || sancion.veces !== '0' ?
                      sancion.tiempoRestante !== '0' && sancion.veces < '3' ?
                        <View>
                          <Text style={{
                            alignSelf: 'center',
                            justifyContent: 'center',
                            fontSize: 13,
                            color: '#FFA695',
                            padding: 5
                          }}>Estás sancionado</Text>
                          <Text style={{
                            alignSelf: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            color: 'white',
                            padding: 5
                          }}>Sanciones:  {sancion.veces}       Faltan:  {sancion.tiempoRestante}   días </Text>
                        </View>
                        : sancion.veces < '3' ?
                          <View style={{
                            alignSelf: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                          }}>
                            <Text style={{

                              fontSize: 13,
                              color: '#FCB213',
                              padding: 5
                            }}>Sanciones </Text>
                            <Text style={{
                              fontSize: 13,
                              color: 'white',
                              padding: 5
                            }}>  {sancion.veces}</Text>
                          </View>
                          :
                          <View>
                            <Text style={{
                              alignSelf: 'center',
                              justifyContent: 'center',
                              fontSize: 13,
                              color: 'red',
                              padding: 5
                            }}>Cuenta Bloqueada</Text>
                            <Text style={{
                              alignSelf: 'center',
                              justifyContent: 'center',
                              fontSize: 11,
                              color: 'white',
                              padding: 5
                            }}>Sanciones:  {sancion.veces}</Text>
                          </View>
                      : ''

                    : ''
                  }
                  {sancion !== 0 ?
                    sancion.deletemes < '5' && sancion.deletemes > '0' ?
                      <Text style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        color: '#fff',
                        padding: 5
                      }}
                      >Puedes eliminar  <Text style={{ color: '#FCB213', fontSize: 13 }}> {sancion.deletemes} </Text>  eventos este mes</Text>
                      : sancion.deletemes === '0' ?
                        <Text style={{
                          alignSelf: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          color: '#FFA695',
                          padding: 5
                        }}
                        >No puedes eliminar más eventos este mes</Text>
                        : ''
                    : ''
                  }
                </View>
              </View>
            }
          </View>
          <ModalView
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            texto={ModalConfig.texto}
          />
          <ModalNombre
            modalVisibles={modalVisibles}
            setModalVisibles={setModalVisibles}
          />
        </ScrollView>
        <View
          style={{
            backgroundColor: '#000000',
            height: '10%', // 70% of height device screen
            width: '220%', // 80% of width device screen
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
            <TouchableOpacity>
              <Button mode="contained" onPress={() => irPoliticas()}
                style={{
                  height: 53,
                  backgroundColor: '#000',
                  marginHorizontal: 0,
                  borderRadius: 10,
                  borderColor: '#FCB213',
                  borderWidth: 3,
                  marginBottom: 30
                }}>
                <Text style={{
                  fontSize: 11,
                  color: '#FCB213',
                }}>Privacidad & Condiciones</Text>
              </Button>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(true)}>
              <Image
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: 60,
                  height: 60,
                  marginLeft: 40,
                  marginBottom: 30
                }}
                source={require('../imgs/information.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ProAlert
          cargar={signInOut}
          noCargar={noPoliticas}
          titulo={msj}
        />
      </SafeAreaView>
      <ToastServicios dato={ToastServ} />
    </>
  )
}

export default LoginUser;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#EBF6FF',
  },
  buttonDos: {
    position: 'absolute',
    backgroundColor: '#1964AE',
    bottom: 8,
    right: 20,
    height: 40,
    width: 80,
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 2,
    alignItems: 'center',
  },
})
