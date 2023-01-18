import { response } from "express";

const validarArchivoSubido = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        
        return res.status(400).json({
            msg: 'No se encontraron archivos para subir'
        });
    }

    next();
}

export {
    validarArchivoSubido
}