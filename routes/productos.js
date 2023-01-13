import { Router } from 'express';
import { body, query, param } from 'express-validator';

import { obtenerProducto, obtenerProductos, productosDelete, productosPost, productosPut } from '../controllers/productos.js';
import { existeCategoriaPorId, existeProductoPorId, productoEstaActivo, productoYaExisteActualizar } from '../helpers/db-validators.js';

import {validarCampos} from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRole } from '../middlewares/validar-roles.js';

const router = Router();

//url: http://localhost/api/productos/

router.get('/', [
    query("limite", "El limite para la consulta debe ser un valor numerico")
        .isNumeric()
        .optional(),
    query("desde", "El valor desde donde se quiere realizar la consulta debe ser numerico")
        .isNumeric()
        .optional(),
    validarCampos
], obtenerProductos);

router.get('/:id',[
    param('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    param('id').custom(existeProductoPorId),
    validarCampos,
    param('id').custom(productoEstaActivo),
    validarCampos
],  obtenerProducto);

router.post('/', [
    validarJWT,
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    body('precio', 'El precio no es valido').isNumeric(),
    body('categoria', 'La categoria es obligatoria').not().isEmpty(),
    body('categoria', 'La categoria no es valida').isMongoId(),
    body('categoria').custom(existeCategoriaPorId),
    validarCampos
], productosPost);

router.put('/:id', [
    validarJWT,
    param('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    param('id').custom(existeProductoPorId),
    validarCampos,
    param('id').custom(productoEstaActivo),
    validarCampos,
    body('nombre').custom(productoYaExisteActualizar),
    validarCampos,
    body('categoria').optional().custom(existeCategoriaPorId),
    validarCampos,
],productosPut);

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    param('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    param('id').custom(existeProductoPorId),
    validarCampos
],
productosDelete);

export default router;