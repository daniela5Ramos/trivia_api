import Trivia from "../models/Trivia.js";
import Pregunta from "../models/Pregunta.js";

// Obtener todas las trivias
export const getTrivias = async (req, res) => {
    try {
        const trivias = await Trivia.find().populate("preguntas");
        res.json(trivias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva trivia
export const createTrivia = async (req, res) => {
    try {
        const { titulo, descripcion, estado } = req.body;

        const nuevaTrivia = new Trivia({
            titulo,
            descripcion,
            estado,
        });

        const triviaGuardada = await nuevaTrivia.save();

        res.status(201).json(triviaGuardada);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener trivia por ID
export const getTriviaById = async (req, res) => {
    try {
        const { triviaId } = req.params;
        const trivia = await Trivia.findById(triviaId).populate("preguntas");
        res.json(trivia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar trivia por ID
export const updateTriviaById = async (req, res) => {
    try {
        const { triviaId } = req.params;
        const { titulo, descripcion, estado } = req.body;

        const triviaExistente = await Trivia.findById(triviaId);
        if (!triviaExistente) {
          return res.status(404).json({ message: "Trivia no encontrada" });
        }

        const triviaActualizada = await Trivia.findByIdAndUpdate(
            triviaId,
            { $set: { titulo, descripcion, estado } },
            { new: true }
        );

        res.json(triviaActualizada);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar trivia por ID (también elimina las preguntas asociadas)
export const deleteTriviaById = async (req, res) => {
    try {

        const { triviaId } = req.params;

        const triviaExistente = await Trivia.findById(triviaId);
        if (!triviaExistente) {
            return res.status(404).json({ message: "Trivia no encontrada" });
        }

        await Pregunta.deleteMany({ idTrivia: triviaId });
        const triviaEliminada = await Trivia.deleteOne({ _id: triviaId });

        res.json({ message: "Trivia eliminada correctamente", triviaEliminada });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
