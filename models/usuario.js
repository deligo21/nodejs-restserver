import { Schema, model } from 'mongoose';

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,  
    },
    password: {
        type: String,
        required: [true, 'La contrasena es obligatoria'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio'],
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google:{
        type: Boolean,
        default: false,
    }
});

UsuarioSchema.methods.toJSON = function(){
    const { __v, password, _id,...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('Usuario', UsuarioSchema);