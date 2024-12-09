import User from "../models/User.js";

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate("roles");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("roles");

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
