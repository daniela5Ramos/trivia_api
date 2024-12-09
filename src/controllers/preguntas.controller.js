import Trivia from "../models/Trivia.js";
import Pregunta from "../models/Pregunta.js";

// Obtener todas las preguntas
export const getPreguntas = async (req, res) => {
  try {
    const preguntas = await Pregunta.find();
    res.json(preguntas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva pregunta
export const createPregunta = async (req, res) => {
    try {
      const { texto, opciones, categoria, idTrivia } = req.body;
      const nuevaPregunta = new Pregunta({ texto, opciones, categoria,idTrivia});
  
      const preguntaGuardada = await nuevaPregunta.save();
  
      await Trivia.findByIdAndUpdate(
        idTrivia,
        { $push: { preguntas: preguntaGuardada._id } },
        { new: true }
      );
  
      res.status(201).json(preguntaGuardada);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Obtener pregunta por ID
export const getPreguntaById = async (req, res) => {
  try {
    const { preguntaId } = req.params;
    const pregunta = await Pregunta.findById(preguntaId);
    res.json(pregunta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una pregunta por ID
export const updatePreguntaById = async (req, res) => {
  try {
    const { preguntaId } = req.params;
    const { texto, opciones, categoria, idTrivia } = req.body;

    const preguntaExistente = await Pregunta.findById(preguntaId);

    if (!preguntaExistente) {
      return res.status(404).json({ message: "Pregunta no encontrada" });
    }

    const preguntaActualizada = await Pregunta.findByIdAndUpdate(
      preguntaId,
      { $set: { texto, opciones, categoria, idTrivia } },
      { new: true }
    );

    res.json(preguntaActualizada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una pregunta por ID
export const deletePreguntaById = async (req, res) => {
    try {
      const { preguntaId } = req.params;
  
      const pregunta = await Pregunta.findById(preguntaId);
      if (!pregunta) {
        return res.status(404).json({ message: "Pregunta no encontrada" });
      }
  
      await Pregunta.deleteOne({ _id: preguntaId });
  
      await Trivia.findByIdAndUpdate(
        pregunta.idTrivia,
        { $pull: { preguntas: preguntaId } },
        { new: true }
      );
  
      res.json({ message: "Pregunta eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };