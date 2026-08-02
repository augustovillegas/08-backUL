import { Router } from "express";
import { check } from "express-validator";
import { login, olvidePassword, restablecerPassword } from "../controllers/auth.js";
import { handleValidate } from "../middlewares/handleValidate.js";


export const auth = Router();

auth.post('/login', [
    check('correo', 'El correo es obligatorio.').isEmail(),
    check('password', 'La contraseña es obligatoria.').not().isEmpty(),
    handleValidate
], login);

auth.post('/olvide-password', [
    check('correo', 'El correo es obligatorio.').isEmail(),
    handleValidate
], olvidePassword);

auth.post('/restablecer-password', [
    check('token', 'El token es obligatorio.').not().isEmpty(),
    check('password', 'La contraseña debe tener al menos 6 caracteres.').isLength({ min: 6 }),
    handleValidate
], restablecerPassword);
