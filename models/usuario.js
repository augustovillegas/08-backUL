import { Schema, model } from "mongoose";

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es requerido."],
    minlength: 2,
  },

  correo: {
    type: String,
    required: [true, "El correo es requerido."],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "La contraseña es obligatoria."],
  },

  img: {
    type: String,
  },

  rol: {
    type: String,
    required: true,
    enum: ["ADMIN_ROLE", "USER_ROLE"],
  },

  estado: {
    type: Boolean,
    default: true,
  },

  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});

UsuarioSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

export const Usuario = model("Usuario", UsuarioSchema);
