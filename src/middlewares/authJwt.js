import jwt from "jsonwebtoken";
import User from "../models/User";
import Role from '../models/Role';


//Validar si el token es válido
export const verifyToken = async (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).json({ message: "No se ha proporcionado ningún Token" });
    //console.log(token);
    //Extraer la información del token
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userId = decoded.id;
    console.log(decoded);
    //Buscar el usuario en la base de datos
    const user = await User.findById(req.userId, { password: 0 });
    console.log(user);
    //Validar si el usuario existe
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    //Continuar con la siguiente función si el usuario existe
    next();
}

export const isModerator = async (req, res, next) => {
    //Buscar el usuario en la base de datos
    const user = await User.findById(req.userId);
    //Buscar los roles del usuario
    const roles = await Role.find({ _id: { $in: user.roles } });
    //console.log( roles );
    //Recorrer los roles del usuario
    for (let i=0; i<roles.length; i++){
        if (roles[i].name === 'moderator') {
            next();
            return;
        }
    }
    //Si el usuario no es administrador
    return res.status(403).json({ message: 'Requiere ser moderador' });
}

export const isAdmin = async (req,res,next) => {
    //Buscar el usuario en la BD
    const user = await User.findById(req.userId);
    //Buscar los roles del usuario
    const roles = await Role.find({_id: { $in: user.roles } });
    //console.log(roles);
    //Recorer todos los roles del usuario
    for(let i = 0; i <  roles.length;i++){
        if(roles[i].name ===  'admin'){
            next();
            return;
        }
    }
    //Si el usuario no es administrador 
    return res.status(403).json({ message: "Requiere ser administrador" });
}