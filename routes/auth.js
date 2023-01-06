import { Router } from 'express';
import { check, query } from 'express-validator';
import { login } from '../controllers/auth.js';
import validarCampos from '../middlewares/validar-campos.js';

const router = Router();

router.post('/login', [
    check('correo', "El correo es obligatorio").isEmail(),
    check('password', 'La contrasena es obligatoria').not().isEmpty(),
    validarCampos
], login);

export default router;