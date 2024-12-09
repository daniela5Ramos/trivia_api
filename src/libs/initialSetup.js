//Importar modelo de datos Role
import Role from "../models/Role";

//Exportar función para crear roles
export const createRoles = async () => {
    try {
        //verificar si existe en la bd
        const count = await Role.estimatedDocumentCount();
        //si no existen roles se crean
        if (count > 0) return;
        //Crear roles por defecto envolviendoen una promesa
        const values = await Promise.all([
            new Role({ name: "user" }).save(),
            new Role({ name: "moderator" }).save(),
            new Role({ name: "admin" }).save()
        ]);
        console.log(values);
    } catch (error) {
        console.error(error);
    }
}