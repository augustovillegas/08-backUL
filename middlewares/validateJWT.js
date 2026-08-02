import { request, response } from "express";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/usuario.js";

export const validateJWT = async (req = request, res = response, next) => {
  const authHeader = req.header("Authorization") || req.header("x-token") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición.",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Leer usuario que corresponde al uid
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: "Token no válido.",
      });
    }

    // Verificar si el uid tiene estado en true
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no válido.",
      });
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no válido.",
    });
  }
};
