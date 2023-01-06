import { response } from "express";
import Usuario from "../models/usuario.js"
import bcryptjs from 'bcryptjs'
import { generarJWT } from "../helpers/generar-jwt.js";

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
                msg: 'El estado no es correcto'
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

export {login};