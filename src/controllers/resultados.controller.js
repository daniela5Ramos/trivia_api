import Resultado from "../models/Resultado.js";
import User from "../models/User.js";
import Trivia from "../models/Trivia.js";
import { ObjectId } from "mongodb";

// Crear un nuevo resultado
export const createResultado = async (req, res) => {
  try {
    const { idUsuario, idTrivia, puntaje } = req.body;

    const user = await User.findById(idUsuario);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const trivia = await Trivia.findById(idTrivia);
    if (!trivia) {
      return res.status(404).json({ message: "Trivia no encontrada" });
    }

    const nuevoResultado = new Resultado({ idUsuario, idTrivia, puntaje });
    const resultadoGuardado = await nuevoResultado.save();

    res.status(201).json(resultadoGuardado);
  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Obtener todos los resultados
export const getResultados = async (req, res) => {
  try {
    const resultados = await Resultado.find().populate("idUsuario idTrivia");
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener resultado por ID
export const getResultadoById = async (req, res) => {
  try {
    const { resultadoId } = req.params;
    const resultado = await Resultado.findById(resultadoId).populate("idUsuario idTrivia");

    if (!resultado) {
      return res.status(404).json({ message: "Resultado no encontrado" });
    }

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener resultados de una trivia específica (toodos)
export const getResultadosPorTrivia = async (req, res) => {
  try {
    const { triviaId } = req.params;
    const resultados = await Resultado.find({ idTrivia: triviaId }).populate("idUsuario");

    if (resultados.length === 0) {
      return res.status(404).json({ message: "No se encontraron resultados para esta trivia" });
    }

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//  ----------------------- OBTNER DATOS CALCULADOS -----------------------


// Obtener el promedio de puntuación de un usuario por cada trivia
export const obtenerPromedioUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const resultados = await Resultado.aggregate([
      { $match: { idUsuario: new ObjectId(idUsuario) } }, // Convertir idUsuario a ObjectId
      {
        $group: {
          _id: "$idTrivia", // Agrupar por idTrivia
          promedio: { $avg: "$puntaje" }, // Calcular el promedio de puntajes
        },
      },
      {
        $lookup: {
          from: "trivias", // Nombre de la colección de trivias
          localField: "_id",
          foreignField: "_id",
          as: "trivia",
        },
      },
      {
        $unwind: "$trivia", // Descomponer la matriz trivia en documentos individuales
      },
      {
        $project: {
          idTrivia: "$_id", // Renombrar _id a idTrivia
          promedio: { $round: ["$promedio", 2] }, // Redondear promedio a dos decimales
          titulo: "$trivia.titulo", // Incluir el campo titulo de trivia
        },
      },
    ]);

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener el puntaje más alto de un usuario por cada trivia
export const obtenerPuntajeUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const resultados = await Resultado.aggregate([
      { $match: { idUsuario: new ObjectId(idUsuario) } }, // Convertir idUsuario a ObjectId
      {
        $group: {
          _id: "$idTrivia", // Agrupar por idTrivia
          maxPuntaje: { $max: "$puntaje" }, // Calcular el puntaje máximo
        },
      },
      {
        $lookup: {
          from: "trivias", // Nombre de la colección de trivias
          localField: "_id",
          foreignField: "_id",
          as: "trivia",
        },
      },
      {
        $unwind: "$trivia", // Descomponer la matriz trivia en documentos individuales
      },
      {
        $project: {
          idTrivia: "$_id", // Renombrar _id a idTrivia
          maxPuntaje: 1, // Incluir el campo maxPuntaje
          titulo: "$trivia.titulo", // Incluir el campo titulo de trivia
        },
      },
    ]);

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Obtener el top de usuarios con el promedio más alto por trivia
export const obtenerTopPromedio = async (req, res) => {
  try {
    const limit = 3; // Cantidad de usuarios en el top
    const { idTrivia } = req.params;

    // Obtener el top de usuarios con sus promedios
    const resultados = await Resultado.aggregate([
      { $match: { idTrivia: new ObjectId(idTrivia) } }, // Filtrar por idTrivia
      {
        $group: {
          _id: "$idUsuario", // Agrupar por idUsuario
          promedio: { $avg: "$puntaje" }, // Calcular el promedio
        },
      },
      { $sort: { promedio: -1 } }, // Ordenar de mayor a menor
      { $limit: parseInt(limit) }, // Limitar al número de usuarios en el top
    ]);

    // Obtener los IDs de los usuarios
    const userIds = resultados.map((resultado) => resultado._id);

    // Buscar los usuarios por sus IDs
    const usuarios = await User.find(
      { _id: { $in: userIds } }, // Buscar usuarios cuyos IDs estén en el top
      "username" // Seleccionar solo el campo username
    );

    // Mapear los resultados para incluir los usernames
    const resultadosConUsername = resultados.map((resultado) => {
      const usuario = usuarios.find((u) => u._id.toString() === resultado._id.toString());
      return {
        idUsuario: resultado._id,
        username: usuario ? usuario.username : "Usuario no encontrado",
        promedio: resultado.promedio,
      };
    });

    res.json(resultadosConUsername);
  } catch (error) {
    console.error(`Error al obtener el top de promedio: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};


// Obtener el top de usuarios con el puntaje más alto por trivia
export const obtenerTopPuntaje = async (req, res) => {
  try {
    const limit = 3; // Cantidad de usuarios en el top
    const { idTrivia } = req.params;

    // Obtener el top de usuarios con sus puntajes máximos
    const resultados = await Resultado.aggregate([
      { $match: { idTrivia: new ObjectId(idTrivia) } }, // Convertir idTrivia a ObjectId y filtrar
      {
        $group: {
          _id: "$idUsuario", // Agrupar por idUsuario
          maxPuntaje: { $max: "$puntaje" }, // Calcular el puntaje máximo
        },
      },
      { $sort: { maxPuntaje: -1 } }, // Ordenar de mayor a menor
      { $limit: parseInt(limit) }, // Limitar al número de usuarios en el top
    ]);

    // Obtener los IDs de los usuarios
    const userIds = resultados.map((resultado) => resultado._id);

    // Buscar los usuarios por sus IDs
    const usuarios = await User.find(
      { _id: { $in: userIds } }, // Buscar usuarios cuyos IDs estén en el top
      "username" // Seleccionar solo el campo username
    );

    // Mapear los resultados para incluir los usernames
    const resultadosConUsername = resultados.map((resultado) => {
      const usuario = usuarios.find((u) => u._id.toString() === resultado._id.toString());
      return {
        idUsuario: resultado._id,
        username: usuario ? usuario.username : "Usuario no encontrado",
        maxPuntaje: resultado.maxPuntaje,
      };
    });

    res.json(resultadosConUsername);
  } catch (error) {
    console.error(`Error al obtener el top de puntajes: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

//nuevo
export const obtenerTriviasRealizadas = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    // Buscar los resultados asociados al usuario
    const resultados = await Resultado.find({ idUsuario }).populate("idTrivia");

    // Extraer los IDs de las trivias realizadas
    const triviasRealizadas = resultados.map((resultado) => resultado.idTrivia._id);

    res.status(200).json(triviasRealizadas);
  } catch (error) {
    console.error("Error al obtener trivias realizadas:", error);
    res.status(500).json({ message: "Error al obtener las trivias realizadas por el usuario." });
  }
};

// Obtener todos los resultados de un usuario por trivia
export const obtenerHistorialUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const resultados = await Resultado.aggregate([
      { $match: { idUsuario: new ObjectId(idUsuario) } }, // Filtrar por el ID del usuario
      {
        $lookup: {
          from: "trivias", // Colección de trivias
          localField: "idTrivia",
          foreignField: "_id",
          as: "trivia",
        },
      },
      {
        $unwind: "$trivia", // Descomponer el array de trivia en documentos individuales
      },
      {
        $group: {
          _id: "$idTrivia", // Agrupar por el ID de la trivia
          titulo: { $first: "$trivia.titulo" }, // Obtener el título de la trivia
          puntajes: { $push: "$puntaje" }, // Crear un array con todos los puntajes de la trivia
        },
      },
      {
        $project: {
          _id: 0, // Excluir el _id del resultado final
          idTrivia: "$_id", // Renombrar _id a idTrivia
          titulo: 1,
          puntajes: 1,
        },
      },
    ]);

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





