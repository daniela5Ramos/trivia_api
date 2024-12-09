//Importar modelo de datos Use
import jwt from 'jsonwebtoken'; 
import User from "../models/User";
import Role from '../models/Role';

//Exportar las funciones de Singup y Singin 
export const signUp = async (req, res)=>{
    //extrae los datos del cuerpo de la peticion
    const {username, email, password, roles} = req.body;

    //Crear un nuevo usuario
    try {
    const newUser = new User({
        username,
        email,
        password: await User.encryptPassword(password),
        roles
    })

    //condición para asignar roles, en caso de que no se envien roles,
    //se asignan el rol del usuario
    if(req.body.roles){
        const foundRoles = await Role.find({name: {$in: roles}});
        newUser.roles=foundRoles.map(role => role._id);
    }else{
        const role = await Role.findOne({name: "user"});
        newUser.roles = [role._id];
    }

    //Guardar el usuario en la bd
    const saveUser = await newUser.save();
    console.log(newUser);

    // Crear el token JWT después de guardar el nuevo usuario
    const token = jwt.sign({ userId: saveUser._id }, process.env.SECRET, { expiresIn: '1h' });
    
    //Responderle al cliente
    res.json({ token });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
}
}

//función para iniciar sesión
export const signIn = async (req, res)=>{
//Buscar usuario por correo
const userFound = await User.findOne({email:req.body.email}).populate("roles");
//si no se encuentra el usuario, enviar mensaje de error
if(!userFound) return res.status(400).json({message: "Usuario no encontrado"});

//verificar contraseña
const matchPassword = await User.comparePassword(req.body.password, userFound.password);
//Si la contraseña no coincide, enviar mensaje de error
if(!matchPassword) return res.status(401).json({token: null,message:"Contraseña inválida"});

//Generar token
const token = jwt.sign({id:userFound}, process.env.SECRET, {
    expiresIn: 86400 //24 horas
});

//Mostrar usuario encontrado
//console.log(userFound);
//json de prueba en caso de que se encuentre el usuario
//res.json({token:"token generado"})
res.status(200).json({token});
}