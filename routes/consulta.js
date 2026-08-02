import { Router } from "express";
import { check } from "express-validator";
import { enviarConsulta, obtenerConsultas } from "../controllers/contactController.js";
import { validateJWT } from "../middlewares/validateJWT.js";
import { handleValidate } from "../middlewares/handleValidate.js";

export const consultaRouter = Router();

// Ruta POST para enviar una consulta - Publico
consultaRouter.post("/", [
  check("nombre", "El nombre es obligatorio.").notEmpty().trim(),
  check("correo", "El correo no es válido.").isEmail().normalizeEmail(),
  check("mensaje", "El mensaje es obligatorio.").notEmpty().trim(),
  handleValidate,
], enviarConsulta);

// Ruta GET para obtener todas las consultas - Privado
consultaRouter.get("/", validateJWT, obtenerConsultas);
