import { Schema, model } from 'mongoose';

const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El campo de rol es obligatorio']
    },
    
});

export default model('Role', RoleSchema);