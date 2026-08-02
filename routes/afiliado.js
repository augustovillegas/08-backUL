import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  afiliadoGet,
  afiliadoGetById,
  afiliadoPost,
} from "../controllers/afiliado.js";
import { validateJWT } from "../middlewares/validateJWT.js";

export const afiliadoRouter = Router();

const registroLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { msg: "Demasiados intentos de registro. Volvé a intentar en una hora." },
});

// Obtener todos los afiliados - Privado
afiliadoRouter.get("/", validateJWT, afiliadoGet);

// Obtener afiliados especificos - Privado
afiliadoRouter.get("/:id", validateJWT, afiliadoGetById);

// Crear afiliados - Público con rate limit
afiliadoRouter.post("/", registroLimiter, afiliadoPost);

// Actualizar por ID - Admin
afiliadoRouter.put("/:id", (req, res) => {
  res.json("put");
});

// Borrar un afiliado - Admin
afiliadoRouter.delete("/:id", (req, res) => {
  res.json("delete");
});
