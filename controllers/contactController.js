import { Consulta } from "../models/consulta.js";
import { sendEmail } from "../services/mailService.js";

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

// Controlador para manejar las consultas de los usuarios
export const enviarConsulta = async (req, res) => {
  logEntrada(req, "enviarConsulta");
  const { nombre, correo, mensaje } = req.body;

  try {
    // 1. Guardar la consulta en la base de datos
    const nuevaConsulta = new Consulta({ nombre, correo, mensaje });
    await nuevaConsulta.save();

    // 2. Preparar el contenido del correo
    const htmlContent = `
      <h1>Nueva consulta de ${nombre}</h1>
      <p><strong>Correo:</strong> ${correo}</p>
      <p><strong>Mensaje:</strong> ${mensaje}</p>
    `;

    // Responder al cliente que el proceso fue exitoso
    logSalida("enviarConsulta", {
      status: 200,
      body: { msg: "Consulta enviada y almacenada correctamente." },
    });
    res.status(200).json({
      msg: "Consulta enviada y almacenada correctamente.",
    });

    // 3. Enviar el correo al soporte en segundo plano
    setImmediate(async () => {
      try {
        await sendEmail(
          "villevip10@gmail.com", // Correo del equipo de soporte
          "Nueva consulta de usuario",
          htmlContent
        );
        console.log("[SALIDA] enviarConsulta", {
          backgroundEmail: "ok",
          to: process.env.EMAIL_USER,
        });
      } catch (error) {
        console.error("Error al enviar el correo:", error);
      }
    });
  } catch (error) {
    console.error("Error al enviar la consulta:", error);
    logSalida("enviarConsulta", {
      status: 500,
      body: { msg: "Hubo un error al enviar la consulta.", error },
    });
    res.status(500).json({
      msg: "Hubo un error al enviar la consulta.",
    });
  }
};

export const obtenerConsultas = async (req = request, res = response) => {
  logEntrada(req, "obtenerConsultas");
  const limite = Math.max(1, Math.min(parseInt(req.query.limite) || 4, 100));
  const desde = Math.max(0, parseInt(req.query.desde) || 0);

  try {
    const [total, mensajes] = await Promise.all([
      Consulta.countDocuments(), // Total de mensajes
      Consulta.find()
        .sort({ fecha: -1 }) // Ordenar por fecha descendente
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    logSalida("obtenerConsultas", { total, mensajes });
    res.json({
      total,
      mensajes, // Lista paginada de mensajes
    });
  } catch (error) {
    console.error(error);
    logSalida("obtenerConsultas", {
      status: 500,
      body: { msg: "Error al obtener las consultas", error },
    });
    res.status(500).json({
      msg: "Error al obtener las consultas",
    });
  }
};
