import React from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Iconx from 'react-native-vector-icons/MaterialIcons';
import config from '../config';

var RUTA_IMG_IMGS = config.RUTA_IMG_IMGS;

function ScrollImg({ item, verModalLista, ratio, winAncho }) {
    return (

        <ScrollView
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={true}
            pinchGestureEnabled={true}
            style={{
                marginTop: 10,
            }}>
            <TouchableOpacity
                onPress={() => verModalLista(item.imagen, item.idimg, item.ancho, item.alto, item.formato, item.video)}>
                <FastImage
                    style={{
                        backgroundColor: '#F7F7F7',
                        width: winAncho,
                        height: item.alto * ratio,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}
                    source={{
                        uri: RUTA_IMG_IMGS + item.imagen,
                        priority: FastImage.priority.normal
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
                {item.formato === 'video' ?
                    <Iconx style={{ position: 'absolute', justifyContent: 'center', alignSelf: 'center', color: 'white', top: '50%' }} name='play-circle-filled' color="white" size={60} />
                    : ''
                }
                {item.imagendos !== '' && item.imagentres !== '' ?
                    <Text style={{ position: 'absolute', fontSize: 11, color: 'white', marginTop: 10, marginLeft: 10, backgroundColor: 'black', borderRadius: 10, borderColor: 'gray', borderWidth: 2, }}>  1 / 3 </Text>
                    : item.imagendos !== '' ?
                        <Text style={{ position: 'absolute', fontSize: 11, color: 'white', marginTop: 10, marginLeft: 10, backgroundColor: 'black', borderRadius: 10, borderColor: 'gray', borderWidth: 2, }}>  1 / 2 </Text>
                        :
                        ''
                }
            </TouchableOpacity>
            {
                item.imagendos !== '' ?
                    <TouchableOpacity
                        onPress={() => verModalLista(item.imagendos, item.idimg, item.ancho, item.alto, item.formato, item.video)}
                    >
                        <FastImage
                            style={{
                                backgroundColor: '#F7F7F7',
                                width: winAncho,
                                height: item.alto * ratio,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}
                            source={{
                                uri: RUTA_IMG_IMGS + item.imagendos,
                                priority: FastImage.priority.normal
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        {item.imagentres !== '' ?
                            <Text style={{ position: 'absolute', fontSize: 11, color: 'white', marginTop: 10, marginLeft: 10, backgroundColor: 'black', borderRadius: 10, borderColor: 'gray', borderWidth: 2, }}>  2 / 3 </Text>
                            :
                            <Text style={{ position: 'absolute', fontSize: 11, color: 'white', marginTop: 10, marginLeft: 10, backgroundColor: 'black', borderRadius: 10, borderColor: 'gray', borderWidth: 2, }}>  2 / 2 </Text>
                        }
                    </TouchableOpacity>
                    : ''
            }
            {
                item.imagentres !== '' ?
                    <TouchableOpacity
                        onPress={() => verModalLista(item.imagentres, item.idimg, item.ancho, item.alto, item.formato, item.video)}
                    >
                        <FastImage
                            style={{
                                backgroundColor: '#F7F7F7',
                                width: winAncho,
                                height: item.alto * ratio,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}
                            source={{
                                uri: RUTA_IMG_IMGS + item.imagentres,
                                priority: FastImage.priority.normal
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text style={{ position: 'absolute', fontSize: 11, color: 'white', marginTop: 10, marginLeft: 10, backgroundColor: 'black', borderRadius: 10, borderColor: 'gray', borderWidth: 2, }}>  3 / 3 </Text>
                    </TouchableOpacity>
                    : ''
            }
        </ScrollView>
    )
}

export default ScrollImg;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#260042',
    },
});