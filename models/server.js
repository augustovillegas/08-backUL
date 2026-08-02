import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";
import { dbConnection } from "../database/config.js";
import { afiliadoRouter } from "../routes/afiliado.js";
import { uploadRouter } from "../routes/uploads.js";
import { userRouter } from "../routes/usuario.js";
import { auth } from "../routes/auth.js";
import { consultaRouter } from "../routes/consulta.js";
import { exportToExcelRouter } from "../routes/export.js";


export class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.afiliadosPath = "/api/afiliados";
    this.usersPath = "/api/users";
    this.authPath = "/api/auth";
    this.uploadsPath = "/api/uploads";
    this.consultaPath = "/api/consultas"; // NUEVA RUTA
    this.exportToExcelPath = "/api/export"; // NUEVA RUTA
    

    //Conectar a base de datos
    this.conectarDB();

    //Middlewares
    this.middlewares();

    //Rutas de mi aplicacion
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // Security headers
    this.app.use(helmet());

    // CORS
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
    this.app.use(
      cors({
        origin: allowedOrigins.length
          ? (origin, cb) => {
              if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
              cb(new Error(`Origin ${origin} not allowed by CORS`));
            }
          : true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization", "x-token"],
      })
    );

    // Rate limiting — auth endpoints
    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20,
      message: { msg: "Demasiados intentos. Intentá de nuevo en 15 minutos." },
    });
    this.app.use("/api/auth", authLimiter);

    // Lectura y parseo del body
    this.app.use(express.json());

    // Lectura y parseo del body con límite de tamaño aumentado
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ limit: "10mb", extended: true }));

    // Directorio publico
    this.app.use(express.static("public"));

    // File uploads - carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    // Ruta de autenticacion
    this.app.use(this.authPath, auth);
    // Ruta de afiliados
    this.app.use(this.afiliadosPath, afiliadoRouter);
    // Ruta de usuarios
    this.app.use(this.usersPath, userRouter);
    // Ruta de uploads
    this.app.use(this.uploadsPath, uploadRouter);
    // Ruta de consultas (Nueva)
    this.app.use(this.consultaPath, consultaRouter); // NUEVA RUTA
    // Ruta de export Excel (Nueva)
    this.app.use(this.exportToExcelPath, exportToExcelRouter); // NUEVA RUTA
  }

  listen() {
    console.log("##########################");
    console.log("######## API REST ########");
    console.log("##########################");
    console.log(`http://localhost:${this.port}/`);
    this.app.listen(this.port);
  }
}
