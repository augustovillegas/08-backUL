import { response, request } from "express";
import { Usuario } from "../models/usuario.js";
import bcryptjs from "bcryptjs";

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

export const usuarioGet = async (req = request, res = response) => {
  logEntrada(req, "usuarioGet");
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  logSalida("usuarioGet", { total, usuarios });
  res.json({
    total,
    usuarios,
  });
};

export const usuarioPut = async (req, res = response) => {
  logEntrada(req, "usuarioPut");
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  // TODO valida contra base de datos
  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  logSalida("usuarioPut", { usuario });
  res.json({
    usuario,
  });
};

export const usuarioPost = async (req, res = response) => {
  logEntrada(req, "usuarioPost");
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({
    nombre,
    correo,
    password,
    rol,
  });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en DB
  await usuario.save();

  logSalida("usuarioPost", { msg: "post Usuario - controlador", usuario });
  res.json({
    msg: "post Usuario - controlador",
    usuario,
  });
};

export const usuarioDelete = async (req, res = response) => {
  logEntrada(req, "usuarioDelete");
  const { id } = req.params;

  // Borrar cambiando estado
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
  const usuarioAutenticado = req.usuario;

  logSalida("usuarioDelete", {
    msg: "El usuario ha sido eliminado con éxito.",
    usuario,
    usuarioAutenticado,
  });
  res.json({
    msg: "El usuario ha sido eliminado con éxito.",
    usuario,
    usuarioAutenticado,
  });
};

export const usuarioPatch = (req, res = response) => {
  logEntrada(req, "usuarioPatch");
  logSalida("usuarioPatch", { msg: "patch Afiliados - controlador" });
  res.json({
    msg: "patch Afiliados - controlador",
  });
};
