import { Schema, model } from "mongoose";

const triviaSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
    },
    preguntas: [
      {
        type: Schema.Types.ObjectId,
        ref: "Pregunta",
      },
    ],
    estado: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Trivia", triviaSchema);
