import Role from '../models/role.js'
import Usuario from '../models/usuario.js'
import Categoria from '../models/categoria.js';
import Producto from '../models/producto.js';
import mongoose from 'mongoose';

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({rol});

    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la base de datos`)
    }
}

const emailExiste = async (correo = "") =>{
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya se encuentra registrado`)
    }
}

const existeUsuarioPorId = async (id) =>{
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario) {
        throw new Error(`El usuario con el id: ${id} no existe`)
    }
}

const usuarioEstaActivo = async (id) =>{
    const activoUsuario = await Usuario.findById(id);
    if ( !activoUsuario.estado) {
        throw new Error(`El usuario con el id: ${id} no esta activo`)
    }
}

//Categorias

const existeCategoriaPorId = async (id) =>{

    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria) {
        throw new Error(`La categoria con el id: ${id} no existe`)
    }
}

const categoriaEstaActiva = async (id) =>{
    const activaCategoria = await Categoria.findById(id);
    if ( !activaCategoria.estado) {
        throw new Error(`La categoria con el id: ${id} no esta activo`)
    }
}

const categoriaYaExisteActualizar = async (nombre = "") => {
    nombre = nombre.toUpperCase();
    const nombreActual = await Categoria.findOne({nombre})
    if (nombreActual.nombre !== nombre) {
        const existeCategoria = await Categoria.findOne({ nombre });
        if (existeCategoria) {
            throw new Error(`La categoria ${nombre} ya existe`);
        }
    }
};

//Productos

const existeProductoPorId = async (id) =>{

    const existeProducto = await Producto.findById(id);
    if ( !existeProducto) {
        throw new Error(`El producto con el id: ${id} no existe`)
    }
}

const productoEstaActivo = async (id) =>{
    const activoProducto = await Producto.findById(id);
    if ( !activoProducto.estado) {
        throw new Error(`El producto con el id: ${id} no esta activo`)
    }
}

const productoYaExisteActualizar = async (nombre = "") => {
    if (nombre){
        nombre = nombre.toUpperCase();
        const nombreActual = await Producto.findOne({nombre})
        if (nombreActual.nombre !== nombre) {
            const existeProducto = await Producto.findOne({ nombre });
            if (existeProducto) {
                throw new Error(`El producto ${nombre} ya existe`);
            }
        }
    }
};

export {
    esRolValido, 
    emailExiste,
    existeUsuarioPorId, 
    existeCategoriaPorId, 
    usuarioEstaActivo, 
    categoriaEstaActiva, 
    categoriaYaExisteActualizar, 
    existeProductoPorId,
    productoEstaActivo,
    productoYaExisteActualizar,
}