import { Router } from 'express';
import { body, query, param } from 'express-validator';
import { categoriasPut, categoriasPost, obtenerCategoria, obtenerCategorias, categoriasDelete } from '../controllers/categorias.js';
import { categoriaEstaActiva, categoriaYaExisteActualizar, existeCategoriaPorId } from '../helpers/db-validators.js';
import {validarCampos} from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRole } from '../middlewares/validar-roles.js';

const router = Router();

//url: http://localhost/api/categorias

// Obtener todas las categorias - publico
router.get('/', [
    query("limite", "El limite para la consulta debe ser un valor numerico")
        .isNumeric()
        .optional(),
    query("desde", "El valor desde donde se quiere realizar la consulta debe ser numerico")
        .isNumeric()
        .optional(),
    validarCampos
], obtenerCategorias);

// Obtener una categoria por id - publico
router.get('/:id',[
    param('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    param('id').custom(existeCategoriaPorId),
    validarCampos,
    param('id').custom(categoriaEstaActiva),
    validarCampos
],  obtenerCategoria);

// Crear una categoria - privado - cualquier persona con un token valido(que posea un rol)
router.post('/', [
    validarJWT,
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], categoriasPost);

// Actualizar una categoria por id - privado - cualquier persona con un token valido(que posea un rol)
router.put('/:id', [
    validarJWT,
    param('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    param('id').custom(existeCategoriaPorId),
    validarCampos,
    param('id').custom(categoriaEstaActiva),
    validarCampos,
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
    body('nombre').custom(categoriaYaExisteActualizar),
    validarCampos
],categoriasPut);

// Borrar una categoria por id - privado - solo administrador
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    param('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    param('id').custom(existeCategoriaPorId),
    validarCampos
],
categoriasDelete);


export default router;