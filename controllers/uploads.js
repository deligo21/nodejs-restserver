import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { v2} from 'cloudinary';

const cloudinary = v2;
const callCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    return cloudinary;
}

import { response } from "express";
import { subirArchivo } from "../helpers/subir-archivo.js";
import Usuario from "../models/usuario.js" 
import Producto from "../models/producto.js" 

 const cargarArchivo = async(req, res=response) =>{

    try {
        // const nombreArchivo = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombreArchivo = await subirArchivo(req.files, undefined, 'imgs');//Undefined por que necesitamos enviar todos los argumentos al helper

        res.json({ 
            nombre: nombreArchivo
        });
    } catch (error) {
        res.status(400).json({error})
    }
}

const actualizarImagen = async(req, res=response) =>{

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);
            if (! modelo){
                return res.status(400).json({
                    msg: `No se encontró el usuario con el id: ${id}`
                });
            }
            break;

        case 'productos':

            modelo = await Producto.findById(id);

            if (! modelo){
                return res.status(400).json({
                    msg: `No se encontró el producto con el id: ${id}`
                });
            }
            break;
    
        default:
            return res.status(500).json({msg: 'Validacion no implementada.'});
    }

    // Limpiar imagenes previas
    if(modelo.img){
        // Hay que borrar la imagen del servidor
        const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if(fs.existsSync(pathImage)){
            fs.unlinkSync(pathImage);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);
}

const actualizarImagenCloudinary = async(req, res=response) =>{

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);
            if (! modelo){
                return res.status(400).json({
                    msg: `No se encontró el usuario con el id: ${id}`
                });
            }
            break;

        case 'productos':

            modelo = await Producto.findById(id);

            if (! modelo){
                return res.status(400).json({
                    msg: `No se encontró el producto con el id: ${id}`
                });
            }
            break;
    
        default:
            return res.status(500).json({msg: 'Validacion no implementada.'});
    }

    // Limpiar imagenes previas
    if(modelo.img){
        // Borrando la imagen del servidor
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        callCloudinary().uploader.destroy( `nodejs-restserver/${coleccion}/${public_id}` );
    }

    try {
        
        const {tempFilePath} = req.files.archivo;
        const {secure_url} = await callCloudinary().uploader.upload(tempFilePath, {
            folder: `nodejs-restserver/${coleccion}`
        });

        modelo.img = secure_url;
        await modelo.save();

        res.status(200).json({
            modelo
        });

    } catch (error) {
        console.log(error);
    }

}

const mostrarImagen = async(req, res) =>{

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);
            if (! modelo){
                return res.status(400).json({
                    msg: `No se encontró el usuario con el id: ${id}`
                });
            }
            break;

        case 'productos':

            modelo = await Producto.findById(id);

            if (! modelo){
                return res.status(400).json({
                    msg: `No se encontró el producto con el id: ${id}`
                });
            }
            break;
    
        default:
            return res.status(500).json({msg: 'Validacion no implementada.'});
    }

    if(modelo.img){
        
        const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if(fs.existsSync(pathImage)){
            return res.sendFile(pathImage)
        }
    }
    const notFoundImage = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(notFoundImage);
}

const mostrarImagenCloudinary = async(req, res) =>{

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);
            if (! modelo){
                return res.status(400).json({
                    msg: `No se encontró el usuario con el id: ${id}`
                });
            }
            break;

        case 'productos':

            modelo = await Producto.findById(id);

            if (! modelo){
                return res.status(400).json({
                    msg: `No se encontró el producto con el id: ${id}`
                });
            }
            break;
    
        default:
            return res.status(500).json({msg: 'Validacion no implementada.'});
    }

    if ( modelo.img ) {
        return res.redirect(modelo.img)
    }
    const notFoundImage = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(notFoundImage);
}

export {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen,
    mostrarImagenCloudinary
};