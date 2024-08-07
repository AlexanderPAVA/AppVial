import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableOpacity
} from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { TextInput } from 'react-native-paper';
import { registro } from '../redux/slices/login';
import ToastServicios from './ToastServicios';
import config from '../config';

const CAMBIO_NOMBRE = config.CAMBIO_NOMBRE;

function ModalNombre({ modalVisibles, setModalVisibles }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const [nombre, onChangeNombre] = useState('');
    const [ToastServ, setToastServ] = useState('');
    const [wait, setwait] = useState(0);
    const [Toastx, setToastx] = useState(false);

    const cambiar = () => {
        if (nombre !== '') {
            setwait(1);
            axios.post(CAMBIO_NOMBRE, {
                email: user.email,
                name: nombre
            }).then(res => {
                if (res.data === 2) {
                    dispatch(registro({
                        nombre: nombre,
                        email: user.email,
                        foto: user.foto,
                        idsignal: user.idPlay
                    }));

                    if (Toastx === false) {
                        setToastx(true)
                        setToastServ('cambioNombre');
                        setTimeout(() => {
                              setwait(0);
                            setModalVisibles(false);
                            onChangeNombre('')
                        }, 2000);
                    } else {
                        setToastx(false)
                        setToastServ('cambioNombre2');
                        setTimeout(() => {
                              setwait(0);
                            setModalVisibles(false);
                            onChangeNombre('')
                        }, 2000);
                    }
                } else {
                    setModalVisibles(false);
                    onChangeNombre('')
                }

            }).catch(function (error) {
                setToastServ('sinConexHome');
            });

        } else {
            setToastServ('namevacio');
        }
    };

    const salir = () => {
        setModalVisibles(false);
        onChangeNombre('')
    };
    return (
        <View >
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibles}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
{ wait === 0 ?
    <Text style={styles.label}>Cambiar Nombre</Text>
    :
    <Text style={styles.label3}>Espere...</Text>
}
                        <Text style={styles.label2}>Ingrese un nombre o alias</Text>
                        <TextInput
                            style={styles.input}
                            theme={{ colors: { onSurfaceVariant: '#A3A3A3' }, }}
                            multiline={true}
                            numberOfLines={1}
                            onChangeText={onChangeNombre}
                            value={nombre}
                            placeholder="25 caracteres max."
                            textColor="#000000"
                            maxLength={25}
                            borderColor='#FCB213'
                            borderWidth={2}
                        />
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}>
                            <TouchableOpacity onPress={() => salir()} style={styles.closeModalButton3}>
                                <Text style={{  marginTop: 5, fontWeight: 'bold', color: '#FF0000' }}>   Salir    </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => cambiar()} style={styles.closeModalButton2}>
                                <Text style={{  marginTop: 5, fontWeight: 'bold', color: '#064B00' }}>  Cambiar  </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
                <ToastServicios dato={ToastServ} />
            </Modal>

        </View>
    )
}

export default ModalNombre;

const styles = StyleSheet.create({

    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '75%', // Ocupa el 80% del ancho de la pantalla
        borderRadius: 10,
        padding: 30,
        alignItems: 'center',
        elevation: 5,
        borderColor: '#FCB213',
        borderWidth: 3,
    },
    closeModalButton2: {
        fontSize: 15,
        height: 40,
        marginTop: 20,
        textAlign: 'center',
        color: '#064B00',
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
        color: '#964B00',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    label2: {
        margin: 0,
        fontSize: 11,
        color: '#000000',
        textAlign: 'center',
    },
    label3: {
        margin: 8,
        fontSize: 20,
        color: '#FCB213',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        marginTop: 10,
        width: '100%',
        marginBottom: 10,
        borderColor: '#fff',
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 5,
    },

});
