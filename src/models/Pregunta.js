import { Schema, model } from "mongoose";

const preguntaSchema = new Schema(
  {
    texto: {
      type: String,
      required: true,
    },
    opciones: [
      {
        texto: String,
        correcta: Boolean,
      },
    ],
    categoria: {
      type: String,
    },
    idTrivia: {
      type: Schema.Types.ObjectId,
      ref: "Trivia",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Pregunta", preguntaSchema);
