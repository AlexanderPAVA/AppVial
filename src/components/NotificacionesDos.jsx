import config from "../config";

const API_KEY = config.API_KEY;
const AUTHO_TOKEN = config.AUTHO_TOKEN;
const RUTA_NOTIS = config.RUTA_NOTIS;

export function NotificacionesDos( problema, zona, frase, codigo, email, reten ) {
    const lanzar = ()=>{
      const currentTime = new Date();
      const scheduleTime = new Date(currentTime.getTime() + 30 * 1000); 
        if (problema !== 'Reten') {
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
                headings: { "en": problema },
                contents: { "en": zona + ', ' + frase },
                android_accent_color: "ECD91E",
                included_segments: ['All'],
                data: {
                  codigoId: codigo,
                  emailUsu: email
                },
                send_after: scheduleTime.toISOString()
              }),
            };
            fetch(url, params).then();
          } else {
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
                headings: { "en": problema },
                contents: { "en": zona + ', ' + frase },
                android_accent_color: "ECD91E",
                filters: [{ "field": "tag", "key": "key", "relation": "=", "value": reten }],
                data: {
                  codigoId: codigo,
                  emailUsu: email
                },
                send_after: scheduleTime.toISOString()
              }),
            };
            fetch(url, params).then();
          };  

    };
    lanzar();
}