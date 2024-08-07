import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableOpacity
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useSelector } from 'react-redux';
import ToastServicios from './ToastServicios';
import axios from 'axios';
import config from '../config';

const API_KEY = config.API_KEY;
const AUTHO_TOKEN = config.AUTHO_TOKEN;
const MODAL_REPORTEUNO = config.MODAL_REPORTEUNO;
const MODAL_REPORTEDOS = config.MODAL_REPORTEDOS;
const RUTA_NOTIS = config.RUTA_NOTIS;

function ModalReporte({ modalVisible3, setModalVisible3, reporte }) {

    const { user } = useSelector(state => state.user);
    const { codigo, emailusu } = reporte;
    const [checked, setChecked] = useState(false);
    const [ToastServ, setToastServ] = useState('');
    const [msj, setMsj] = useState('');

    const enviar = () => {
        axios.post(MODAL_REPORTEUNO, {
            codigo: codigo,
            emailusu: emailusu
        }).then(resp => {
            if (resp.data === 1) {
                axios.get(MODAL_REPORTEDOS)
                    .then(function (resp) {
                        const datos = resp.data;

                        for (let i = 0; i < datos.length; i++) {
                            const component = datos[i];

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
                                    headings: { "en": 'Reporte de Evento' },
                                    contents: { "en": component.nombre + ', verifica la publicación, para ver si cumple las condiciones.' },
                                    android_accent_color: "FFE700",
                                    include_player_ids: [component.idsignal],
                                    data: {
                                        codigoId: codigo,
                                        emailUsu: emailusu
                                    }
                                }),
                            };
                            fetch(url, params);
                            setChecked(!checked);
                            setMsj('Reporte enviado');
                            setTimeout(() => {
                                setModalVisible3(false);
                                setMsj('');
                            }, 2000);
                        };

                    })
                    .catch(function (error) {
                    });
            } else if (resp.data === 2) {
                setChecked(!checked);
                setMsj('Reporte enviado');
                setTimeout(() => {
                    setModalVisible3(false);
                    setMsj('');
                }, 2000);
            } else {
                enviar();
            }
        }).catch(function (error) {
            setToastServ('sinConexHome');
        });

    };

    const noenviar = () => {
        setToastServ('sinReporte');
    };

    const salir = () => {
        setChecked(false);
        setModalVisible3(false)
    };

    return (
        <View >
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible3}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        {msj === '' ?
                            <>
                                <Text style={styles.label}>Evento no cumple con la Politicas de uso</Text>
                                <Checkbox
                                    status={checked ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setChecked(!checked);
                                    }}
                                />
                                <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                }}>
                                    <TouchableOpacity onPress={() => salir()}>
                                        <Text style={styles.closeModalButton}>   Salir   </Text>
                                    </TouchableOpacity>

                                    {!checked ?
                                        <TouchableOpacity onPress={() => noenviar()}>
                                            <Text style={styles.closeModalButton3}>   Enviar   </Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => enviar()}>
                                            <Text style={styles.closeModalButton2}>   Enviar   </Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </>
                            :
                            <Text style={styles.label2}>{msj}</Text>
                        }
                    </View>
                </View>
                <ToastServicios dato={ToastServ} />
            </Modal>
        </View>
    )
}

export default ModalReporte;

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
        marginTop: 30,
        textAlign: 'center',
        color: '#964B00',
        fontWeight: 'bold',
        borderWidth: 2,
        borderRadius: 10,
        marginRight: 10
    },
    closeModalButton2: {
        fontSize: 15,
        marginTop: 30,
        textAlign: 'center',
        color: '#064B00',
        fontWeight: 'bold',
        borderWidth: 2,
        borderRadius: 10,
        marginLeft: 10
    },
    closeModalButton3: {
        fontSize: 15,
        marginTop: 30,
        textAlign: 'center',
        color: '#964B00',
        fontWeight: 'bold',
        borderWidth: 2,
        borderRadius: 10,
        marginLeft: 10
    },
    label: {
        margin: 8,
        color: '#808080',
        textAlign: 'center'
    },
    label2: {
        margin: 8,
        fontSize: 15,
        color: '#000000',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
