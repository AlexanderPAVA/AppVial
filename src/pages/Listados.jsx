vimport React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import { FlashList } from "@shopify/flash-list";
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import Iconc from 'react-native-vector-icons/Entypo';
import Iconsh from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { openDatabase } from "react-native-sqlite-storage";
const db = openDatabase({ name: "appLikes" });
import Icons from 'react-native-vector-icons/FontAwesome5';
import Iconx from 'react-native-vector-icons/MaterialIcons';
import ModalImg from '../components/ModalImg';
import ModalVideo from '../components/ModalVideo';
import { shareData } from '../components/shareData';
import ModalReporte from '../components/ModalReporte';
import ToastServicios from '../components/ToastServicios';
import { loadmes } from '../redux/slices/CargaMes';
import ImagePicker from 'react-native-image-crop-picker';
import { loadpricarga } from '../redux/slices/PrimeraVezMapa';
import config from '../config';
import { Notificarlikes } from '../components/Notificarlikes';
import ScrollImg from '../components/ScrollImg';
import RNFS from 'react-native-fs';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useRoute, useNavigation } from '@react-navigation/native';

const RUTA_LISTA_UNO = config.RUTA_LISTA_UNO;
const RUTA_LISTA_DOS = config.RUTA_LISTA_DOS;
const RUTA_LISTA_TRES = config.RUTA_LISTA_TRES;
const RUTA_LISTA_CUATRO = config.RUTA_LISTA_CUATRO;
const RUTA_LISTA_CINCO = config.RUTA_LISTA_CINCO;
const RUTA_LISTA_SEIS = config.RUTA_LISTA_SEIS;
const RUTA_LISTA_SIETE = config.RUTA_LISTA_SIETE;
const RUTA_IMG_USER = config.RUTA_IMG_USER;

const win = Dimensions.get('window');

function Listados() {

  const route = useRoute();
  const navigation = useNavigation();

  const { lista, likes } = route.params;
  const { user } = useSelector(state => state.user);
  const { mes } = useSelector(state => state.mes);
  const { sancion } = useSelector(state => state.sancion);
  const dispatch = useDispatch();
  const [listaIni, setListaIni] = useState([]);
  const [listaIniDos, setListaIniDos] = useState(lista);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    itemImg: '',
    itemid: '',
    altoModal: '',
    ratio2: '',
    formato: '',
    video: ''
  });

  const { itemImg, itemid, altoModal, ratio2, video } = modalInfo;
  const [listaLike, setListaLike] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [value, setValue] = useState(null);
  const [ocultarFiltro, setOcultarFiltro] = useState(false);
  const [reporte, setReporte] = useState('');
  const [borrar, setBorrar] = useState('');
  const [toastServ, setToastServ] = useState('');

  const [showAlert, setShowAlert] = useState(false);

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

  const vistauno = () => {
    if (listaIniDos.length === 1) {
      setOcultarFiltro(true);
      const idimgUno = listaIniDos[0].idimg;
      let formData = new FormData();
      formData.append("idiwsx", idimgUno);
      axios.post(RUTA_LISTA_UNO, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: formData => formData,
      }).then(res => {
        dispatch(loadpricarga(1))
      }).catch(err => {
      });
    } else if (listaIniDos.length === 0) {
      dispatch(loadpricarga(2));
      setTimeout(() => {
        navigation.navigate('Home');
      }, 3000);
    } else {
      dispatch(loadpricarga(1));
    }
  };

  useEffect(() => {
    setListaLike(likes);
    setListaIni(lista);
    vistauno();
    navigation.setOptions({
      headerStyle: { backgroundColor: '#000000' },
      headerTitle: titulo,
      headerShown: true,
      headerTintColor: '#fff',
      headerRight: () => (
        <View style={{
          flexDirection: 'row',
        }}>
          {ocultarFiltro === false ?
            <>
              <TouchableOpacity
                onPress={() => filtro('Accidente')}
                style={styles.filtro1}
              >
                <Icons style={{
                  left: 2,
                  top: 5
                }} name='ambulance' color="#FCB213" size={19} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => filtro('Reten')}
                style={styles.filtro3}
              >
                <Iconx style={{
                  top: 5
                }} name='back-hand' color="#FCB213" size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => filtro('Evento vial')}
                style={styles.filtro2}
              >
                <Iconx style={{
                  left: -2,
                  top: 4
                }} name='report-problem' color="#FCB213" size={23} />
              </TouchableOpacity>
            </>
            : ''
          }
        </View>

      ),
    });

    const verMes =(res)=>{

      if (res.rows.length > 0) {
        const listap = Array.from({ length: res.rows.length }).map((_, i) => res.rows.item(i));
        console.log(listap);

        axios.post(RUTA_LISTA_DOS, {
          data: listap,
          emailusu: user.email
        })
          .then(respt => {
            dispatch(loadmes(mesActual));
            ImagePicker.clean().then(() => {
              setTimeout(async () => {
                const cacheDir = RNFS.CachesDirectoryPath;
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                try {
                  const files = await RNFS.readDir(cacheDir);
                  for (const file of files) {
                    const fileInfo = await RNFS.stat(file.path);
                    const fileCreationDate = new Date(fileInfo.ctime);
                    if (fileCreationDate < oneMonthAgo) {
                      await RNFS.unlink(file.path);
                    }
                  }
                } catch (error) {
                }
              }, 500);
            }).catch(e => {
            });
          }).catch(function (error) {
          });
      }
    };

    const meses = new Date();
    const month = meses.getMonth();
    const monthNew = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mesActual = monthNew[month];
    const day = new Date();
    const dias = day.getDate();
    if (mes !== '') {
      if (dias >= 8 && mes !== mesActual) {
        db.transaction(txn => {
          txn.executeSql(
            `DELETE FROM likes WHERE mes != ?`,
            [mesActual],
            (sqlTxn, res) => {
              db.transaction(txn => {
                txn.executeSql(
                  `SELECT * FROM likes ORDER BY id ASC`,
                  [],
                  (sqlTxn, res) => {
                    verMes(res);
                  },
                  error => {
                  },
                );
              });
            },
            error => {
            },
          );
        });
      };
    } else {
      dispatch(loadmes(mesActual));
      //console.log('carga primera vez mes')
    }
  }, []);

  const filtro = useCallback((text) => {
    const newData = listaIniDos.filter(event => event.problem === text);
    setListaIni(newData);
  }, []);

  const onRefresh = useCallback(() => {
    if (value === 1) {
      setRefreshing(true);
      setListaIni(listaIniDos)
      wait(300).then(() => setRefreshing(false));
    } else {
      setValue(null);
      axios.get(RUTA_LISTA_TRES)
        .then(function (listas) {
          setListaIni(listas.data);
          setListaIniDos(listas.data)
        })
        .catch(function (error) {
        });
    }
  }, []);

  const verModalLista = (itemImg, itemid, ancho, alto, formato, video) => {
    if (formato === 'foto') {
      const ratio2 = win.width / ancho;
      setModalVisible(true);
      setModalInfo({
        itemImg: itemImg,
        itemid: itemid,
        altoModal: alto,
        ratio2: ratio2,
        formato: formato,
        video: video
      });
    } else {
      const ratio2 = win.width / ancho;
      setModalVisible2(true);
      setModalInfo({
        itemImg: itemImg,
        itemid: itemid,
        altoModal: alto,
        ratio2: ratio2,
        formato: formato,
        video: video
      });
    };
  };

  const cargaItemsLista =(res, conteoLikes, playerid, nombre, problema, fecha)=>{
    const players = playerid;
    const nameUsus = nombre;
    if (res.rows.length > 0) {
      const listax = Array.from({ length: res.rows.length }).map((_, i) => res.rows.item(i));
      console.log(listax);
      axios.post(RUTA_LISTA_CINCO, {
        data: listax,
        emailusu: user.email
      })
        .then(respt => {
          Notificarlikes(conteoLikes, problema, fecha, nameUsus, players);
        }).catch(function (error) {
        });
    };
  };

  const like = (idimg, mes, playerid, nombre, problema, fecha) => {

    let formData = new FormData();
    formData.append("idimgx", idimg);
    axios.post(RUTA_LISTA_CUATRO, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      transformRequest: formData => formData,
    }).then(res => {
      const conteoLikes = res.data;
      if (res.data !== 'err') {
        const sumaLike = listaIni.map(lista => {
          if (lista.idimg === idimg) {
            return {
              ...lista,
              megusta: res.data,
              like: true
            }
          } else {
            return lista
          };
        });
        setListaIni(sumaLike);
        db.transaction(txn => {
          txn.executeSql(
            `INSERT INTO likes (idimg, mes) VALUES (?,?)`,
            [idimg, mes],
            (sqlTxn, res) => {
              db.transaction(txn => {
                txn.executeSql(
                  `SELECT * FROM likes ORDER BY id ASC`,
                  [],
                  (sqlTxn, res) => {
                    cargaItemsLista(res, conteoLikes, playerid, nombre, problema, fecha);
                  },
                  error => {

                  },
                );
              });
            },
            error => {

            },
          );
        });

      } else {
      }
    }).catch(function (error) {
    });
  };

  const reportar = (emailusu, codigo) => {
    setModalVisible3(true);
    setReporte({
      codigo: codigo,
      emailusu: emailusu
    })
  };

  const eliminar = (id) => {
    setBorrar(id);
    setShowAlert(true);
  };

  const quitar = () => {
    axios.post(RUTA_LISTA_SEIS, {
      id: borrar,
      adm: '0'
    }).then(res => {
      setShowAlert(false);
      if (res.data === 0) {
        const listaMenos = listaIni.filter(listado => listado.idimg !== borrar)
        setListaIni(listaMenos);
        setToastServ('delete2');
        if (listaMenos.length === 0) {
          setTimeout(() => {
            navigation.navigate('Home');
          }, 4000);
        }
      } else if (res.data === 2) {
        setToastServ('NoDelete');
        const quitarIconBasura = listaIni.map(listado => {
          if (listado.idimg === borrar) {
            return {
              ...listado,
              conteolista: 2876
            }
          } else {
            return listado
          }

        })
        setListaIni(quitarIconBasura);

      } else if (res.data === 3) {
        setToastServ('NoDeletedos');
      }

    }).catch(function (error) {
      setToastServ('sinConexHome');
    });
  };

  const cancel = () => {
    setShowAlert(false);
  };

  const viewabilityConfig = {
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: 50
  };

  const compartir = (imagen, imagendos, imagentres, problem, fecha, zona, frase, formatos, videos) => {
    setToastServ('sharewait');
    shareData(imagen, imagendos, imagentres, problem, fecha, zona, frase, formatos, videos);
  };

  const handleViewableItemsChanged = useCallback((info) => {
    info.viewableItems.map((datos) => {
      const key = datos.key;
      const index = `key-${datos.index}`;

      if (index == key && datos.isViewable === true && datos.item.formato !== 'video') {
        const idimage = datos.item.idimg;
        let formData = new FormData();
        formData.append("idiwsx", idimage);
        axios.post(RUTA_LISTA_SIETE, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          transformRequest: formData => formData,
        }).then(res => {
        }).catch(err => {
        });
      }
    });
  }, []);

  const renderList = ({ item, index }) => {
    const ratio = win.width / item.ancho;
    const datos = listaLike.filter(dato => (dato.idimg === item.idimg));
    const idimg = datos.length > 0 ? datos[0].idimg : '';
    return (
      <View>
        <View style={{
          marginTop: 10
        }}>
          <FastImage
            source={{
              uri: RUTA_IMG_USER + item.imguser,
              priority: FastImage.priority.normal
            }}
            resizeMode={FastImage.resizeMode.stretch}
            contentContainerStyle={{ padding: 20 }}
            style={{
              width: 40,
              height: 40,
              marginTop: 10,
              marginLeft: 10,
              borderRadius: 25,
              borderColor: '#FCB213',
              borderWidth: 1
            }} />
          <Text style={{ position: 'absolute', top: '10%', fontSize: 13, color: '#fff', marginLeft: 57, }}>{item.nombre}</Text>
          <Text style={{ position: 'absolute', top: '60%', fontSize: 10, color: '#CDCDCD', marginLeft: 57, }}>{item.fecha} </Text>
          <Text style={{ position: 'absolute', top: '60%', right: '3%', fontSize: 11, color: '#FCB213' }}>{item.problem} </Text>
        </View>
        <ScrollImg
          item={item}
          verModalLista={verModalLista}
          ratio={ratio}
          winAncho={win.width}
        />
        <Text style={{ fontSize: 11, color: '#CDCDCD', marginLeft: 5, marginTop: 5, padding: 5 }}>{item.zona} </Text>
        {
          item.frase !== '' &&
          <Text style={{ fontSize: 13, color: '#fff', marginTop: 5, marginBottom: 10, padding: 15, textAlign: 'justify', }}>{item.frase} </Text>
        }
        <View style={{
          flexDirection: 'row',
          marginLeft: 10,
          marginTop: 10,
          marginBottom: 20
        }}>
          {item.like === true || idimg === item.idimg ?
            <Image source={require("../imgs/asbdos.png")} style={{
              marginLeft: 4,
              width: 27,
              height: 26,
              marginTop: 5
            }} />
            :
            <TouchableOpacity onPress={() => like(item.idimg, item.mes, item.playerid, item.nombre, item.problem, item.fecha)}>
              <Image source={require("../imgs/asbuno.png")} style={{
                marginLeft: 4,
                width: 27,
                height: 26,
                marginTop: 5
              }} />
            </TouchableOpacity>
          }
          <Text style={{ fontSize: 10, color: '#fff', marginLeft: 0, }}>{item.megusta} </Text>
          {item.formato === 'foto' ?
            <Text style={{ fontSize: 10, color: '#9B9B9B', marginLeft: 18, }}>Vistas:  <Text style={{ color: '#fff' }}>{item.vistas}</Text></Text>
            :
            <Text style={{ fontSize: 10, color: '#9B9B9B', marginLeft: 18, }}>Reprod:  <Text style={{ color: '#fff' }}>{item.vistas}</Text></Text>
          }
          {
            sancion.tiempoRestante !== '0' || sancion.veces < '3' &&
            <TouchableOpacity onPress={() => reportar(item.emailusu, item.codigo)} >
              <Text style={{
                top: -5, fontSize: 8, color: '#9B9B9B', marginLeft: 20, borderRadius: 5,
                borderColor: '#808080', borderWidth: 1, marginTop: 10
              }}>  Reportar </Text>
            </TouchableOpacity>
          }
          <TouchableOpacity onPress={() => compartir(item.imagen, item.imagendos, item.imagentres, item.problem, item.fecha, item.zona, item.frase, item.formato, item.video)}>
            <Iconsh style={{ marginLeft: 25, marginTop: -3 }} name='share-outline' color="#FCB213" size={37} />
          </TouchableOpacity>
          {item.emailusu === user.email && item.conteolista > 10078 ?
            <TouchableOpacity onPress={() => eliminar(item.idimg)}>
              <Icon style={{ marginLeft: 20 }} name='delete' color="#FF0000" size={28} />
            </TouchableOpacity>
            : ''
          }
        </View>
      </View>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      {lista.length !== 0 ?
        <FlashList refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            title="Refrescando Lista"
            tintColor="#fff"
            titleColor="#fff"
          />
        }
          data={listaIni}
          keyExtractor={(item, index) => `key-${item.idimg, index}`}
          renderItem={renderList}
          estimatedItemSize={270}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={handleViewableItemsChanged}
        />
        :
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <TouchableOpacity >
            <Iconc name='emoji-sad' color="#FCB213" size={60} style={{ textAlign: 'center' }} />
            <Text style={{ color: '#fff', fontSize: 13, textAlign: 'center', marginTop: 15 }}>No hay eventos para mostrar</Text>
          </TouchableOpacity>
        </View>
      }
      <View >
        <ModalImg
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          anchoPantalla={win.width}
          altoModal={altoModal}
          ratio2={ratio2}
          itemImg={itemImg}
        />
      </View>
      <View>
        <ModalVideo
          modalVisible2={modalVisible2}
          setModalVisible2={setModalVisible2}
          video={video}
          altoModal={altoModal}
          anchoPantalla={win.width}
          ratio2={ratio2}
          idItem={itemid}
        />
      </View>
      <View>
        <ModalReporte
          modalVisible3={modalVisible3}
          setModalVisible3={setModalVisible3}
          reporte={reporte}
        />
      </View>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Atención"
        message="¿Desea eliminar este evento?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Cancelar"
        confirmText=" Eliminar "
        confirmButtonColor="#064B00"
        cancelButtonColor="#FF0000"
        onCancelPressed={() => {
          cancel();
        }}
        onConfirmPressed={() => {
          quitar();
        }}
      />


      <ToastServicios dato={toastServ} />
    </SafeAreaView>
  )
}

export default Listados;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  buttonDos: {
    position: 'absolute',
    backgroundColor: '#000',
    bottom: 8,
    right: 20,
    height: 30,
    width: 50,
    borderRadius: 25,
    borderColor: '#fff',
    borderWidth: 2,
    alignItems: 'center',

  },
  filtro1: {
    backgroundColor: '#000000',
    height: 35,
    width: 50,
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 10,
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25,
  },
  filtro2: {
    backgroundColor: '#000000',
    height: 35,
    width: 50,
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 1,
    alignItems: 'center',
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,

  },
  filtro3: {
    backgroundColor: '#000000',
    height: 35,
    width: 50,
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 10,
  },
});
