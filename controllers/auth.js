import { response, request } from "express";
import crypto from "crypto";
import { Usuario } from "../models/usuario.js";
import bcryptjs from 'bcryptjs';
import { generateJWT } from "../helpers/generateJWT.js";
import { sendEmail } from "../services/mailService.js";

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

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

    // Solo el administrador puede acceder al panel
    if( usuario.rol !== 'ADMIN_ROLE' ) {
        logSalida("login", { status: 403, body: { msg: "Acceso restringido." } });
        return res.status(403).json({
            msg: "Acceso restringido."
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

export const olvidePassword = async (req = request, res = response) => {
  logEntrada(req, "olvidePassword");
  const { correo } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ msg: "No existe una cuenta con ese correo." });
    }

    const plainToken = crypto.randomBytes(32).toString("hex");
    usuario.resetToken = hashToken(plainToken);
    usuario.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await usuario.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5174";
    const resetUrl = `${frontendUrl}/login/restablecer-password?token=${plainToken}`;
    const html = `
      <h2>Recuperar contraseña</h2>
      <p>Hola ${usuario.nombre},</p>
      <p>Hacé clic en el siguiente enlace para restablecer tu contraseña. El enlace expira en 1 hora.</p>
      <a href="${resetUrl}" style="background:#27AE60;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;margin:16px 0;">
        Restablecer contraseña
      </a>
      <p>Si no solicitaste este cambio, ignorá este correo.</p>
    `;

    logSalida("olvidePassword", { status: 200, body: { msg: "Instrucciones enviadas." } });
    res.json({ msg: "Instrucciones enviadas al correo." });

    setImmediate(async () => {
      try {
        await sendEmail(correo, "Recuperar contraseña - Democratik", html);
      } catch (err) {
        console.error("[olvidePassword] Error al enviar email:", err.message);
      }
    });
  } catch (error) {
    console.log(error);
    logSalida("olvidePassword", { status: 500 });
    return res.status(500).json({ msg: "ERROR: Hable con el administrador." });
  }
};

export const restablecerPassword = async (req = request, res = response) => {
  logEntrada(req, "restablecerPassword");
  const { token, password } = req.body;

  try {
    const usuario = await Usuario.findOne({
      resetToken: hashToken(token),
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!usuario) {
      return res.status(400).json({ msg: "El enlace es inválido o ya expiró." });
    }

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    usuario.resetToken = undefined;
    usuario.resetTokenExpiry = undefined;
    await usuario.save();

    logSalida("restablecerPassword", { status: 200 });
    res.json({ msg: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.log(error);
    logSalida("restablecerPassword", { status: 500 });
    return res.status(500).json({ msg: "ERROR: Hable con el administrador." });
  }
};
