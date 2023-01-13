import { response } from "express";
import Producto from "../models/producto.js"

const obtenerProductos = async (req, res = response) => {

    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true}

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        productos
    });
}

const obtenerProducto = async (req, res = response) => {
    const {id} = req.params;

    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');

    res.json(producto);
}

const productosPost = async(req, res = response) =>{
    
    const {estado, usuario, ...body} = req.body;

    const nombre = body.nombre.toUpperCase()

    const productoDB = await Producto.findOne({nombre})

    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe.`
        });
    }
    
    const data = {
        nombre,
        ...body,
        usuario: req.usuario._id,
    }

    const producto = new Producto(data);

    //Guardamos en DB
    await producto.save();

    res.status(201).json(producto);
}

const productosPut = async(req, res = response) => {

    const {id} = req.params;
    const {_id, estado, usuario, ...data} = req.body;

    if(req.body.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new:true}).populate('usuario', 'nombre').populate('categoria', 'nombre');

    res.json(producto);
}

const productosDelete = async(req, res = response) => {

    const {id} = req.params;
    
    const producto = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true}).populate('usuario', 'nombre').populate('categoria', 'nombre');
    
    res.json(producto);
}

export {productosPost, obtenerProducto, obtenerProductos, productosPut, productosDelete}