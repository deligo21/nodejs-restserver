import { Router } from 'express';
import {usuariosGet, usuariosPut, usuariosPost, usuariosPatch, usuariosDelete} from '../controllers/usuarios.js';
const router = Router();

router.get('/', usuariosGet);

router.put('/:id', usuariosPut);

router.post('/', usuariosPost);

router.patch('/', usuariosPatch);

router.delete('/', usuariosDelete);

export default router;