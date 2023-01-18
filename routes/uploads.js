import { Router } from 'express';
import { query, body, param } from 'express-validator';
import { cargarArchivo, actualizarImagenCloudinary, mostrarImagenCloudinary } from '../controllers/uploads.js';
import { coleccionesPermitidas } from '../helpers/db-validators.js';

import {validarCampos} from '../middlewares/validar-campos.js';
import {validarArchivoSubido} from '../middlewares/validar-archivo.js';

const router = Router();

router.post('/', [
    validarArchivoSubido,
    validarCampos, 
], cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubido,
    validarCampos,
    param('id', 'No es un ID valido').isMongoId(),
    validarCampos, 
    param('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos, 
], 
// actualizarImagen
actualizarImagenCloudinary
);

router.get('/:coleccion/:id', [
    param('id', 'No es un ID valido').isMongoId(),
    validarCampos, 
    param('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos, 
], mostrarImagenCloudinary);

export default router;