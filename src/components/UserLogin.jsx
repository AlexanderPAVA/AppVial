import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import { Button } from 'react-native-paper';

function UserLogin({ idPlay, logIn, espere }) {
    return (
        <View style={styles.vista}>
            <Image source={require("../imgs/google.png")} style={styles.image} />
            <Text style={styles.textregistro}>
                Registra tu correo y nombre con Google. Antes de iniciar mira nuestra política de privacidad y condiciones de uso.
            </Text>
            {idPlay !== '' ?
                espere === '' ?
                    <Button mode="contained" onPress={() => logIn()}
                        style={styles.button}>
                        Registrar Usuario
                    </Button>
                    :
                    <Text style={styles.ajustando}>Cargando Usuario {'\n'} espere...</Text>
                :
                <Text style={styles.ajustando}>Ajustando configuración {'\n'} espere...</Text>
            }
        </View>
    )
}

export default UserLogin;
const styles = StyleSheet.create({
    vista: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        marginTop: 90,
        marginBottom: 70
    },
    image: {
        justifyContent: "center",
        alignSelf: 'center',
        width: 230,
        height: 80,
        bottom: 80
    },
    textregistro: {
        color: '#fff',
        bottom: 30,
        justifyContent: "center",
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 14,
        width: 300
    },
    button: {
        backgroundColor: '#064B00',
        marginTop: 40,
        marginHorizontal: 0,
        borderRadius: 20,
        borderColor: '#FCB213',
        borderWidth: 3,
        marginBottom: 50
    },
    ajustando: {
        color: '#FCB213',
        marginTop: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});
