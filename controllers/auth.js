import { json, request, response } from "express";
import Usuario from "../models/usuario.js"
import bcryptjs from 'bcryptjs'
import { generarJWT } from "../helpers/generar-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";

const login = async(req, res = response) => {

    const {correo, password} = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo});

        if (!usuario){
            return res.status(400).json({
                msg: 'El correo introducido no es correcto'
            })
        }

        //Si el usuario esta activo
        if (!usuario.estado){
            return res.status(400).json({
                msg: 'El usuario esta inactivo'
            })
        }

        //Verificar la contrasena
        const passwordValido = bcryptjs.compareSync(password, usuario.password);

        if (!passwordValido){
            return res.status(400).json({
                msg: 'La contrasena no es correcta'
            });
        }
        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Contactese con el administrador'
        })
    }
}

const googleSignIn = async(req, res = response) => {
 
    const { id_token } = req.body;

    try {
        
        const {correo, nombre, img} = await googleVerify(id_token);

        //Verificar si el usuario existe
        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ' ',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }
        //Si el usuario esta activo en BD
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Contactese con el administrador, el usuario esta bloqueado'
            });
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok:false,
            msg: 'El token no se pudo verificar'
        });
    }

}

export {login, googleSignIn};