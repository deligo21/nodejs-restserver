import { response } from "express";
import { isValidObjectId, Types  } from "mongoose";
import Usuario from '../models/usuario.js';
import Categoria from '../models/categoria.js';;
import Producto from "../models/producto.js"

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'producto-por-categoria',
    'roles'
];

const buscarUsuarios = async(termino = '', res = response) =>{
    const esMongoID = isValidObjectId(termino);

    if(esMongoID){
        const usuario = await Usuario.findById(termino);

        return res.json({
            results: (usuario) ? [usuario] : [] // Pregunto si el usuario existe, si no envio un arreglo vacio
        })
    }

    const regex = new RegExp(termino, 'i') //Expresion regular para hacerlo  insensible a las mayusculas
        
    const usuarios = await Usuario.find({
        $or: [{nombre:regex}, {correo:regex}],
        $and: [{estado:true}]
    });

    const total = await Usuario.count({
        $or: [{nombre:regex}, {correo:regex}],
        $and: [{estado:true}]
    });

    res.json({
        results: {total, usuarios}
    });
}

const buscarCategorias = async(termino = '', res = response) =>{
    const esMongoID = isValidObjectId(termino);

    if(esMongoID){
        const categoria = await Categoria.findById(termino).populate('usuario', 'nombre');

        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i') 
        
    const categorias = await Categoria.find({nombre:regex, estado:true}).populate('usuario', 'nombre');

    const total = await Categoria.count({nombre:regex, estado:true});

    res.json({
        results: {total, categorias: categorias}
    });
}

const buscarProductos = async(termino = '', res = response) =>{
    const esMongoID = isValidObjectId(termino);

    if(esMongoID){
        const producto = await Producto.findById(termino).populate('usuario', 'nombre').populate('categoria', 'nombre');

        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, 'i')
        
    const productos = await Producto.find({
        $or: [{nombre:regex}, {descripcion:regex}],
        $and: [{estado:true}]
    }).populate('usuario', 'nombre').populate('categoria', 'nombre');

    const total = await Producto.count({
        $or: [{nombre:regex}, {descripcion:regex}],
        $and: [{estado:true}]
    });

    res.json({
        results: {total, productos: productos}
    });
}

const buscarProductoPorCategoria = async( termino = '', res = response) => {

    try{
        const esMongoID = isValidObjectId( termino );
    
        if ( esMongoID ) {
            
            const producto = await Producto.find( { categoria: Types.ObjectId( termino ), estado: true}).populate('categoria', 'nombre');
    
            return res.json( {
                results: ( producto ) ? [ producto ] : []
            });
        }
    
        const regex = new RegExp( termino, 'i' );
    
        const categorias = await Categoria.find({ nombre: regex, estado: true});
        if ( !categorias.length ){
            return res.status(400).json({
                msg: `La categoria ${ termino } no pudo ser encontrada`
            });
        }
        
        const productos = await Producto.find({

            $or: [...categorias.map( categoria => ({
                categoria: categoria._id
            }))],

            $and: [{ estado: true }]
        }).populate('categoria', 'nombre');

        const total = await Producto.count({

            $or: [...categorias.map( categoria => ({
                categoria: categoria._id
            }))],

            $and: [{ estado: true }]
        }).populate('categoria', 'nombre');
        
        res.json({
            results: {total, productos: productos}
        });
        
    } catch ( error ){
        res.status(400).json( error );
    }
 
}

const buscar = (req, res = response) => {

    const {coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            mensaje: `La colección ${coleccion} no es válida`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        case 'categorias':
            buscarCategorias(termino, res);
        break;

        case 'productos':
            buscarProductos(termino, res);
        break;
        
        case 'producto-por-categoria':
            buscarProductoPorCategoria( termino, res );
        break;
    
        default:
            res.status(500).json({
                msg: 'Busqueda de esta coleccion aun en desarrollo'
            })
        break;
    }

}

export {buscar}