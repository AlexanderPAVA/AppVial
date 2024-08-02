import config from "../config";

const API_KEY = config.API_KEY;
const AUTHO_TOKEN = config.AUTHO_TOKEN;
const RUTA_NOTIS = config.RUTA_NOTIS;

export function Notificarlikes( conteoLikes, problema, fecha, nameUsu, player ) {
    const lanzarnoti = ()=>{

        if (conteoLikes < 6) {
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
                headings: { "en": nameUsu },
                contents: { "en": "Has recibido " + conteoLikes + " me asombra en un : " + problema + " / " + fecha },
                android_accent_color: "FFE700",
                include_player_ids: [player],
                //url: 'https://something.any', // optional
              }),
            };
            fetch(url, params).then();
          } else if (conteoLikes % 10 == 0) {
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
                headings: { "en": nameUsu },
                contents: { "en": "Has recibido " + conteoLikes + " me asombra en un : " + problema + " / " + fecha },
                android_accent_color: "FFE700",
                include_player_ids: [player],
                //url: 'https://something.any', // optional
              }),
            };
            fetch(url, params).then();
          };

    };
    lanzarnoti();
}