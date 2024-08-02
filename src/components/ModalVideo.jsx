import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Modal,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import Iconm from 'react-native-vector-icons/AntDesign';
import RNFS from 'react-native-fs';
import config from '../config';
import axios from 'axios';
const RUTA_IMG_IMGS = config.RUTA_IMG_IMGS;
const RUTA_LISTA_SIETE = config.RUTA_LISTA_SIETE;

function ModalVideo({ modalVisible2, setModalVisible2, video, altoModal, anchoPantalla, ratio2, idItem }) {

    const [videoPath, setVideoPath] = useState(null);
    const [isBuffering, setIsBuffering] = useState(false);
    const [paused, setPaused] = useState(false);
    const [loading, setLoading] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [tamano, setTamano] = useState(0);
    const videoRef = useRef(null);

    useEffect(() => {
        setLoading(0);
        downloadVideo();
        setCurrentTime(0);
        const idimage = idItem;
        let formData = new FormData();
        formData.append("idiwsx", idimage);
        axios.post(RUTA_LISTA_SIETE, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            transformRequest: formData => formData,
        }).then(res => {
            setTamano(res.data);
        }).catch(err => {
        });
    }, [video])

    const downloadVideo = async () => {
        try {
            const downloadDest = `${RNFS.CachesDirectoryPath}/${video}`;
            const fileExists = await RNFS.exists(downloadDest);
            if (fileExists) {
                setCurrentTime(0);
                setVideoPath(`file://${downloadDest}`);
                setLoading(1);
            } else {
                setTimeout(async () => {
                    const videoUrl = RUTA_IMG_IMGS + video;
                    setVideoPath(videoUrl);
                    const options = {
                        fromUrl: videoUrl,
                        toFile: downloadDest,
                    };
                    const response = await RNFS.downloadFile(options).promise;
                    if (response.statusCode === 200) {
                        const fileStats = await RNFS.stat(downloadDest);
                        if (fileStats.size === tamano) {
                            setLoading(1);
                            setCurrentTime(0);
                            downloadVideo();
                        } else {
                            await RNFS.unlink(downloadDest);
                            setTimeout(async () => {
                                setLoading(0);
                                const options = {
                                    fromUrl: videoUrl,
                                    toFile: downloadDest,
                                };
                                const response = await RNFS.downloadFile(options).promise;
                                if (response.statusCode === 200) {
                                    if (currentTime === 0) {
                                        setLoading(1);
                                        setCurrentTime(0);
                                        downloadVideo();
                                    } else {
                                        setLoading(1);
                                    }
                                } else {
                                }
                            }, 1000);
                        }
                    } else {
                    }
                }, 1000);
            }
        } catch (error) {
        }
    };

    const reload = () => {
        setVideoPath(null);
        setLoading(0);
        setTimeout(() => {
            downloadVideo();
            setPaused(false);
        }, 150);
    };

    const handleVideoError = (error) => {
        RNFS.unlink(videoPath)
            .then(() => {
                downloadVideo();
            })
            .catch((err) => {
            });
    };

    const onBuffer = ({ isBuffering }) => {
        setIsBuffering(isBuffering);
    };

    const onLoadStart = () => {
        setIsBuffering(true);
    };

    const onLoad = (data) => {
        setIsBuffering(false);
        setDuration(data.duration);
    };

    const onProgress = (data) => {
        setCurrentTime(data.currentTime);
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return [h, m, s]
            .map((v) => (v < 10 ? '0' + v : v))
            .filter((v, i) => v !== '00' || i > 0)
            .join(':');
    };

    const onSeek = (time) => {
        setCurrentTime(time);
        videoRef.current.seek(time);
    };

    const onEnd = () => {
        setCurrentTime(0);
        if (loading === 1) {
            reload();
        } else {
            videoRef.current.seek(0); // Reinicia el video al comienzo
        }
    };

    return (
        <View >
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible2}
            >
                <ScrollView style={{ backgroundColor: '#000' }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {videoPath && (
                            <ReactNativeZoomableView
                                maxZoom={2} minZoom={0.5} zoomStep={0.5} initialZoom={1}
                            >
                                <TouchableOpacity onPress={() => setPaused(!paused)}>
                                    <Video
                                        ref={videoRef}
                                        source={{ uri: `${videoPath}` }}
                                        style={{
                                            width: anchoPantalla,
                                            height: altoModal * ratio2,
                                        }}
                                        resizeMode="contain"
                                        toggleResizeModeOnFullscreen={true}
                                        tapAnywhereToPause={true}
                                        onError={handleVideoError}
                                        onProgress={onProgress}
                                        paused={paused}
                                        onBuffer={onBuffer}
                                        onLoadStart={onLoadStart}
                                        onLoad={onLoad}
                                        onEnd={onEnd}
                                        disableBack

                                    />
                                </TouchableOpacity>
                                {isBuffering && (
                                    <ActivityIndicator
                                        size="large"
                                        color="#00ff00"
                                        style={styles.bufferingIndicator}
                                    />
                                )}
                                <View style={styles.progressContainer}>
                                    <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={0}
                                        maximumValue={duration}
                                        value={currentTime}
                                        onValueChange={onSeek}
                                        minimumTrackTintColor="#FFFFFF"
                                        maximumTrackTintColor="#000000"
                                        thumbTintColor="#FFFFFF"
                                    />
                                    <Text style={styles.timeText}>{formatTime(duration)}</Text>
                                </View>
                            </ReactNativeZoomableView>
                        )}
                        {loading !== 1 &&
                            <Text style={{ color: '#FCB213', fontSize: 12, marginBottom: 10 }}>Cargando buffer espere...</Text>
                        }
                    </View>
                </ScrollView>
                <View style={{ backgroundColor: '#000', }}>
                    {loading === 1 &&
                        <TouchableOpacity
                            style={styles.buttonUno}
                            onPress={() => reload()}
                        >
                            <Iconm name='reload1' color="white" size={21} />
                        </TouchableOpacity>
                    }
                    <TouchableOpacity
                        style={styles.buttonDos}
                        onPress={() => setModalVisible2(false)}
                    >
                        <Iconm name='close' color="white" size={25} />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

export default ModalVideo;

const styles = StyleSheet.create({
    buttonUno: {
        position: 'absolute',
        backgroundColor: '#000',
        bottom: 8,
        right: 90,
        height: 30,
        width: 50,
        borderRadius: 25,
        borderColor: '#FCB213',
        borderWidth: 2,
        alignItems: 'center',
    },
    buttonDos: {
        position: 'absolute',
        backgroundColor: '#000',
        bottom: 8,
        right: 20,
        height: 30,
        width: 50,
        borderRadius: 25,
        borderColor: '#FCB213',
        borderWidth: 2,
        alignItems: 'center',
    },
    bufferingIndicator: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
    },
    progressContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeText: {
        color: '#fff',
    },
    slider: {
        flex: 1,
        marginHorizontal: 10,
    },
});