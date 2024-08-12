import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import Iconsh from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { openDatabase } from "react-native-sqlite-storage";
const db = openDatabase({ name: "appLikes" });
import ModalImg from '../components/ModalImg';
import ModalVideo from '../components/ModalVideo';
import { shareData } from '../components/shareData';
import ModalReporte from '../components/ModalReporte';
import ToastServicios from '../components/ToastServicios';
import config from '../config';
import ModalSancion from '../components/ModalSancion';
import { Notificarlikes } from '../components/Notificarlikes';
import ScrollImg from '../components/ScrollImg';
import AwesomeAlert from 'react-native-awesome-alerts';


const RUTA_IMG_USER = config.RUTA_IMG_USER;
const RUTA_INDIV_UNO = config.RUTA_INDIV_UNO;
const RUTA_INDIV_TRES = config.RUTA_INDIV_TRES;
const RUTA_INDIV_CUATRO = config.RUTA_INDIV_CUATRO;
const RUTA_INDIV_CINCO = config.RUTA_INDIV_CINCO;
const NO_DELETE_ITEM = config.NO_DELETE_ITEM;

const win = Dimensions.get('window');

function Individual({ route, navigation }) {
  
  const { datoItem, noti } = route.params;
  const { user } = useSelector(state => state.user);
  const { sancion } = useSelector(state => state.sancion);
  const { rango } = sancion;

  const [item, setItem] = useState(datoItem);
  const [likes, setLikes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);

  const [modalInfo, setModalInfo] = useState({
    itemImg: '',
    itemid: '',
    altoModal: '',
    ratio2: '',
    formato: '',
    video: ''
  });
  const [reporte, setReporte] = useState('');
  const [borrar, setBorrar] = useState('');
  const [toastServ, setToastServ] = useState('');
  const [playId, setPlayId] = useState('');
  const [titulos, setTitulos] = useState('¿Desea eliminar este evento?');
  const { itemImg, itemid, altoModal, ratio2, video } = modalInfo;

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

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#000000' },
      headerTitle: titulo,
      headerShown: true,
      headerTintColor: '#fff',
      headerRight: () => (
        <Text style={{
          color: '#FCB213',
          fontSize: 16,
          fontWeight: 'bold',
        }}>{item.problem}</Text>
      )
    });
    db.transaction(txn => {
      txn.executeSql(
        `SELECT * FROM likes ORDER BY id ASC`,
        [],
        (sqlTxn, res) => {
            if (res.rows.length > 0) {
              const listaz = Array.from({ length: res.rows.length }).map((_, i) => res.rows.item(i));
              console.log(listaz);
            const datos = listaz.filter(dato => (dato.idimg === item.idimg));
            const idimg = datos.length > 0 ? datos[0].idimg : '';
            setLikes(idimg);
          };
        })
    });

    if (rango === 'adm') {
    } else {

      if (item.formato === 'foto') {
        let formData = new FormData();
        formData.append("idiwsx", item.idimg);
        axios.post(RUTA_INDIV_UNO, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          transformRequest: formData => formData,
        }).then(res => {
        }).catch(err => {
        });
      }
    };

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

  const cargaItems =(res, conteoLikes, playerid, nombre, problema, fecha)=>{
    const player = playerid;
    const nameUsu = nombre;
    if (res.rows.length > 0) {
      const listax = Array.from({ length: res.rows.length }).map((_, i) => res.rows.item(i));
      console.log(listax);
      axios.post(RUTA_INDIV_CUATRO, {
        data: listax,
        emailusu: user.email
      })
        .then(resp => {
          Notificarlikes(conteoLikes, problema, fecha, nameUsu, player);
        });
    };
  }

  const like = (idimg, mes, playerid, nombre, problema, fecha) => {
    
    let formData = new FormData();
    formData.append("idimgx", idimg);
    axios.post(RUTA_INDIV_TRES, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      transformRequest: formData => formData,
    }).then(res => {
      const conteoLikes = res.data;
      if (res.data !== 'err') {
        setItem({
          ...item,
          megusta: res.data,
          like: true
        });
        
        db.transaction(txn => {
          txn.executeSql(
            `INSERT INTO likes (idimg, mes)  VALUES (?,?)`,
            [idimg, mes],
            (sqlTxn, res) => {
              db.transaction(txn => {
                txn.executeSql(
                  `SELECT * FROM likes ORDER BY id ASC`,
                  [],
                  (sqlTxn, res) => {
                    cargaItems(res, conteoLikes, playerid, nombre, problema, fecha);
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
      };
    });
  };

  const reportar = (emailusu, codigo) => {
    setModalVisible3(true);
    setReporte({
      codigo: codigo,
      emailusu: emailusu
    })
  };

  const eliminar = (id, player) => {
    setBorrar(id);
    setPlayId(player);
   setShowAlert(true);
  };

  const quitar = () => {
    if (rango === 'adm') {
      setModalVisible4(true);
      setShowAlert(false);
    } else {
      axios.post(RUTA_INDIV_CINCO, {
        id: borrar,
        adm: 0,
        suma: 0
      }).then(res => {
        if (res.data === 0) {
          setToastServ('delete');
          setTimeout(() => {
            navigation.navigate('Home');
          }, 3000);
        } else if (res.data === 1) {
          setToastServ('delete');
          setTimeout(() => {
            navigation.navigate('Home');
          }, 3000);
        } else if (res.data === 2) {
          setToastServ('NoDelete');
        } else if (res.data === 3) {
          setToastServ('NoDeletedos');
        }
        setShowAlert(false);
      }).catch(function (error) {
        setToastServ('sinConexHome');
      });
    }
  };

  const cancel = () => {
    if (rango === 'adm') {
      setTitulos('Espere...')
      axios.post(NO_DELETE_ITEM, {
        id: borrar,
        adm: rango,
      }).then(res => {
       setShowAlert(false);
        setTitulos('¿Desea eliminar este evento?')
        navigation.navigate('ListaReporte', {
          data: borrar
        });
      }).catch(function (error) {
        setToastServ('sinConexHome');
      });
    } else {
     setShowAlert(false);
    }
  };

  const compartir = (imagen, imagendos, imagentres, problem, fecha, zona, frase, formatos, videos) => {
    setToastServ('sharewait');
    shareData(imagen, imagendos, imagentres, problem, fecha, zona, frase, formatos, videos);
  };

  const ratio = win.width / item.ancho;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
                marginLeft: 5,
                borderRadius: 25,
                borderColor: '#FCB213',
                borderWidth: 1
              }} />
            <Text style={{ position: 'absolute', top: '10%', fontSize: 13, color: '#fff', marginLeft: 57, }}>{item.nombre} </Text>
            <Text style={{ position: 'absolute', top: '60%', fontSize: 10, color: '#CDCDCD', marginLeft: 57, }}>{item.fecha} </Text>
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
            {item.like === true || item.idimg === likes ?
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

            {rango === 'adm' ?
              <TouchableOpacity onPress={() => eliminar(item.idimg, item.playerid)}>
                <Icon style={{ marginLeft: 20 }} name='delete' color="#FBA000" size={28} />
              </TouchableOpacity>
              : item.emailusu === user.email && item.conteolista > 10078 ?
                <TouchableOpacity onPress={() => eliminar(item.idimg, item.playerid)}>
                  <Icon style={{ marginLeft: 20 }} name='delete' color="#FF0000" size={28} />
                </TouchableOpacity>
                : ''
            }

          </View>
          
        </View>
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
        <View>
          <ModalSancion
            modalVisible4={modalVisible4}
            setModalVisible4={setModalVisible4}
            borrar={borrar}
            playId={playId}
            navigation={navigation}
          />
        </View>
      </ScrollView>

      <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Atención"
          message={titulos}
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
};

export default Individual;

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

});
