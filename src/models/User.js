import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    roles: [
      {
        ref: "Role",
        type: Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//Metodo para encriptar la contraseña usuario envía una contraseña
userSchema.statics.encryptPassword = async (password) => {
  //Generar un salt para encriptar la contraseña
  const salt = await bcrypt.genSalt(10);
  //Retornar la contraseña encriptada
  return await bcrypt.hash(password, salt);
};

//Metodo para comprar la contraseña del usuario con la contraseña encriptada
userSchema.statics.comparePassword = async (password, receivedPassword) => {
  //Comparar la contraseña enviada con la contraseña encriptada
  return await bcrypt.compare(password, receivedPassword);
};

export default model("User", userSchema);