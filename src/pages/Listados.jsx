import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  LogBox,
  PermissionsAndroid
} from 'react-native';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import Icons from 'react-native-vector-icons/FontAwesome5';
import Iconx from 'react-native-vector-icons/MaterialIcons';
import Iconc from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import { Dialog } from '@rneui/themed';
import ToastServicios from '../components/ToastServicios';
import Spinner from 'react-native-loading-spinner-overlay';
import { BorrarImageUrl } from '../components/BorrarImageUrl';
import VideoManager from '@salihgun/react-native-video-processor'
import { BorrarVideosUrl } from '../components/BorrarVideosUrl';
import { BorrarFotoUrl } from '../components/BorrarFotoUrl';
import { loadpricarga } from '../redux/slices/PrimeraVezMapa';
import config from '../config';
import { loadsancion } from '../redux/slices/sancion';
import { Notificaciones } from '../components/Notificaciones';
import { NotificacionesDos } from '../components/NotificacionesDos';
import ModalCamara from '../components/ModalCamara';
import { notiContext } from '../context/notiContext';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useRoute, useNavigation } from '@react-navigation/native';


const MAPA_KEY = config.API_KEY_MAPS;
const RUTA_CAM_UNO = config.RUTA_CAM_UNO;
const RUTA_CAM_DOS = config.RUTA_CAM_DOS;
const RUTA_CAM_TRES = config.RUTA_CAM_TRES;
const RUTA_CAM_CUATRO = config.RUTA_CAM_CUATRO;

const MaxCaracteres = 250;

function Camara(){

  const route = useRoute();
  const navigation = useNavigation();

  const { enterNoti } = useContext(notiContext);
  const { datoGps, brujula, pais } = route.params;
  const { user } = useSelector(state => state.user);
  const { reten } = useSelector(state => state.reten);
  const { sancion } = useSelector(state => state.sancion);
  const dispatch = useDispatch();
  const [posicion, setPosicion] = useState(datoGps);
  const [verificarFoto, setVerificarFoto] = useState('');
  const [fotoSize, setFotoSize] = useState('');
  const [codigo, setCodigo] = useState('');
  const [toastServ, setToastServ] = useState('');
  const [frase, setFrase] = useState('');
  const [zona, setZona] = useState('');
  const [msj, setMsj] = useState('');
  const [msj2, setMsj2] = useState('');
  const [vistaFotoPantalla, setVistaFotoPantalla] = useState('');
  const [visible2, setVisible2] = useState(false);
  const [titleDialogo, setTitleDialogo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vercargaFoto, setVercargaFoto] = useState('nover');
  const [fotoSizeAncho, setFotoSizeAncho] = useState(0);
  const [fotoSizeAlto, setFotoSizeAlto] = useState(0);
  const [evento, setEvento] = useState('');
  const [lanzarNoti, setLanzarNoti] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [eventoVideo, setEventoVideo] = useState('');
  const [fotoVideo, setFotoVideo] = useState(0);
  const [loadVideo, setLoadVideo] = useState(0);
  const [videoThumbnail, setVideoThumbnail] = useState('');
  const [msjCamIni, setMsjCamIni] = useState('');
  const [espere, setEspere] = useState('');
  const [textoRecorte, setTextoRecorte] = useState('');
  const [timeUse, setTimeUse] = useState(0);
  const [gpsCache, setGpsCache] = useState(0);
  const [brujula2, setBrujula2] = useState(brujula);
  const caracteresRestantes = MaxCaracteres - frase.length;
  const { latitude, longitude } = posicion;

  const [showAlerts, setShowAlerts] = useState(false);

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

    if (timeUse === 1) {
      navigation.navigate('Home');
    }

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
        }}>Cámara</Text>
      )
    });

    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    const d = new Date();
    const mes = d.getMonth();
    const day = d.getDate();
    const h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    const ms = d.getMilliseconds();
    setCodigo(mes + '' + day + '' + h + '' + m + '' + s + '' + ms);

    axios.post(RUTA_CAM_UNO, {
      email: user.email
    }).then(response => {
      const info = response.data;
      if (info === 1) {
        setTimeout(async () => {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location Permission',
                message: 'This app needs access to your location.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              Geolocation.getCurrentPosition((pos) => {
                const crd = pos.coords;
                setPosicion({
                  latitude: crd.latitude,
                  longitude: crd.longitude,
                  latitudeDelta: 0.12,
                  longitudeDelta: 0.12,
                });
                const API_KEYS = MAPA_KEY;
                const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&key=${API_KEYS}`;
                fetch(apiUrl)
                  .then(response => response.json())
                  .then(data => {
                    if (enterNoti !== 0) {
                      navigation.goBack()
                      setModalVisible(false);
                      navigation.navigate('Individual', {
                        datoItem: enterNoti,
                        noti: 1
                      })
                    } else {
                      const result = data.results[0];
                      function getAddressComponent() {
                        for (let i = 0; i < result.address_components.length; i++) {
                          let component = result.address_components[i];
                          if (component.types.includes('administrative_area_level_2')) {
                            return component.long_name;
                          }
                        }
                      };
                      const locationdptos = getAddressComponent();
                      const results = data.results[2]?.address_components[1]?.long_name;
                      const resultsdos = data.results[2]?.address_components[2]?.long_name;
                      if (locationdptos !== undefined) {
                        setZona(locationdptos + ', ' + reten);
                      } else if (results !== undefined) {
                        setZona(results + ', ' + reten);
                      } else {
                        setZona(resultsdos + ', ' + reten);
                      }
                      setModalVisible(true);
                    }
                    dispatch(loadsancion({
                      tiempoRestante: '0',
                      veces: sancion.veces,
                      deletemes: sancion.deletemes,
                      rango: sancion.rango
                    }));
                    setTimeout(() => {
                      setTimeUse(1);
                    }, 300000);
                  })
                  .catch(error => console.error('Error fetching reverse geocoding data:', error));
              }, (error) => {
                setGpsCache(1);
              }, {
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
              //console.log('Location permission denied');
            }
          } catch (err) {
            //console.warn(err);
          }
        }, 1000);
      } else {
        setZona('Sin Acceso');
        setVisible2(!visible2);
        setMsj2(info);
        setTitleDialogo('Sin Acceso');
      };
    })
      .catch(function (error) {
        setTimeout(() => {
          setVisible2(!visible2);
          setMsj2('Verifique conexión a internet');
          setTitleDialogo('Error de Conexión');
          setToastServ('sinConexHome');
        }, 1000);
      });
  }, [timeUse, gpsCache]);

  const sancionado = () => {
    navigation.navigate('Home');
  };
  const tomarFoto = () => {
    setFotoVideo(1);
    setModalVisible(false);
    ImagePicker.openCamera({
      mediaType: 'Photo'
    }).then(image => {
      setModalVisible(false);
      setEspere('Espere un momento')
      const anchos = image.width * 0.25;
      const altos = image.height * 0.25;
      const img = image.path;
      ImageResizer.createResizedImage(img, anchos, altos, 'JPEG', 90)
        .then((resizedImage) => {
          setFotoSize(resizedImage.uri);
          setFotoSizeAncho(resizedImage.width);
          setFotoSizeAlto(resizedImage.height);
          BorrarImageUrl(img);
          const imgactual = resizedImage.width + '' + resizedImage.height;
          const imgAntigua = fotoSizeAncho + '' + fotoSizeAlto;
          if (verificarFoto === '') {
            if (resizedImage.height === resizedImage.width) {
              const anchosDos = resizedImage.width / 2;
              const altosDos = resizedImage.height / 2;
              setVistaFotoPantalla({
                anchoPantalla: anchosDos,
                altoPantalla: altosDos
              });
            } else if (resizedImage.width * 2 < resizedImage.height) {
              const anchosDos = resizedImage.width + 100;
              const altosDos = resizedImage.height + 100;
              setVistaFotoPantalla({
                anchoPantalla: anchosDos,
                altoPantalla: altosDos
              });
            } else if (resizedImage.width < resizedImage.height) {
              if (resizedImage.height < 750) {
                const anchosDos = resizedImage.width / 2 + 120;
                const altosDos = resizedImage.height / 2 + 120;
                setVistaFotoPantalla({
                  anchoPantalla: anchosDos,
                  altoPantalla: altosDos
                });
              } else {
                const anchosDos = resizedImage.width / 2 + 20;
                const altosDos = resizedImage.height / 2 + 20;
                setVistaFotoPantalla({
                  anchoPantalla: anchosDos,
                  altoPantalla: altosDos
                });
              }
            } else if (resizedImage.width > resizedImage.height) {
              const anchosDos = resizedImage.width / 2.6;
              const altosDos = resizedImage.height / 2.6;
              setVistaFotoPantalla({
                anchoPantalla: anchosDos,
                altoPantalla: altosDos
              });
            } else {
              //console.log('sin ajuste imagen');
            }
          } else {
            if (imgactual === imgAntigua) {
              subirFoto(resizedImage.uri); // sube directamente la foto              
            } else {
              setVisible2(!visible2);
              setMsj2('No puedes cambiar las dimesiones de la imagen una vez cargues la primera foto.');
              setTitleDialogo('Error de dimensión');
            }
          }
        })
        .catch((error) => {
          console.error('Error al redimensionar la imagen:', error);
        });
    }).catch((e) => {
      if (e.code !== 'E_PICKER_CANCELLED') {
      }
    });
  };

  const subirFoto = (dataImg, problema) => {
    if (pais === 'Colombia') {
      setVercargaFoto('nover');
      setMsjCamIni('Cargardo Evento');
      setTimeout(() => {
        setMsjCamIni('Ubíquese donde haya señal');
      }, 8000);
      setTimeout(() => {
        setMsjCamIni('Señal Débil. Espere');
      }, 5000);
      const evevial = problema;
      const image = dataImg;
      if (verificarFoto === '') {
        setLoading(true);
        if (image !== verificarFoto) {
          if (problema !== undefined && problema !== '') {
            let localUri = image;
            let filename = localUri.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            let formData = new FormData();
            formData.append('image', { uri: localUri, name: filename, type });
            formData.append("nombre", user.nombre);
            formData.append("problem", problema);
            formData.append("zona", zona);
            formData.append("frase", frase);
            formData.append("email", user.email);
            formData.append("lat", latitude);
            formData.append("lng", longitude);
            formData.append("signal", user.idsignal);
            formData.append("codigo", codigo);
            formData.append("ancho", fotoSizeAncho);
            formData.append("alto", fotoSizeAlto);
            axios.post(RUTA_CAM_DOS, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
              transformRequest: formData => formData,
            }).then(res => {
              setLoading(false);
              setMsjCamIni('');
              if (res.data === 'primera') {
                setVerificarFoto(fotoSize);
                setLanzarNoti({
                  problema: evevial,
                  zona: zona,
                  frase: frase,
                  codigo: codigo
                });
                setMsj('Llevas 1 de 3 Fotos');
                setShowAlerts(true);
                dispatch(loadpricarga(1));
                BorrarImageUrl(image);
              } else if (res.data === 'e1') {
                setToastServ('errorCarga');
                setTimeout(() => {
                  subirFoto(image, evento);
                }, 3000);
              } else if (res.data === 'existe') {
                navigation.navigate('Home');
              } else {
                navigation.navigate('Home');
              }
            }).catch(err => {
              subirFoto(image, evento);
            });
          } else {
            setLoading(false);
            subirFoto(image, evento);
          }
        } else {
          setToastServ('otrafoto');
        }
      } else {

        if (image !== verificarFoto) {
          let localUri = image;
          let filename = localUri.split('/').pop();
          let match = /\.(\w+)$/.exec(filename);
          let type = match ? `image/${match[1]}` : `image`;
          let formData = new FormData();
          formData.append('image', { uri: localUri, name: filename, type });
          formData.append("email", user.email);
          formData.append("codigo", codigo);
          axios.post(RUTA_CAM_TRES, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            transformRequest: formData => formData,
          }).then(res => {
            setMsjCamIni('');
            if (res.data === 'segunda') {
              setVerificarFoto(fotoSize);
              setMsj('Llevas 2 de 3 Fotos');
              setShowAlerts(true);
              BorrarImageUrl(image);
            } else if (res.data === 'tercera') {
              setPosicion('')
              setVerificarFoto(fotoSize);
              setVisible2(!visible2);
              setMsj2('Mira el evento en el listado');
              setTitleDialogo('Carga completada');
              BorrarImageUrl(image);
              Notificaciones(lanzarNoti.problema, lanzarNoti.zona, lanzarNoti.frase, lanzarNoti.codigo, user.email, reten);
              setTimeout(() => {
                navigation.navigate('Home');
                setVisible2(!visible2);
              }, 2200);
            } else if (res.data === 'e2' || res.data === 'e3') {
              setToastServ('errorCarga');
              setTimeout(() => {
                subirFoto(image, evento);
              }, 3000);
            } else {
              navigation.navigate('Home');
            }
          }).catch(err => {
            subirFoto(image, evento);
          });
        } else {
          setToastServ('otrafoto');
        }
      };

    } else {
      setVisible2(!visible2);
      setMsj2('Este servicio aplica cuando estés en el territorio colombiano.\n\nThis service applies when you are in Colombian territory.');
      setTitleDialogo('Lo sentimos');
      BorrarImageUrl(dataImg);
      setTimeout(() => {
        navigation.navigate('Home');
        setVisible2(!visible2);
      }, 6000);
    }
  };

  const subirVideo = (problema) => {
    if (pais === 'Colombia') {
      setLoadVideo(1);
      setMsjCamIni('Cargardo Evento');
      setTimeout(() => {
        setMsjCamIni('Reconectando... espere');
      }, 14000);
      setTimeout(() => {
        setMsjCamIni('Cargando... Espere');
      }, 7000);
      const evevial = problema;
      let localUri = loadVideo;
      let localUri2 = videoThumbnail;
      let filename = localUri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      let formData = new FormData();
      formData.append('video', { uri: localUri, name: 'video.mp4', type: 'video/mp4' });
      formData.append("nombre", user.nombre);
      formData.append("problem", evevial);
      formData.append("zona", zona);
      formData.append("frase", frase);
      formData.append("email", user.email);
      formData.append("lat", latitude);
      formData.append("lng", longitude);
      formData.append("signal", user.idsignal);
      formData.append("codigo", codigo);
      formData.append("ancho", fotoSizeAncho);
      formData.append("alto", fotoSizeAlto);
      formData.append('image', { uri: localUri2, name: filename, type });
      axios.post(RUTA_CAM_CUATRO, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: formData => formData,
      }).then(res => {
        setMsjCamIni('');
        if (res.data === 'primera') {
          setVisible2(!visible2);
          setMsj2('Mira el evento en el listado');
          setTitleDialogo('Carga completada');
          BorrarVideosUrl(localUri);
          Notificaciones(evevial, zona, frase, codigo, user.email, reten);
          setTimeout(() => {
            BorrarFotoUrl(localUri2);
          }, 1000);
          setTimeout(() => {
            setLoadVideo(0);
            dispatch(loadpricarga(1));
            navigation.navigate('Home');
            setVisible2(!visible2);
          }, 2200);
        } else if (res.data === 'primera2') {
          setVisible2(!visible2);
          setMsj2('En breve recibirás la notificación de tu evento');
          setTitleDialogo('Carga en proceso');
          BorrarVideosUrl(localUri);
          NotificacionesDos(evevial, zona, frase, codigo, user.email, reten);
          setTimeout(() => {
            BorrarFotoUrl(localUri2);
          }, 2000);
          setTimeout(() => {
            setLoadVideo(0);
            dispatch(loadpricarga(1));
            navigation.navigate('Home');
            setVisible2(!visible2);
          }, 5000);
        } else if (res.data === 'e1') {
          setLoadVideo(0);
          navigation.navigate('Home');
        } else if (res.data === 'reload') {
          setToastServ('errorCarga');
          setTimeout(() => {
            subirVideo(eventoVideo);
          }, 3000);
        } else {
          setLoadVideo(0);
          navigation.navigate('Home');
        }
      }).catch(err => {
        subirVideo(eventoVideo);
      });

    } else {
      setVisible2(!visible2);
      setMsj2('Este servicio aplica cuando estés en el territorio colombiano.\n\nThis service applies when you are in Colombian territory.');
      setTitleDialogo('Lo sentimos');
      BorrarVideosUrl(loadVideo);
      setTimeout(() => {
        BorrarFotoUrl(videoThumbnail);
        navigation.navigate('Home');
        setVisible2(!visible2);
      }, 6000);
    }
  };

  useEffect(() => {
    if (evento !== '') {
      selectButton();
    }
    if (eventoVideo !== '') {
      selectButtonVideo();
    }
  }, [evento, eventoVideo]);

  const selectButton = () => {
    subirFoto(fotoSize, evento);
  };

  const selectButtonVideo = () => {
    subirVideo(eventoVideo);
  };

  const cargarOtra = () => {
    setVercargaFoto('ver');
    setShowAlerts(false);
    tomarFoto();
  };

  const noCargar = () => {
    Notificaciones(lanzarNoti.problema, lanzarNoti.zona, lanzarNoti.frase, lanzarNoti.codigo, user.email, reten);
    setShowAlerts(false);
    dispatch(loadpricarga(1));
    navigation.navigate('Home');
  };

  const salirModal = () => {
    setModalVisible(false);
    navigation.navigate('Home');
  };

  const miniatura = async (ruta) => {
    const thumbnailPath = await VideoManager.createThumbnail(ruta);
    Image.getSize(thumbnailPath, (width, height) => {
      const anchox = width;
      const altox = height;
      const anchos = width * 0.75;
      const altos = height * 0.75;
      const img = thumbnailPath;
      ImageResizer.createResizedImage(img, anchos, altos, 'JPEG', 90)
        .then((resizedImage) => {
          setVideoThumbnail(resizedImage.uri);
          setFotoSizeAncho(anchox);
          setFotoSizeAlto(altox);
        });
    });
  };

  const [progress, setProgress] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (isCompressing) {
      const timer = setInterval(() => {
        setProgress(prevProgress => prevProgress + 1);
      }, time); // Incrementa el progreso cada segundo
      return () => clearInterval(timer);
    }
  }, [isCompressing]);

  const trimVideo = async (rutaVideo, duracion, anchoi, altoi) => {
    setLoadVideo(1);
    setIsCompressing(true);
    if (duracion >= 15000) {
      setToastServ('hayRecorte');
      setTextoRecorte('Redimensión y recorte de video');
      setTimeout(() => {
        setTextoRecorte('Terminando Compresión');
      }, 24000);
      setTimeout(() => {
        setTextoRecorte('Compresión de video');
      }, 14000);
    } else if (duracion >= 12000 && duracion < 15000) {
      setTextoRecorte('Redimensionando video');
      setTimeout(() => {
        setTextoRecorte('Terminando Compresión');
      }, 19000);
      setTimeout(() => {
        setTextoRecorte('Compresión de video');
      }, 11000);
    } else if (duracion >= 9000 && duracion < 12000) {
      setTextoRecorte('Redimensionando video');
      setTimeout(() => {
        setTextoRecorte('Terminando Compresión');
      }, 16000);
      setTimeout(() => {
        setTextoRecorte('Compresión de video');
      }, 8000);
    } else if (duracion >= 6000 && duracion < 9000) {
      setTextoRecorte('Redimensionando video');
      setTimeout(() => {
        setTextoRecorte('Terminando Compresión');
      }, 12000);
      setTimeout(() => {
        setTextoRecorte('Compresión de video');
      }, 5000);
    } else if (duracion >= 3000 && duracion < 6000) {
      setTextoRecorte('Redimensionando video');
      setTimeout(() => {
        setTextoRecorte('Terminando Compresión');
      }, 9000);
      setTimeout(() => {
        setTextoRecorte('Compresión de video');
      }, 3000);
    } else if (duracion < 3000) {
      setTextoRecorte('Redimensionando video');
      setTimeout(() => {
        setTextoRecorte('Terminando Compresión');
      }, 7000);
      setTimeout(() => {
        setTextoRecorte('Compresión de video');
      }, 2000);
    }
    const timeSeg = duracion;
    try {
      const videoPath = rutaVideo;
      const startTime = 0;
      const duration = timeSeg;
      const anchos = anchoi;
      const altos = altoi;
      const videoCompress = await VideoManager.trimVideo(videoPath, startTime, duration, anchos, altos);
      if (videoCompress) {
        setIsCompressing(false);
        setMsjCamIni('Ajustando audio');
        miniatura(videoCompress);
        if (timeSeg < 3000) {
          setTimeout(() => {
            setLoadVideo(videoCompress);
          }, 3000);
        } else if (timeSeg < 6000 && timeSeg >= 3000) {
          setTimeout(() => {
            setLoadVideo(videoCompress);
          }, 4000);
        } else if (timeSeg < 9000 && timeSeg >= 6000) {
          setTimeout(() => {
            setLoadVideo(videoCompress);
          }, 5000);
        } else if (timeSeg < 12000 && timeSeg >= 9000) {
          setTimeout(() => {
            setLoadVideo(videoCompress);
          }, 6000);
        } else if (timeSeg < 15000 && timeSeg >= 12000) {
          setTimeout(() => {
            setLoadVideo(videoCompress);
          }, 7000);
        } else if (timeSeg >= 15000) {
          setTimeout(() => {
            setLoadVideo(videoCompress);
          }, 8000);
        };
      };
    } catch (error) {
      console.error('Error al recortar el video:', error);
    }
  };

  const tomarVideo = () => {
    setFotoVideo(2);
    setModalVisible(false);
    ImagePicker.openCamera({
      mediaType: 'video',
    }).then(image => {
      if (image.duration >= 15000) {
        setTime(380);
      } else if (image.duration >= 13000 && image.duration < 14999) {
        setTime(360);
      } else if (image.duration >= 11000 && image.duration < 13999) {
        setTime(340);
      } else if (image.duration >= 9000 && image.duration < 10999) {
        setTime(320);
      } else if (image.duration >= 8000 && image.duration < 8999) {
        setTime(290);
      } else if (image.duration >= 7000 && image.duration < 7999) {
        setTime(250);
      } else if (image.duration >= 6000 && image.duration < 6999) {
        setTime(210);
      } else if (image.duration >= 5000 && image.duration < 5999) {
        setTime(170);
      } else if (image.duration >= 4000 && image.duration < 4999) {
        setTime(140);
      } else if (image.duration >= 3000 && image.duration < 3999) {
        setTime(120);
      } else if (image.duration >= 2000 && image.duration < 2999) {
        setTime(90);
      } else if (image.duration >= 1000 && image.duration < 1999) {
        setTime(60);
      };
      if (image.width >= 4320) { // 540p  8K
        const anchoimg = image.width / 8;
        const altoimg = image.height / 8;
        trimVideo(image.path, image.duration, anchoimg, altoimg);
      } else if (image.width >= 2160 && image.width < 4320) { // 360p 4k
        const anchoimg = image.width / 6;
        const altoimg = image.height / 6;
        trimVideo(image.path, image.duration, anchoimg, altoimg);
      } else if (image.width >= 1080 && image.width < 2160) { // 540  HD 2K
        const anchoimg = image.width / 3;
        const altoimg = image.height / 3;
        trimVideo(image.path, image.duration, anchoimg, altoimg);
      } else {
        const anchoimg = image.width / 2;
        const altoimg = image.height / 2;
        trimVideo(image.path, image.duration, anchoimg, altoimg);
      }
    }).catch((e) => {
      if (e.code !== 'E_PICKER_CANCELLED') {
      }
    });
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {zona === '' ?
            <View style={styles.cargando} >
              <ActivityIndicator animating={true} size="large" color="#FCB213" style={{
                marginTop: 300
              }} />
              {enterNoti !== 0 ?
                <Text style={{
                  color: '#fff',
                  fontSize: 15,
                }} >
                  Cargando Notificación
                </Text>
                :
                <Text style={{
                  color: '#fff',
                  fontSize: 20,
                }} >
                  Cargando Gps
                </Text>
              }
              {msj2 === '' ?

                <Text style={{
                  color: '#fff',
                  fontSize: 16,
                  marginLeft: 5
                }} >
                  Espere...
                </Text>
                :
                <Text style={{
                  color: '#fff',
                  fontSize: 20,
                  marginLeft: 5
                }} >
                  Verifique conexión
                </Text>
              }
            </View>
            : fotoVideo === 1 ?
              <>
                <View>
                  <View >
                    {verificarFoto !== '' && vercargaFoto === 'nover' ?
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: 'center',
                          marginTop: 320
                        }}
                      >
                        <ActivityIndicator size="large" color="#FCB213" />
                        <Text style={{
                          color: '#C1C1C1',
                          fontSize: 15,
                        }} >
                          {msjCamIni}
                        </Text>
                      </View>
                      :
                      <Spinner
                        visible={loading}
                        color='#FCB213'
                        overlayColor='rgba(0, 0, 0, 1)'
                        textContent={msjCamIni}
                        textStyle={{
                          color: '#fff',
                          fontSize: 15,
                          marginTop: -30
                        }}
                      />
                    }
                    {fotoSize === '' || vercargaFoto === 'ver' ?
                      <>
                        <View style={{
                          justifyContent: 'center',
                          alignSelf: 'center',
                          marginTop: 120,
                          marginBottom: 20
                        }}>
                          <TouchableOpacity
                            onPress={() => tomarFoto()}>
                            <Iconc name='camera' color="#FCB213" size={100} />
                          </TouchableOpacity>
                        </View>
                        <View>
                          {verificarFoto === '' ?
                            <Text style={{
                              color: '#fff',
                              justifyContent: 'center',
                              alignSelf: 'center', marginBottom: 50, fontSize: 11
                            }}>Toca para cargar imagen</Text>
                            : ''
                          }
                        </View>
                      </>
                      : verificarFoto === '' ?
                        <TouchableOpacity
                          onPress={() => tomarFoto()}>
                          <Image
                            style={{
                              justifyContent: 'center',
                              alignSelf: 'center',
                              width: vistaFotoPantalla.anchoPantalla,
                              height: vistaFotoPantalla.altoPantalla,
                              borderRadius: 20,
                              borderColor: '#FCB213',
                              borderWidth: 2,
                            }}
                            source={{ uri: fotoSize }}
                          />
                          <Iconc name='camera' color="#FCB213" size={20} style={{
                            justifyContent: 'center',
                            alignSelf: 'center',
                            position: 'absolute',
                            marginTop: 15,
                            color: '#FCB213'
                          }} />
                        </TouchableOpacity>
                        :
                        ''
                    }

                    {verificarFoto === '' ?
                      <View style={styles.input2} >
                        {zona !== '' &&
                          <>
                            {espere !== '' && fotoSize === '' &&
                              <View style={{ marginTop: 10 }}>
                                <ActivityIndicator size="large" color="#FCB213" />
                                <Text style={{
                                  justifyContent: 'center',
                                  alignSelf: 'center',
                                  color: '#fff',
                                  fontSize: 15,
                                  marginTop: 10
                                }}
                                >{espere}</Text>
                              </View>
                            }
                            <Text style={{
                              color: '#CDCDCD',
                              fontSize: 11,
                              marginRight: 15,
                              marginLeft: 15,
                              padding: 5,
                              fontWeight: 'bold'
                            }}>
                              {zona}
                            </Text>
                          </>
                        }
                      </View>
                      : ''
                    }

                    {fotoSize !== '' && verificarFoto === '' ?
                      <>
                        <Text style={styles.caracteres} >Total de caracteres: <Text style={{ fontSize: 9, color: '#EBC529' }}> {caracteresRestantes}</Text></Text>
                        <TextInput
                          style={styles.input}
                          theme={{ colors: { onSurfaceVariant: '#A3A3A3' }, }}
                          multiline={true}
                          numberOfLines={3}
                          onChangeText={setFrase}
                          value={frase}
                          placeholder="Ingrese comentario corto"
                          textColor="#000000"
                          maxLength={250}
                          borderColor='#FCB213'
                          borderWidth={2}
                        />
                      </>
                      :
                      ''
                    }

                    {fotoSize !== '' && verificarFoto === '' ?
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 70
                        }}>
                        <View style={{
                          flexDirection: 'row',
                          marginTop: -10
                        }}>
                          <TouchableOpacity
                            onPress={() => setEvento('Accidente')}>
                            <View style={{
                              backgroundColor: '#000000',
                              height: 70,
                              width: 115,
                              borderBottomLeftRadius: 25,
                              borderTopLeftRadius: 25,
                              justifyContent: 'center',
                              borderColor: '#FCB213',
                              borderWidth: 2,
                            }}>
                              <View style={{
                                flex: 1,
                                alignItems: 'center',
                                marginTop: 10
                              }}>
                                <Icons style={{ bottom: -2 }} name='ambulance' color="#FCB213" size={26} />
                                <Text style={{
                                  fontSize: 11,
                                  position: 'absolute',
                                  marginTop: 30,
                                  color: '#fff'
                                }}>Accidente</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setEvento('Reten')}>
                            <View style={{
                              backgroundColor: '#000000',
                              height: 70,
                              width: 90,
                              justifyContent: 'center',
                              borderColor: '#FCB213',
                              borderWidth: 2,
                            }}>
                              <View style={{
                                flex: 1,
                                alignItems: 'center',
                                marginTop: 10
                              }}>
                                <Iconx name='back-hand' color="#FCB213" size={27} />
                                <Text style={{
                                  fontSize: 11,
                                  position: 'absolute',
                                  marginTop: 30,
                                  color: '#fff'
                                }}>Retén</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setEvento('Evento vial')}>
                            <View style={{
                              backgroundColor: '#000000',
                              height: 70,
                              width: 115,
                              borderBottomRightRadius: 25,
                              borderTopRightRadius: 25,
                              justifyContent: 'center',
                              borderColor: '#FCB213',
                              borderWidth: 2,
                            }}>
                              <View style={{
                                flex: 1,
                                alignItems: 'center',
                                marginTop: 10
                              }}>
                                <Iconx style={{ bottom: 3 }} name='report-problem' color="#FCB213" size={35} />
                                <Text style={{
                                  fontSize: 11,
                                  position: 'absolute',
                                  marginTop: 30,
                                  color: '#fff'

                                }}>Evento Vial</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                        {
                          brujula2 === 'Baja' &&
                          <>
                            <Text style={{ color: '#fff', textAlign: 'center', fontSize: 10, marginTop: 5 }}>Precisión del GPS: <Text style={{ fontWeight: 'bold', fontSize: 13 }}> {brujula2}</Text></Text>
                            <Text style={{ color: '#fff', textAlign: 'center', fontSize: 10 }}>Cargue comentario de donde está ubicado</Text>
                          </>
                        }
                      </View>
                      :
                      ''
                    }
                  </View>
                </View>

                <AwesomeAlert
                  show={showAlerts}
                  showProgress={false}
                  title={msj}
                  message="¿Deseas cargar otra foto?"
                  closeOnTouchOutside={true}
                  closeOnHardwareBackPress={false}
                  showCancelButton={true}
                  showConfirmButton={true}
                  cancelText="  No Cargar  "
                  confirmText=" Cargar Otra "
                  confirmButtonColor="#064B00"
                  cancelButtonColor="#FF0000"
                  onCancelPressed={() => {
                    noCargar();
                  }}
                  onConfirmPressed={() => {
                    cargarOtra();
                  }}
                />

              </>
              : fotoVideo === 2 ?
                loadVideo === 0 ?
                  <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 120,
                    marginBottom: 20
                  }}>
                    <TouchableOpacity
                      onPress={() => tomarVideo()}>
                      <Iconc name='video-camera' color="#FCB213" size={100} />
                    </TouchableOpacity>
                    <Text style={{
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginBottom: 50,
                      fontSize: 11
                    }}>Toca para tomar video</Text>
                    <Text style={{
                      color: '#CDCDCD',
                      fontSize: 11,
                      marginRight: 15,
                      marginLeft: 15,
                      padding: 5,
                      fontWeight: 'bold'
                    }}>
                      {zona}
                    </Text>
                  </View>
                  : loadVideo === 1 ?
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: 'center',
                        marginTop: 320
                      }}
                    >
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {isCompressing &&
                          <>
                            <Text style={{ color: '#C1C1C1', fontSize: 13 }}>{`${textoRecorte}`}</Text>
                            <Text style={{ color: '#FCB213', fontSize: 18, textAlign: 'center', marginTop: 10, marginBottom: 15 }}>{`${progress}%`}</Text>
                          </>
                        }
                      </View>
                      {msjCamIni !== '' &&
                        <>
                          <ActivityIndicator size="large" color="#FCB213" />
                          <Text style={{
                            color: '#C1C1C1',
                            fontSize: 15,
                          }} >
                            {msjCamIni}
                          </Text>
                        </>
                      }
                    </View>
                    :
                    <>
                      <Image
                        style={{
                          justifyContent: 'center',
                          alignSelf: 'center',
                          width: 300,
                          height: 350,
                          borderRadius: 20,
                          borderColor: '#FCB213',
                          borderWidth: 2,
                        }}
                        source={{ uri: videoThumbnail }}
                      />
                      <View style={styles.input2} >
                        {zona !== '' &&
                          <Text style={{
                            color: '#fff',
                            fontSize: 11,
                            marginRight: 15,
                            marginLeft: 15,
                            padding: 5,
                            fontWeight: 'bold'
                          }}>
                            {zona}
                          </Text>
                        }
                      </View>
                      <Text style={styles.caracteres} >Total de caracteres: <Text style={{ fontSize: 9, color: '#EBC529' }}> {caracteresRestantes}</Text></Text>
                      <TextInput
                        style={styles.input}
                        theme={{ colors: { onSurfaceVariant: '#A3A3A3' }, }}
                        multiline={true}
                        numberOfLines={3}
                        onChangeText={setFrase}
                        value={frase}
                        placeholder="Ingrese comentario corto"
                        textColor="#000000"
                        maxLength={250}
                        borderColor='#FCB213'
                        borderWidth={2}
                      />
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 70
                        }}>
                        <View style={{
                          flexDirection: 'row',
                          marginTop: -10
                        }}>
                          <TouchableOpacity
                            onPress={() => setEventoVideo('Accidente')}>
                            <View style={{
                              backgroundColor: '#000000',
                              height: 70,
                              width: 115,
                              borderBottomLeftRadius: 25,
                              borderTopLeftRadius: 25,
                              justifyContent: 'center',
                              borderColor: '#FCB213',
                              borderWidth: 2,
                            }}>
                              <View style={{
                                flex: 1,
                                alignItems: 'center',
                                marginTop: 10
                              }}>
                                <Icons style={{ bottom: -2 }} name='ambulance' color="#FCB213" size={26} />
                                <Text style={{
                                  fontSize: 11,
                                  position: 'absolute',
                                  marginTop: 30,
                                  color: '#fff'
                                }}>Accidente</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setEventoVideo('Reten')}>
                            <View style={{
                              backgroundColor: '#000000',
                              height: 70,
                              width: 90,
                              justifyContent: 'center',
                              borderColor: '#FCB213',
                              borderWidth: 2,
                            }}>
                              <View style={{
                                flex: 1,
                                alignItems: 'center',
                                marginTop: 10
                              }}>
                                <Iconx name='back-hand' color="#FCB213" size={27} />
                                <Text style={{
                                  fontSize: 11,
                                  position: 'absolute',
                                  marginTop: 30,
                                  color: '#fff'
                                }}>Retén</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setEventoVideo('Evento vial')}>
                            <View style={{
                              backgroundColor: '#000000',
                              height: 70,
                              width: 115,
                              borderBottomRightRadius: 25,
                              borderTopRightRadius: 25,
                              justifyContent: 'center',
                              borderColor: '#FCB213',
                              borderWidth: 2,
                            }}>
                              <View style={{
                                flex: 1,
                                alignItems: 'center',
                                marginTop: 10
                              }}>
                                <Iconx style={{ bottom: 3 }} name='report-problem' color="#FCB213" size={35} />
                                <Text style={{
                                  fontSize: 11,
                                  position: 'absolute',
                                  marginTop: 30,
                                  color: '#fff'

                                }}>Evento Vial</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                        {
                          brujula2 === 'Baja' &&
                          <>
                            <Text style={{ color: '#fff', textAlign: 'center', fontSize: 10, marginTop: 5 }}>Precisión del GPS: <Text style={{ fontWeight: 'bold', fontSize: 13 }}> {brujula2}</Text></Text>
                            <Text style={{ color: '#fff', textAlign: 'center', fontSize: 10 }}>Cargue comentario de donde está ubicado</Text>
                          </>
                        }
                      </View>
                    </>
                : ''
          }
          <View>
            <ModalCamara
              modalVisible={modalVisible}
              tomarVideo={tomarVideo}
              tomarFoto={tomarFoto}
              salirModal={salirModal}
              brujula2={brujula2}
            />
          </View>
          <View >
            <Dialog
              isVisible={visible2}
              animationType="fade"
            >
              <Dialog.Title title={titleDialogo} />
              <Text style={{ color: '#000000' }}>{msj2}</Text>
              {fotoVideo === 0 &&
                <Dialog.Actions>
                  <Dialog.Button title="SALIR" onPress={() => sancionado()} />
                </Dialog.Actions>
              }
            </Dialog>
          </View>
        </ScrollView>

      </SafeAreaView>
      <ToastServicios dato={toastServ} />
    </>
  )
}

export default Camara;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  input: {
    marginTop: 10,
    margin: 40,
    borderColor: '#fff',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 5,
  },
  input2: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: 'center',
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
  cargando: {
    justifyContent: "center",
    alignItems: 'center',
    marginTop: 20
  },
  caracteres: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 9,
    marginTop: 3,
    color: '#fff'
  }
});
