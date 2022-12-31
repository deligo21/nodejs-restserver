import { Router } from 'express';
import { check, query } from 'express-validator';
import {usuariosGet, usuariosPut, usuariosPost, usuariosPatch, usuariosDelete} from '../controllers/usuarios.js';
import { emailExiste, esRolValido, existeUsuarioPorId } from '../helpers/db-validators.js';
import validarCampos from '../middlewares/validar-campos.js';


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
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El campo de nombre es obligatorio').not().isEmpty(),
    check('password', 'El campo de contrasena es obligatorio y debe contener mas de 8 caracteres').isLength({min:8}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    // check('rol', 'El rol no es valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRolValido),
    validarCampos
],usuariosPost);

router.patch('/', usuariosPatch);

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

export default router;