import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Modal,
    TouchableOpacity,
    BackHandler,
    Alert
} from 'react-native';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import OneSignal from 'react-native-onesignal';
import config from '../config';
import { loadprimvez } from '../redux/slices/PrimeraVezApp';
import { Dialog } from '@rneui/themed';
import { requestNotifications, checkNotifications } from 'react-native-permissions';

const API_KEY = config.API_KEY;

function ModalPrivacidad({ modalVisiblePVez, setModalVisiblePVez }) {

    const [visible2, setVisible2] = useState(false);
    const dispatch = useDispatch();

    const salir = () => {
        BackHandler.exitApp();
    };

    const checkPermission = async () => {
            const result = await requestNotifications(['alert', 'badge', 'sound']);
            const { status: newStatus } = result;
            if (newStatus === 'granted') {
                console.log('Permiso Concedido', 'Tienes acceso a las notificaciones.');
                OneSignal.setAppId(API_KEY);
                dispatch(loadprimvez(1));
                    setVisible2(false);
                    setModalVisiblePVez(false);
            } else {
                Alert.alert('La App experimenta un error. Ajusta manualmente la notificaciones desde propiedades de la app.');
                setVisible2(false);
                BackHandler.exitApp();
            }
    };

    const salirdos = () => {
        setVisible2(false);
    }

    const enter = () => {
        setVisible2(true);
    };

    return (
        <View >
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisiblePVez}
            >
                 <>
                        <ScrollView style={{ backgroundColor: '#FFF8E9' }}>
                            <View style={styles.centeredView}>
                                <Text style={{
                                    marginTop: 40,
                                    fontSize: 20,
                                    color: '#000',
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    fontWeight: 'bold',
                                }}>Política de Privacidad</Text>
                                <Text style={{
                                    marginTop: 30,
                                    fontSize: 15,
                                    color: '#000',
                                    marginLeft: 15,
                                    marginRight: 17,
                                    textAlign: 'justify'
                                }}>

                                    Al aceptar esta política de privacidad, establece el uso de la aplicación “YoReporto”, creada para dispositivos móviles y válida para el territorio colombiano.{'\n\n'}
                                    <Text style={{ color: '#E69D00', fontSize: 15, fontWeight: 'bold' }}>¿Qué información obtiene YoReporto y como es utilizada?{'\n\n'}</Text>

                                    Antes de iniciar, YoReporto requiere el registro de su dispositivo para obtener el ID de notificaciones. Al momento de aceptar estas políticas su dispositivo quedará registrado y enlazado para recibir información de eventos de otros usuarios.{'\n\n'}
                                    Al hacer el registro de usuario, YoReporto recopila dos (2) datos básicos para su completo funcionamiento, que se obtiene desde una cuenta de Google (E-mail y nombre), este último lo podrá cambiar una vez se haya completado el registro.
                                    {'\n\n'}
                                    YoReporto es netamente informativa y NO se hará uso de esta información para enviar E-mails o publicidad, solo se usará dentro de esta aplicación.{'\n\n'}
                                    De igual forma el usuario podrá eliminar el registro en YoReporto y base de datos en el momento que desee.{'\n\n'}

                                    <Text style={{ color: '#E69D00', fontSize: 15, fontWeight: 'bold' }}>Seguridad y Retención en los datos de YoReporto{'\n\n'}</Text>

                                    El tráfico de datos en YoReporto está encriptado. NO requerimos contraseñas ni solicitamos datos personales (cédula, nit o datos bancarios).{'\n\n'}

                                    Los eventos cargados por los usuarios pasarán a ser propiedad de YoReporto, que podrá hacer uso sin restricción teniendo en cuenta que al aceptar estas políticas adquirimos derechos de uso de cada evento cargado.{'\n\n'}

                                    <Text style={{ color: '#E69D00', fontSize: 15, fontWeight: 'bold' }}>¿La app obtiene la información precisa y en tiempo real del dispositivo?{'\n\n'}</Text>

                                    La geolocalización del usuario se usará en el mapa solo para su dispositivo y será usada únicamente para cargar el evento que esté sucediendo en su ubicación en tiempo real.{'\n\n'}
                                    YoReporto tiene acceso a la cámara para cargar fotos o videos y lanzar los respectivos eventos que verán otros usuarios en tiempo real.{'\n\n'}
                                    YoReporto obtiene acceso a imágenes en la galería para cargar la foto de usuario únicamente.{'\n\n'}

                                    <Text style={{ color: '#E69D00', fontSize: 15, fontWeight: 'bold' }}>¿Pueden terceros obtener acceso a la información obtenida por la app?{'\n\n'}</Text>

                                    YoReporto compartirá información en los siguientes casos:{'\n\n'}

                                    1- El usuario es responsable de cualquier contenido que comparta fuera de YoReporto o en redes sociales. Al compartir los eventos, NO contendrán el nombre ni el E-mail, ni la ubicación del usuario que cargó dicho evento.{'\n\n'}
                                    2- Cuando sea requerido con una orden judicial.{'\n\n'}

                                    <Text style={{ color: '#E69D00', fontSize: 15, fontWeight: 'bold' }}>Información de menores{'\n\n'}</Text>

                                    YoReporto está dirigida para mayores de 18 años de edad.{'\n\n'}

                                    <Text style={{ color: '#E69D00', fontSize: 15, fontWeight: 'bold' }}>Contacto o sugerencias{'\n\n'}</Text>

                                    Si desea hacernos llegar un comementario o sugerencia, escríbenos al siguiente E-mail: <Text style={{ color: '#000', fontSize: 15, fontWeight: 'bold' }}>traficovialapp@gmail.com</Text>{'\n\n'}

                                    <Text style={{ color: '#E69D00', fontSize: 15, fontWeight: 'bold' }}>Cambios en esta políticas{'\n\n'}</Text>

                                    Este documento está sujeto a cambios según la normativas y cambios en la app que se vayan agregando. Recomendamos ver periodicamente desde la seccion de configuración esta política para estar actualizado.{'\n\n'}

                                </Text>
                                <View style={{
                                    marginTop: -20,
                                    padding: 30,
                                    bottom: 20,
                                    marginBottom: 30
                                }}>
                                    <TouchableOpacity onPress={() => enter()} style={styles.aceptopoliticas}>
                                        <Text style={{ top: 10, fontWeight: 'bold', color: '#fff', fontSize: 11, textAlign: 'center' }} >   ACEPTO LAS POLITICAS DE PRIVACIDAD   </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                        <View style={{ backgroundColor: '#000', height: 60 }}>
                            <TouchableOpacity
                                style={styles.buttonDos}
                                onPress={() => salir()}
                            >
                                <Text style={{
                                    color: '#fff',
                                    top: 5,

                                }}> Salir </Text>
                            </TouchableOpacity>
                        </View>
                    </>
            </Modal>
            <View >
                <Dialog
                    isVisible={visible2}
                    animationType="fade"
                >
                    <Dialog.Title title="Permiso de Notificaciones" />
                    <Text style={{ color: '#000000', textAlign: 'justify' }}>¿Acepta que YoReporto habilite las notificaciones?</Text>
                    <Dialog.Actions>
                        <Dialog.Button  title="ACEPTAR" onPress={() => checkPermission()} />
                        <Dialog.Button  title="DESPUES" onPress={() => salirdos()} />
                    </Dialog.Actions>
                </Dialog>
            </View>
        </View>
    )
};

ModalPrivacidad.propTypes = {
    modalVisiblePVez: PropTypes.bool.isRequired,
    setModalVisiblePVez: PropTypes.func.isRequired,
  };

export default ModalPrivacidad;

const styles = StyleSheet.create({

    centeredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: '#FFF8E9',
    },
    buttonDos: {
        position: 'absolute',
        backgroundColor: '#000',
        bottom: 8,
        right: 20,
        height: 40,
        width: 80,
        borderRadius: 10,
        borderColor: '#FCB213',
        borderWidth: 2,
        alignItems: 'center',
    },
    bold: {
        fontWeight: 'bold',
    },
    aceptopoliticas: {
        backgroundColor: '#064B00',
        height: 45,
        color: '#964B00',
        borderWidth: 3,
        borderRadius: 10,
        borderColor: '#000',
    },
});
