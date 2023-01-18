import { request, response } from "express"
import jwt, { verify } from "jsonwebtoken"

import Usuario from '../models/usuario.js'

const validarJWT = async (req = request,res=response,next) =>{
    
    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg:"No existe token en la peticion"
        })
    }

    try {

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //Leer al usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        //Verificacion si el usuario existe
        if(!usuario){
            return res.status(401).json({
                msg:"Token no valido - usuario inexistente"
            })
        }

        //Verificar si el usuario esta activo
        if(!usuario.estado){
            return res.status(401).json({
                msg:"Token no valido - usuario inactivo"
            })
        }
        req.usuario = usuario
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:"Token no valido"
        });
    }
}

export {validarJWT}