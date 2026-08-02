import { response } from "express";
import os from "os";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import { Afiliado } from "../models/afiliado.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

export const afiliadoGet = async (req = request, res = response) => {
  logEntrada(req, "afiliadoGet");
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true }; // Filtrar solo los afiliados activos

  try {
    const [total, afiliados] = await Promise.all([
      Afiliado.countDocuments(), //total de afiliados
      Afiliado.find()
        .sort({ fecha: -1 }) // Ordenar por fecha descendente
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    logSalida("afiliadoGet", { msg: "Afiliados de DB:", total, afiliados });
    res.json({
      msg: "Afiliados de DB:",
      total,
      afiliados,
    });
  } catch (error) {
    console.error(error);
    logSalida("afiliadoGet", {
      status: 500,
      body: { msg: "Error al obtener los afiliados", error },
    });
    res.status(500).json({
      msg: "Error al obtener los afiliados",
      error,
    });
  }
};

export const afiliadoGetById = async (req = request, res = response) => {
  logEntrada(req, "afiliadoGetById");
  const { id } = req.params;

  try {
    const afiliado = await Afiliado.findById(id);

    if (!afiliado) {
      logSalida("afiliadoGetById", {
        status: 404,
        body: { msg: `No se encontró un afiliado con el ID: ${id}` },
      });
      return res.status(404).json({
        msg: `No se encontró un afiliado con el ID: ${id}`,
      });
    }

    logSalida("afiliadoGetById", { msg: "Afiliado encontrado:", afiliado });
    res.json({
      msg: "Afiliado encontrado:",
      afiliado,
    });
  } catch (error) {
    console.error(error);
    logSalida("afiliadoGetById", {
      status: 500,
      body: { msg: "Error al obtener el afiliado", error },
    });
    res.status(500).json({
      msg: "Error al obtener el afiliado",
      error,
    });
  }
};

export const afiliadoPost = async (req, res = response) => {
  logEntrada(req, "afiliadoPost");
  try {
    // Verificar el contenido recibido
    console.log("Cuerpo de la solicitud:", req.body);
    console.log("Archivos recibidos:", req.files);

    const {
      nombre,
      dni,
      correo,
      fechaNacimiento,
      domicilio,
      celular,
      ocupacion,
      estadoCivil,
      pais,
      provincia,
      departamento,
      firma, // Firma en Base64
    } = req.body;

    // Verificar si ya existe un afiliado con el DNI proporcionado
    const afiliadoDB = await Afiliado.findOne({ dni });
    if (afiliadoDB) {
      logSalida("afiliadoPost", {
        status: 400,
        body: { msg: `El usuario con DNI: ${dni} ya se encuentra registrado.` },
      });
      return res.status(400).json({
        msg: `El usuario con DNI: ${dni} ya se encuentra registrado.`,
      });
    }

    // Carpeta base: afiliados/<nombre_dni>
    const nombreNorm = nombre
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "_");
    const folderBase = `afiliados/${nombreNorm}_${dni}`;

    // Metadatos y tags comunes a todas las imágenes de este afiliado
    const fechaRegistro = new Date().toISOString().split("T")[0];
    const cloudinaryTags = [dni, provincia || pais, ocupacion, "afiliado"].filter(Boolean);
    const cloudinaryContext = `nombre=${nombre}|dni=${dni}|correo=${correo}|provincia=${provincia || ""}|fecha=${fechaRegistro}`;

    // Opciones base de optimización
    const baseOptions = {
      quality: "auto",
      fetch_format: "auto",
      tags: cloudinaryTags,
      context: cloudinaryContext,
    };

    // Subir fotos del DNI
    let fotosDniUrls = [];
    if (req.files) {
      let dniIndex = 1;
      for (const key in req.files) {
        if (key.startsWith("fotoDni")) {
          const { tempFilePath } = req.files[key];
          const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
            ...baseOptions,
            folder: `${folderBase}/dni`,
            public_id: `dni_${dniIndex}`,
            overwrite: true,
          });
          fotosDniUrls.push(secure_url);
          dniIndex++;
        }
      }
    }

    // Subir firma
    let firmaUrl = "";
    if (firma && firma !== "null") {
      try {
        const tempDir = os.tmpdir();
        const tempFirmaPath = path.join(tempDir, `firma-${Date.now()}.png`);
        const base64Data = firma.replace(/^data:image\/png;base64,/, "");
        fs.writeFileSync(tempFirmaPath, base64Data, "base64");

        const { secure_url } = await cloudinary.uploader.upload(tempFirmaPath, {
          ...baseOptions,
          folder: `${folderBase}/firma`,
          public_id: "firma",
          overwrite: true,
        });
        firmaUrl = secure_url;

        fs.unlink(tempFirmaPath, (err) => {
          if (err) console.error("Error al eliminar archivo temporal:", err);
        });
      } catch (err) {
        console.error("Error al procesar la firma base64:", err);
        return res.status(400).json({ msg: "Firma no válida, por favor intenta nuevamente." });
      }
    }

    // Guardar nuevo afiliado con la firma y fotos subidas
    const afiliado = new Afiliado({
      nombre,
      dni,
      correo,
      fechaNacimiento,
      domicilio,
      celular,
      ocupacion,
      estadoCivil,
      pais,
      provincia,
      departamento,
      firma: firmaUrl, // URL de la firma subida
      fotosDni: fotosDniUrls, // URLs de las fotos del DNI subidas
    });

    // Guardar en la base de datos
    await afiliado.save();

    logSalida("afiliadoPost", {
      status: 201,
      body: { msg: "Afiliado creado exitosamente.", afiliado },
    });
    res.status(201).json({
      msg: "Afiliado creado exitosamente.",
      afiliado,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ msg: messages.join(" ") });
    }
    logSalida("afiliadoPost", { status: 500, body: { msg: "Error al crear el afiliado." } });
    res.status(500).json({ msg: "Error al crear el afiliado." });
  }
};
