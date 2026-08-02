import { Schema, model } from "mongoose";

const AfiliadoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es requerido."],
    minlength: [2, "El nombre debe tener al menos 2 caracteres."],
  },

  dni: {
    type: String, // Cambiado a String para manejar el DNI con ceros a la izquierda y evitar problemas con grandes números
    required: [true, "El DNI es requerido."],
    validate: {
      validator: function (v) {
        return /^\d{7,8}$/.test(v);
      },
      message: "El DNI debe tener entre 7 y 8 dígitos.",
    },
    unique: true,
  },

  correo: {
    type: String,
    required: [true, "El correo es requerido."],
    unique: true,
    match: [
      /^\S+@\S+\.\S+$/,
      "Por favor, ingrese un correo electrónico válido.",
    ],
  },

  fechaNacimiento: {
    type: Date,
    required: [true, "La fecha de nacimiento es requerida."],
    validate: {
      validator: function (v) {
        return v <= new Date();
      },
      message: "La fecha de nacimiento no puede ser futura.",
    },
  },

  domicilio: {
    type: String,
    required: [true, "El domicilio es requerido."],
    minlength: [5, "El domicilio debe tener al menos 5 caracteres."],
    maxlength: [50, "El domicilio no debe tener más de 50 caracteres."],
  },

  celular: {
    type: String,
    required: [true, "El celular es requerido."],
    minlength: [10, "El celular debe tener al menos 10 dígitos."],
    maxlength: [15, "El celular no debe tener más de 15 dígitos."],
    match: [/^[0-9]+$/, "El celular solo debe contener números."],
  },

  pais: {
    type: String,
    required: [true, "El país es requerido."],
  },

  provincia: {
    type: String,
    required: function () {
      return this.pais === "ar";
    },
    validate: {
      validator: function (v) {
        return this.pais !== "ar" || v;
      },
      message: "La provincia es requerida para Argentina.",
    },
  },

  departamento: {
    type: String,
    required: function () {
      return this.provincia === "Catamarca";
    },
    validate: {
      validator: function (v) {
        return this.provincia !== "Catamarca" || v;
      },
      message: "El departamento es requerido para la provincia de Catamarca.",
    },
  },

  estadoCivil: {
    type: String,
    enum: ["soltero", "casado", "divorciado", "viudo"],
    required: [true, "El estado civil es requerido."],
  },

  ocupacion: {
    type: String,
    enum: [
      "estudiante",
      "empleado",
      "autonomo",
      "desempleado",
      "jubilado",
      "ama de casa",
      "otro",
    ],
    required: [true, "La ocupación es requerida."],
  },

  firma: {
    type: String, // Asumiendo que firma es una cadena de base64 o una URL
    required: [true, "La firma es requerida."],
  },

  fotosDni: {
    type: [String],
    default: [],
  },

  fecha: {
    type: Date,
    default: Date.now,
  },
});

AfiliadoSchema.index({ fecha: -1 });
AfiliadoSchema.index({ nombre: "text" });

export const Afiliado = model("Afiliado", AfiliadoSchema);
