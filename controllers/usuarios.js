import { response, request } from 'express';
import Usuario from '../models/usuario.js'
import bcryptjs from 'bcryptjs'

const usuariosGet = async (req = request, res = response) => {

    //Argumentos opcionales
    const {limite = 5, desde = 0} = req.query;
    //Query para filtrar solo los usuarios activos
    const query = {estado: true}

    //Total de usuarios y usuarios
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    //respuesta
    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});
    
    //Encriptar la contrasena
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt)

    //Guardar en la bd
    await usuario.save();

    res.status(201).json(
        usuario
    );
}

const usuariosPut = async(req, res) => {

    const {id} = req.params;
    const {_id, password, google, correo,...resto} = req.body;

    if (password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new:true})

    res.json(usuario);
}

const usuariosPatch = (req, res) => {
    res.json({
        msg:'patch API - controlador',
    });
}

const usuariosDelete = async(req, res = response) => {

    const {id} = req.params;
    
    //Borrar fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id, {new:true});
    
    //Cambiar el estado del usuario
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false}, {new:true});
    
    res.json(usuario);
}

export {usuariosGet, usuariosPut, usuariosPost, usuariosPatch, usuariosDelete}