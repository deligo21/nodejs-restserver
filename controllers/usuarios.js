import { response, request } from 'express';

const usuariosGet = (req = request, res = response) => {

    const {nombre = "No name", apikey = "No API key", page = 1, limit} = req.query;

    res.json({
        msg:'get API - controlador',
        nombre,
        apikey,
        page, 
        limit,
    });
}

const usuariosPut = (req, res) => {

    const {id} = req.params;

    res.json({
        msg:'put API - controlador',
        id,
    });
}

const usuariosPost = (req, res) => {

    const {nombre, edad} = req.body;

    res.status(201).json({
        msg:'post API - controlador',
        nombre,
        edad,
    });
}

const usuariosPatch = (req, res) => {
    res.json({
        msg:'patch API - controlador',
    });
}

const usuariosDelete = (req, res) => {
    res.json({
        msg:'delete API - controlador',
    });
}

export {usuariosGet, usuariosPut, usuariosPost, usuariosPatch, usuariosDelete}