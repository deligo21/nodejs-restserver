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
        // enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE']
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
    const { __v, password, ...usuario} = this.toObject();
    return usuario;
}

export default model('Usuario', UsuarioSchema);