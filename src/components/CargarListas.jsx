import axios from "axios";
import { Notificarlikes } from "./Notificarlikes";
import config from "../config";
const RUTA_LISTA_CINCO = config.RUTA_LISTA_CINCO;

export function CargarListas(res, conteoLikes, playerid, nombre, problema, fecha, useremail) {
        const player = playerid;
        const nameUsu = nombre;
        if (res.rows.length > 0) {
          const listax = Array.from({ length: res.rows.length }).map((_, i) => res.rows.item(i));
          console.log(listax);
          axios.post(RUTA_LISTA_CINCO, {
            data: listax,
            emailusu: useremail
          })
            .then(respt => {
              Notificarlikes(conteoLikes, problema, fecha, nameUsu, player);
            }).catch(function (error) {
            });
        };
};