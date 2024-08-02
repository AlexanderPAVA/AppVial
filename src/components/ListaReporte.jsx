import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import ToastServicios from './ToastServicios';
import axios from 'axios';
import { FlashList } from '@shopify/flash-list';
import Icon from 'react-native-vector-icons/Entypo';
import config from '../config';

const RUTA_HOME_DOS = config.RUTA_HOME_DOS;
const LISTA_REPORTE = config.LISTA_REPORTE;

function ListaReporte({ route, navigation }) {

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const { data } = route.params;
  const [ToastServ, setToastServ] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const titulo = () => {
    return (
      <>
        <Text style={{
          fontSize: 1,
          color: '#260042',
        }}></Text>
      </>
    )
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    axios.get(LISTA_REPORTE)
      .then(function (listas) {
        setlista(listas.data);
        wait(300).then(() => setRefreshing(false));
      })
      .catch(function (error) {
      });

  }, []);

  const [lista, setlista] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#000' },
      headerTitle: titulo,
      headerShown: true,
      headerTintColor: '#fff',
      headerRight: () => (
        <Text Text style={{
          color: '#FBA000',
          fontSize: 16,
          fontWeight: 'bold',
        }}>Lista Reporte</Text >
      )
    });

    axios.get(LISTA_REPORTE)
      .then(function (listas) {
        setlista(listas.data);
      })
      .catch(function (error) {
        setToastServ('sinConexHome');
      });

    setTimeout(() => {
      if (lista.length === '0') {
        navigation.navigate('Home');
      }
    }, 3000);

  }, [data]);

  const verItem = (codigo, emailusu) => {
    axios.post(RUTA_HOME_DOS, {
      codigo: codigo,
      emailusu: emailusu
    }).then(resp => {
      if (resp.data !== 0) {
        const datos = resp.data;
        const item = datos[0];// quita[] al array
        navigation.navigate('Individual', {
          datoItem: item
        });
      } else {
        setToastServ('itemBorrado');
        const listaMenos = lista.filter(listado => listado.codigo !== codigo);
        setlista(listaMenos);
      };

    }).catch(function (error) {
    });
  };

  const salir = () => {
    navigation.navigate('Home');
  };

  const renderList = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => verItem(item.codigo, item.emailusu)}>
        <View style={{ padding: 15, marginLeft: 5, }}>
          <Text style={{ color: 'white', fontSize: 20 }}> -   {item.codigo}   <Text style={{color: 'red'}}>( {item.veces} )</Text>  </Text>
        </View>
      </TouchableOpacity>
    )
  };
  return (
    <SafeAreaView style={styles.container}>
      {
        lista === '' ?
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ActivityIndicator size="large" color="#FCB213" />
            <Text style={{
              color: '#C1C1C1',
              fontSize: 16,
            }} >
              Espere...
            </Text>
          </View>
          : lista.length !== 0 ?
            <FlashList refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                title="Refrescando Lista"
                tintColor="#fff"
                titleColor="#fff"
              />
            }
              data={lista}
              keyExtractor={(item, index) => `key-${item.id, index}`}
              renderItem={renderList}
              estimatedItemSize={50}
            />
            :
            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TouchableOpacity onPress={() => salir()}>
                <Icon name='emoji-sad' color="#FCB213" size={60} style={{ textAlign: 'center' }} />
                <Text style={{ color: 'white', fontSize: 13, textAlign: 'center', marginTop: 15 }}>No hay reportes para mostrar</Text>
              </TouchableOpacity>
            </View>
      }
      <ToastServicios dato={ToastServ} />
    </SafeAreaView>
  )
}

export default ListaReporte;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});