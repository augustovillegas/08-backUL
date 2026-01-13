import { response, request } from "express";
import { Usuario } from "../models/usuario.js";
import bcryptjs from 'bcryptjs';
import { generateJWT } from "../helpers/generateJWT.js";

const logEntrada = (req, handler) => {
  console.log(`[ENTRADA] ${handler}`, {
    method: req.method,
    path: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body,
  });
};

const logSalida = (handler, payload) => {
  console.log(`[SALIDA] ${handler}`, payload);
};

export const login = async (req = request, res = response) => {
  logEntrada(req, "login");
  const { correo, password } = req.body;

  try {

    // Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if( !usuario ) {
        logSalida("login", { status: 400, body: { msg: "Usuario / Password no son correctos." } });
        return res.status(400).json({
            msg: "Usuario / Password no son correctos."
        })
    }

    // SI el usuario está activo 
    if( !usuario.estado ) {
        logSalida("login", { status: 400, body: { msg: "Usuario / Password no son correctos." } });
        return res.status(400).json({
            msg: "Usuario / Password no son correctos."
        })
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync( password, usuario.password )
    if(!validPassword) {
        logSalida("login", { status: 400, body: { msg: "Usuario / Password no son correctos." } });
        return res.status(400).json({
            msg: "Usuario / Password no son correctos."
        })
    }

    // Generar el JWT
    const token = await generateJWT( usuario.id );


    logSalida("login", { usuario, token });
    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    logSalida("login", { status: 500, body: { msg: "ERROR: Hable con el administrador." } });
    return res.status(500).json({
      msg: "ERROR: Hable con el administrador.",
    });
  }
};
