import { Schema, model } from "mongoose";

const resultadoSchema = new Schema(
  {
    idUsuario: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    idTrivia: {
      type: Schema.Types.ObjectId,
      ref: "Trivia",
      required: true
    },
    puntaje: {
      type: Number,
      required: true
    },
    fecha: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model("Resultado", resultadoSchema);
