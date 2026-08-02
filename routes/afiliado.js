import { Router } from "express";
import {
  afiliadoGet,
  afiliadoGetById,
  afiliadoPost,
} from "../controllers/afiliado.js";
import { validateJWT } from "../middlewares/validateJWT.js";

export const afiliadoRouter = Router();

// Obtener todos los afiliados - Privado
afiliadoRouter.get("/", validateJWT, afiliadoGet);

// Obtener afiliados especificos - Privado
afiliadoRouter.get("/:id", validateJWT, afiliadoGetById);

// Crear afiliados - Publico
afiliadoRouter.post("/", afiliadoPost);

// Actualizar por ID - Admin
afiliadoRouter.put("/:id", (req, res) => {
  res.json("put");
});

// Borrar un afiliado - Admin
afiliadoRouter.delete("/:id", (req, res) => {
  res.json("delete");
});
