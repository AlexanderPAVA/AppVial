import config from '../config';
import axios from 'axios';
import Share from 'react-native-share';
import RNFetchBlob from "rn-fetch-blob";
import RNFS from 'react-native-fs';

const RUTA_IMG_IMGS = config.RUTA_IMG_IMGS;
const RUTA_GOOGLEPLAY = config.RUTA_GOOGLEPLAY;

export function shareData(img1, img2, img3, problem, fecha, zona, frase, formato, video) {

  const compartir = async (link) => {

    if (formato === 'foto') {
      const photo1 = RUTA_IMG_IMGS + img1;
      const photo2 = RUTA_IMG_IMGS + img2;
      const photo3 = RUTA_IMG_IMGS + img3;

      const img64 = await RNFetchBlob
        .config({
          fileCache: false,
        })
        .fetch('GET', photo1)
        .then((res) => {
          return res.base64();
        })
        .catch((error) => {
        });

      const img642 = await RNFetchBlob
        .config({
          fileCache: false,
        })
        .fetch('GET', photo2)
        .then((res) => {
          return res.base64();
        })
        .catch((error) => {
        });

      const img643 = await RNFetchBlob
        .config({
          fileCache: false,
        })
        .fetch('GET', photo3)
        .then((res) => {
          return res.base64();
        })
        .catch((error) => {
        });

      if (img3 !== '') {
        const options = {
          message: problem + ', ' + fecha + ', ' + zona + '. ' + frase + ' ' + ' Quiero reportar: ' + link,
          urls: ['data:image/JPEG;base64,' + img64, 'data:image/JPEG;base64,' + img642, 'data:image/JPEG;base64,' + img643]
        };

        Share.open(options)
          .then((res) => {
          })
          .catch((err) => {
          });
      } else if (img2 !== '') {
        const options = {
          message: problem + ', ' + fecha + ', ' + zona + '. ' + frase + ' ' + ' Quiero reportar: ' + link,
          urls: ['data:image/JPEG;base64,' + img64, 'data:image/JPEG;base64,' + img642]
        }
        Share.open(options)
          .then((res) => {
          })
          .catch((err) => {
          });

      } else {
        const options = {
          message: problem + ', ' + fecha + ', ' + zona + '. ' + frase + ' ' + ' Quiero reportar: ' + link,
          url: 'data:image/JPEG;base64,' + img64
        }
        Share.open(options)
          .then((res) => {
          })
          .catch((err) => {
          });
      };

    } else {

      const videoUrl = RUTA_IMG_IMGS + video;
      try {
        const downloadDest = `${RNFS.CachesDirectoryPath}/${video}`;
        const fileExists = await RNFS.exists(downloadDest);
        if (fileExists) {
          const options = {
            message: problem + ', ' + fecha + ', ' + zona + '. ' + frase + ' ' + ' Quiero reportar: ' + link,
            url: `file://${downloadDest}`,
            type: 'video/mp4',
          }
          Share.open(options)
            .then((res) => {
            })
            .catch((err) => {
            });
        } else {
          const options = {
            fromUrl: videoUrl,
            toFile: downloadDest,
          };

          const response = await RNFS.downloadFile(options).promise;
          if (response.statusCode === 200) {

            const options = {
              message: problem + ', ' + fecha + ', ' + zona + '. ' + frase + ' ' + ' Quiero reportar: ' + link,
              url: `file://${downloadDest}`,
              type: 'video/mp4',
            }
            Share.open(options)
              .then((res) => {
              })
              .catch((err) => {
              });
          } else {
          }
        }

      } catch (error) {
      }
    }
  };


  const enlace = () => {
    const URL = RUTA_GOOGLEPLAY;
    axios.get(URL)
      .then(function (datos) {
        compartir(datos.data[0].link);
      })
      .catch(function (error) {
      });
  }
  enlace();
};