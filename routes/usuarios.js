import { Router } from 'express';
import { query, body, param } from 'express-validator';

import {usuariosGet, usuariosPut, usuariosPost, usuariosPatch, usuariosDelete} from '../controllers/usuarios.js';

import { emailExiste, esRolValido, existeUsuarioPorId, usuarioEstaActivo } from '../helpers/db-validators.js';

import {validarCampos} from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { esAdminRole, tieneRole } from '../middlewares/validar-roles.js';


const router = Router();

router.get('/', [
    query("limite", "El limite para la consulta debe ser un valor numerico")
        .isNumeric()
        .optional(),
    query("desde", "El valor desde donde se quiere realizar la consulta debe ser numerico")
        .isNumeric()
        .optional(),
    validarCampos
], usuariosGet);

router.put('/:id', [
    param('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    param('id').custom(existeUsuarioPorId),
    param('id').custom(usuarioEstaActivo),
    body('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.post('/', [
    body('nombre', 'El campo de nombre es obligatorio').not().isEmpty(),
    body('password', 'El campo de contrasena es obligatorio y debe contener mas de 8 caracteres').isLength({min:8}),
    body('correo', 'El correo no es valido').isEmail(),
    body('correo').custom(emailExiste),
    // check('rol', 'El rol no es valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    body('rol').custom(esRolValido),
    validarCampos
],usuariosPost);

router.patch('/', usuariosPatch);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    param('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    param('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

export default router;