import { response } from "express";
import Categoria from '../models/categoria.js';

const obtenerCategorias = async (req, res = response) => {

    //Argumentos opcionales
    const {limite = 5, desde = 0} = req.query;
    //Query para filtrar solo las categorias activas
    const query = {estado: true}

    //Total de categorias y categorias
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate('usuario', 'nombre')
    ]);

    //Modificando para mostrar al usuario que creo la categoría

    //respuesta
    res.json({
        total,
        categorias
    });
}

const obtenerCategoria = async (req, res = response) => {
    const {id} = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json(categoria);
}

const categoriasPost = async(req, res = response) =>{
    
    const nombre = req.body.nombre.toUpperCase();

    //Revisar si ya existe la categoria
    const categoriaDB = await Categoria.findOne({nombre})

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe.`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    
    const categoria = new Categoria( data );

    //Guardamos en DB
    await categoria.save();

    res.status(201).json(categoria)
}

const categoriasPut = async(req, res = response) => {

    const {id} = req.params;
    const {_id, estado, usuario, ...data} = req.body;

    if(req.body.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true}).populate('usuario', 'nombre');

    res.json(categoria);
}

const categoriasDelete = async(req, res = response) => {

    const {id} = req.params;
    
    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false}, {new:true}).populate('usuario', 'nombre');
    
    res.json(categoria);
}

export {obtenerCategorias, obtenerCategoria, categoriasPost , categoriasPut, categoriasDelete} 