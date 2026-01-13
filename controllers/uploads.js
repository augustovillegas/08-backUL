import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import { fileURLToPath } from "url";
import { response } from "express";
import { uploadFile } from "../helpers/uploadFile.js";
import { Usuario } from "../models/usuario.js";
import { Afiliado } from "../models/afiliado.js";

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

// Subir imagen
export const uploads = async (req, res = response) => {
  logEntrada(req, "uploads");
  // Subir archivo al servidor
  const nombre = await uploadFile(req.files, undefined, "imgs");

  logSalida("uploads", { nombre });
  res.json({ nombre });
};

// Actualizar imagen
export const updateImage = async (req, res = response) => {
  logEntrada(req, "updateImage");
  const { id, coleccion } = req.params;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  let modelo;

  switch (coleccion) {
    case "users":
      modelo = await Usuario.findById(id);

      if (!modelo) {
        logSalida("updateImage", {
          status: 400,
          body: { msg: `No existe un usuario con el id ${id}.` },
        });
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}.`,
        });
      }

      break;

    default:
      logSalida("updateImage", {
        status: 500,
        body: { msg: "Se me olvidó validar esto" },
      });
      return res.status(500).json({
        msg: "Se me olvidó validar esto",
      });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    // Hay que borrar la imagen del servidor
    const pathImage = path.join(__dirname, "../uploads", coleccion, modelo.img);
    if (fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage);
    }
  }

  const nombre = await uploadFile(req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();

  logSalida("updateImage", { modelo });
  res.json({ modelo });
};

export const updateImageCloudinary = async (req, res = response) => {
  logEntrada(req, "updateImageCloudinary");
  const { id, coleccion } = req.params;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  let modelo;

  switch (coleccion) {
    case "users":
      modelo = await Usuario.findById(id);

      if (!modelo) {
        logSalida("updateImageCloudinary", {
          status: 400,
          body: { msg: `No existe un usuario con el id ${id}.` },
        });
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}.`,
        });
      }

      break;

    default:
      logSalida("updateImageCloudinary", {
        status: 500,
        body: { msg: "Se me olvidó validar esto" },
      });
      return res.status(500).json({
        msg: "Se me olvidó validar esto",
      });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  modelo.img = secure_url;

  await modelo.save();

  logSalida("updateImageCloudinary", modelo);
  res.json(modelo);
};

// Mostrar imagen

export const showImage = async (req, response = response) => {
  logEntrada(req, "showImage");
  const { id, coleccion } = req.params;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  let modelo;

  switch (coleccion) {
    case "users":
      modelo = await Usuario.findById(id);

      if (!modelo) {
        logSalida("showImage", {
          status: 400,
          body: { msg: `No existe un usuario con el id ${id}.` },
        });
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}.`,
        });
      }

      break;

    case "afiliado":
      modelo = await Afiliado.findById(id);

      if (!modelo) {
        logSalida("showImage", {
          status: 400,
          body: { msg: `No existe un afiliado con el id ${id}.` },
        });
        return res.status(400).json({
          msg: `No existe un afiliado con el id ${id}.`,
        });
      }

      break;

    default:
      logSalida("showImage", {
        status: 500,
        body: { msg: "Se me olvidó validar esto" },
      });
      return res.status(500).json({
        msg: "Se me olvidó validar esto",
      });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    // Hay que borrar la imagen del servidor
    const pathImage = path.join(__dirname, "../uploads", coleccion, modelo.img);
    if (fs.existsSync(pathImage)) {
      logSalida("showImage", { file: pathImage });
      return res.sendFile(pathFile);
    }
  }

  const pathImage = path.join(__dirname, "../assets/no-image.jpg");
  logSalida("showImage", { file: pathImage });
  res.sendFile(pathImage);
};
