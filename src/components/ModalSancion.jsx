import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableOpacity
} from 'react-native';
import axios from 'axios';
import config from '../config';
import ToastServicios from './ToastServicios';

const API_KEY = config.API_KEY;
const AUTHO_TOKEN = config.AUTHO_TOKEN;
const RUTA_INDIV_CINCO = config.RUTA_INDIV_CINCO;
const RUTA_NOTIS = config.RUTA_NOTIS;

function ModalSancion({ modalVisible4, setModalVisible4, borrar, playId, navigation }) {
    const [ToastServ, setToastServ] = useState('');
    const quitar = (sumar) => {
        axios.post(RUTA_INDIV_CINCO, {
            id: borrar,
            adm: 'adm',
            suma: sumar
        }).then(res => {
            if (res.data === 0) {
                setToastServ('delete');
                setTimeout(() => {
                    navigation.navigate('ListaReporte', {
                        data: borrar
                    });
                }, 3000);
            } else if (res.data === 1) {
                setToastServ('delete');
                let headers = {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: AUTHO_TOKEN,
                };
                let url = RUTA_NOTIS;
                let params = {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        app_id: API_KEY,
                        headings: { "en": "IMPORTANTE!!" },
                        contents: { "en": "Has sido sancionado por incumplir las politicas de YoRepoto, recuerda que a la tercera (3) sanción tu correo será bloqueado para enviar eventos. Revisa en configuración." },
                        android_accent_color: "FFE700",
                        include_player_ids: [playId],
                        //url: 'https://something.any', // optional
                    }),
                };
                fetch(url, params).then(res);

                setTimeout(() => {
                    navigation.navigate('ListaReporte', {
                        data: borrar
                    });
                }, 3000);
            } else if (res.data === 2) {
                setToastServ('NoDelete');
                setTimeout(() => {
                    setModalVisible4(false);
                }, 4000);
            } else if (res.data === 3) {
                setToastServ('NoDeletedos');
                setTimeout(() => {
                    setModalVisible4(false);
                }, 5000);
            }
            this.AlertPro.close();
        }).catch(function (error) {
            setToastServ('sinConexHome');
        });
    };

    const salir = () => {
        setModalVisible4(false);
    };
    return (
        <View >
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible4}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.label}>Sancionar?</Text>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}>
                            <TouchableOpacity onPress={() => quitar(0)} style={styles.closeModalButton3}>
                                <Text style={{ color: 'black', marginTop: 5, fontWeight: 'bold', color: 'red' }}>    NO    </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => quitar(1)} style={styles.closeModalButton2}>
                                <Text style={{ color: 'black', marginTop: 5, fontWeight: 'bold', color: 'green' }}>     SI     </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => salir()} style={styles.closeModalButton}>
                            <Text style={{ color: 'black', marginTop: 5, fontWeight: 'bold', color: 'black' }} >     SALIR     </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ToastServicios dato={ToastServ} />
            </Modal>
        </View>
    )
}

export default ModalSancion;

const styles = StyleSheet.create({

    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        width: '70%', // Ocupa el 80% del ancho de la pantalla
        borderRadius: 10,
        padding: 30,
        alignItems: 'center',
        elevation: 5,
        borderColor: '#FCB213',
        borderWidth: 3,
    },
    closeModalButton: {
        fontSize: 15,
        height: 40,
        marginTop: 30,
        textAlign: 'center',
        color: 'black',
        borderWidth: 2,
        borderRadius: 10,
        marginRight: 0
    },
    closeModalButton2: {
        fontSize: 15,
        height: 40,
        marginTop: 20,
        textAlign: 'center',
        color: 'green',
        borderWidth: 2,
        borderRadius: 10,
        marginLeft: 20
    },
    closeModalButton3: {
        fontSize: 15,
        height: 40,
        marginTop: 20,
        textAlign: 'center',
        borderWidth: 2,
        borderRadius: 10,
        marginRight: 20
    },

    label: {
        margin: 8,
        fontSize: 17,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',

    },

});