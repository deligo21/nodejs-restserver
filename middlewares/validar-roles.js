import { request, response } from "express";

const esAdminRole = (req =request, res = response, next) =>{
    
    if(!req.usuario){
        return res.status(500).json({
            msg:"Intencion de verificar el rol sin validacion de token"
        })
    }


    
    const {rol, nombre} =  req.usuario;

    if (rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `El usuario ${nombre} no posee el rol de administrador - No puede realizar la accion`
        })
    }
    
    next();
}

const tieneRole = (...roles) =>{

    return ((req =request, res = response, next) => {

        if(!req.usuario){
            return res.status(500).json({
                msg:"Intencion de verificar el rol sin validacion de token"
            })
        }

        if (!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `El usuario ${req.usuario.nombre} no posee un rol con los privilegios necesarios - No puede realizar la accion`
            })
        }


        next()
    })
}

export {esAdminRole, tieneRole}