<div align="center">

# 🧩 Democratik - Herramienta de gestion politica

Servidor backend para Democratik. API REST en Node.js + Express con MongoDB, JWT, subida de archivos, envio de emails y exportacion a Excel.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-3c873a?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8.x-800000?style=flat)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Storage-3448c5?style=flat&logo=cloudinary&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-Email-1f2937?style=flat)
![ExcelJS](https://img.shields.io/badge/ExcelJS-Reportes-0b6?style=flat)

**Demo:** (pendiente) • **API Docs:** (pendiente) • **Changelog:** (pendiente)

[Descripcion](#-descripcion) • [Stack](#-stack-tecnologico) • [Endpoints](#-api-integration--endpoints) • [Variables de entorno](#-variables-de-entorno) • [Deployment](#-deployment)

</div>

---

## 📚 Tabla de Contenidos
1. [Descripcion](#-descripcion)
2. [Caracteristicas](#-caracteristicas)
3. [Stack Tecnologico](#-stack-tecnologico)
4. [Inicio Rapido](#-inicio-rapido)
5. [Arquitectura](#-arquitectura)
6. [Estructura del Proyecto](#-estructura-del-proyecto)
7. [Componentes / Modulos Principales](#-componentes--modulos-principales)
8. [Validaciones](#-validaciones)
9. [API Integration / Endpoints](#-api-integration--endpoints)
10. [Scripts Disponibles](#-scripts-disponibles)
11. [Variables de Entorno](#-variables-de-entorno)
12. [Deployment](#-deployment)
13. [Guias de Uso](#-guias-de-uso)
14. [Personalizacion / Extension](#-personalizacion--extension)
15. [Contribuciones](#-contribuciones)
16. [Licencia](#-licencia)

---

## 🧾 Descripcion
Backend legacy para gestion de usuarios, afiliados y consultas, con integraciones a MongoDB, Cloudinary y SMTP. Esta API expone endpoints REST para autenticar usuarios, registrar afiliados, subir archivos, enviar emails y exportar listados a Excel.

**Problema que resuelve:** centralizar operaciones administrativas y registrar informacion de usuarios/afiliados con auditoria basica mediante logs.

**Para quien es:** equipo de soporte y administracion.

**Tipo de aplicacion:** API REST backend monolitica.

---

## ✅ Caracteristicas
- ✅ Autenticacion con JWT
- ✅ CRUD basico de usuarios
- ✅ Registro de afiliados con firma y documentos
- ✅ Subida de imagenes (local y Cloudinary)
- ✅ Consultas con persistencia y envio de email en segundo plano
- ✅ Exportacion a Excel
- ✅ Logs de entrada/salida en controladores

---

## 🧠 Stack Tecnologico
| Tecnologia | Proposito |
| --- | --- |
| Node.js | Runtime |
| Express | Framework HTTP |
| MongoDB Atlas | Base de datos |
| Mongoose | ODM |
| JWT | Autenticacion |
| bcryptjs | Hash de passwords |
| express-validator | Validaciones |
| express-fileupload | Uploads |
| Cloudinary | Storage de imagenes |
| Nodemailer | Envio de correos |
| ExcelJS | Exportacion a Excel |

---

## 🚀 Inicio Rapido
**Prerrequisitos**
- Node.js 18+ (recomendado)
- MongoDB Atlas (o instancia compatible)
- Credenciales SMTP/Cloudinary

**Instalacion**
```bash
yarn install
```

**Ejecucion**
```bash
yarn start
```

---

## 🧱 Arquitectura
**Patrones utilizados**
- MVC simplificado (routes -> controllers -> models)
- Servicios para integraciones externas (email)
- Helpers y middlewares para validaciones y utilidades

**Flujo de datos (ASCII)**
```
Cliente
  |
  v
Routes (Express)
  |
  v
Controllers
  |---> Models (MongoDB)
  |---> Services (Email)
  |---> Helpers/Middlewares
  |
  v
Response
```

---

## 🗂️ Estructura del Proyecto
```
app.js                      # entrypoint
controllers/                # logica de negocio por dominio
database/                   # conexion y configuracion MongoDB
helpers/                    # utilidades (JWT, uploads, validaciones)
middlewares/                # validaciones y autenticacion
models/                     # modelos Mongoose
routes/                     # definicion de rutas
services/                   # integraciones externas (email)
public/                     # contenido estatico
assets/                     # assets locales
```

---

## 🧩 Componentes / Modulos Principales
- **controllers**: `auth`, `usuario`, `afiliado`, `uploads`, `export`, `contactController`
- **routes**: `auth`, `usuario`, `afiliado`, `uploads`, `consulta`, `export`
- **models**: `Usuario`, `Afiliado`, `Consulta`, `Role`
- **middlewares**: JWT, roles, validacion de archivo, validaciones de input
- **services**: envio de email via SMTP
- **helpers**: JWT, validaciones DB, uploads, manejo de archivos

---

## 🧪 Validaciones
- **express-validator** para inputs en rutas de usuarios y auth.
- **validateJWT** para proteger endpoints sensibles (ej. delete usuario).
- **validateRole / multiRole** para permisos por rol.
- **validateFile** para asegurar presencia de archivos en uploads.

---

## 🔌 API Integration / Endpoints
**Base URL:** `http://localhost:PORT`

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | No | Login y generacion de JWT |
| GET | `/api/users` | No | Listado paginado de usuarios |
| POST | `/api/users` | No | Crear usuario |
| PUT | `/api/users/:id` | No | Actualizar usuario |
| DELETE | `/api/users/:id` | Si (JWT + rol) | Baja logica de usuario |
| GET | `/api/afiliados` | No | Listado de afiliados |
| GET | `/api/afiliados/:id` | No | Detalle de afiliado |
| POST | `/api/afiliados` | No | Crear afiliado |
| POST | `/api/uploads` | No | Subir archivo |
| PUT | `/api/uploads/:coleccion/:id` | No | Actualizar imagen (Cloudinary) |
| GET | `/api/uploads/:coleccion/:id` | No | Obtener imagen |
| POST | `/api/consultas` | No | Crear consulta (email en background) |
| GET | `/api/consultas` | No | Listado de consultas |
| GET | `/api/export` | No | Exportar afiliados a Excel |

**Modelos de datos (simplificados)**
```json
// Usuario
{
  "nombre": "string",
  "correo": "string",
  "password": "string",
  "rol": "string",
  "estado": true
}

// Afiliado
{
  "nombre": "string",
  "dni": "string",
  "correo": "string",
  "fechaNacimiento": "YYYY-MM-DD",
  "domicilio": "string",
  "celular": "string",
  "ocupacion": "string",
  "estadoCivil": "string",
  "pais": "string",
  "provincia": "string",
  "departamento": "string",
  "firma": "data:image/png;base64,...",
  "fotosDni": ["https://..."]
}

// Consulta
{
  "nombre": "string",
  "correo": "string",
  "mensaje": "string"
}
```

---

## 🧰 Scripts Disponibles
| Script | Descripcion |
| --- | --- |
| `yarn start` | Inicia el servidor con Node |

---

## 🔐 Variables de Entorno
**No incluir valores reales.** Ejemplo de `.env` con placeholders:
```bash
PORT=3000
MONGODB_CNN=mongodb+srv://USER:PASS@HOST/DB
SECRETORPRIVATEKEY=your_jwt_secret

EMAIL_USER=correo@dominio.com
EMAIL_PASS=app_password_o_token

CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=api_secret

API_KEY_RESEND=api_key_resend
GOOGLE_CLIENTE_ID=google_client_id
GOOGLE_SECRET_ID=google_secret_id
```

| Variable | Descripcion |
| --- | --- |
| `PORT` | Puerto de escucha |
| `MONGODB_CNN` | Conexion a MongoDB |
| `SECRETORPRIVATEKEY` | Firma de JWT |
| `EMAIL_USER` | Usuario SMTP |
| `EMAIL_PASS` | Password o token SMTP |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud |
| `CLOUDINARY_API_KEY` | API key Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret Cloudinary |
| `API_KEY_RESEND` | API key Resend (no usado) |
| `GOOGLE_CLIENTE_ID` | OAuth client id (si aplica) |
| `GOOGLE_SECRET_ID` | OAuth secret (si aplica) |

---

## 🚢 Deployment
**Servicio recomendado:** Render o Railway

**Pasos generales**
1. Configurar variables de entorno en el panel del proveedor.
2. Usar `yarn install` y `yarn start`.
3. Configurar el puerto con `PORT`.

**Configuracion ejemplo**
```bash
START_COMMAND=yarn start
NODE_ENV=production
```

<details>
<summary>Notas de SMTP (Gmail)</summary>

- Usar App Password si la cuenta tiene 2FA.
- Verificar que `EMAIL_USER`/`EMAIL_PASS` esten definidos en el entorno productivo.

</details>

---

## 🧭 Guias de Uso
**Flujo: Login**
1. `POST /api/auth/login` con correo y password.
2. Usar el token JWT para endpoints protegidos.

**Flujo: Crear afiliado**
1. `POST /api/afiliados` con datos personales y firma en base64.
2. Adjuntar `fotoDni*` si se requiere.

**Flujo: Exportar**
1. `GET /api/export`.
2. Recibir archivo `.xlsx`.

---

## 🛠️ Personalizacion / Extension
- Integrar `resend` como proveedor alternativo de email.
- Agregar colas (Bull/Agenda) para envios asincronos.
- Incluir rate limiting para endpoints publicos.
- Versionar la API (`/api/v1`).

---

## 🤝 Contribuciones
1. Crear un branch desde `main`.
2. Enviar PR con descripcion clara.
3. Incluir pruebas o pasos de verificacion si aplica.

---

## 📄 Licencia
MIT

---

<div align="center">

Hecho con foco en mantenibilidad y trazabilidad.  
[Volver arriba](#-democratik---herramienta-de-gestion-politica)

</div>
