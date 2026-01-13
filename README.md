# Backend Server

<div style="border:1px solid #1e3a8a;padding:12px;border-radius:8px;background:#eff6ff">
  <strong style="color:#1e3a8a">Resumen</strong><br/>
  API REST en Node.js + Express con MongoDB (Mongoose), autenticacion JWT, subida de archivos, envio de correos, y exportacion de datos a Excel.
</div>

<div style="margin-top:10px;border:1px solid #065f46;padding:12px;border-radius:8px;background:#ecfdf3">
  <strong style="color:#065f46">Estado</strong><br/>
  Proyecto legacy mantenido, con flujos de registros y controladores separados por dominio.
</div>

## Indice
- Descripcion
- Stack y dependencias
- Servicios externos
- Dependencias y versiones
- Estructura del proyecto
- Variables de entorno
- Ejecucion local
- Endpoints principales
- Ejemplos de requests y responses
- Logs y trazabilidad

## Descripcion
Servidor backend que expone endpoints para usuarios, autenticacion, afiliados, consultas, subida de archivos y exportacion a Excel. Incluye validaciones, JWT, y almacenamiento en MongoDB.

## Stack y dependencias
<table>
  <tr>
    <th style="text-align:left;background:#111827;color:#f9fafb;padding:6px">Capa</th>
    <th style="text-align:left;background:#111827;color:#f9fafb;padding:6px">Tecnologias</th>
  </tr>
  <tr>
    <td style="padding:6px">API</td>
    <td style="padding:6px">Node.js, Express</td>
  </tr>
  <tr>
    <td style="padding:6px">DB</td>
    <td style="padding:6px">MongoDB, Mongoose</td>
  </tr>
  <tr>
    <td style="padding:6px">Auth</td>
    <td style="padding:6px">JWT, bcryptjs</td>
  </tr>
  <tr>
    <td style="padding:6px">Archivos</td>
    <td style="padding:6px">express-fileupload, Cloudinary</td>
  </tr>
  <tr>
    <td style="padding:6px">Email</td>
    <td style="padding:6px">nodemailer</td>
  </tr>
  <tr>
    <td style="padding:6px">Reportes</td>
    <td style="padding:6px">ExcelJS</td>
  </tr>
</table>

## Servicios externos
<div style="border:1px solid #0b3b2e;padding:12px;border-radius:8px;background:#eaf7f2">
  <strong style="color:#0b3b2e">Integraciones</strong><br/>
  MongoDB Atlas, Cloudinary, SMTP Gmail (via nodemailer). API_KEY_RESEND esta definida para un proveedor alternativo (no usado en el flujo actual).
</div>

## Dependencias y versiones
<table>
  <tr>
    <th style="text-align:left;background:#0f172a;color:#f9fafb;padding:6px">Paquete</th>
    <th style="text-align:left;background:#0f172a;color:#f9fafb;padding:6px">Version</th>
    <th style="text-align:left;background:#0f172a;color:#f9fafb;padding:6px">Uso</th>
  </tr>
  <tr><td style="padding:6px">express</td><td style="padding:6px">^4.21.2</td><td style="padding:6px">Framework HTTP</td></tr>
  <tr><td style="padding:6px">mongoose</td><td style="padding:6px">^8.10.0</td><td style="padding:6px">ODM MongoDB</td></tr>
  <tr><td style="padding:6px">jsonwebtoken</td><td style="padding:6px">^9.0.2</td><td style="padding:6px">JWT</td></tr>
  <tr><td style="padding:6px">bcryptjs</td><td style="padding:6px">^2.4.3</td><td style="padding:6px">Hash de password</td></tr>
  <tr><td style="padding:6px">express-validator</td><td style="padding:6px">^7.2.1</td><td style="padding:6px">Validaciones</td></tr>
  <tr><td style="padding:6px">cors</td><td style="padding:6px">^2.8.5</td><td style="padding:6px">CORS</td></tr>
  <tr><td style="padding:6px">dotenv</td><td style="padding:6px">^16.4.7</td><td style="padding:6px">Env vars</td></tr>
  <tr><td style="padding:6px">express-fileupload</td><td style="padding:6px">^1.5.1</td><td style="padding:6px">Subida de archivos</td></tr>
  <tr><td style="padding:6px">cloudinary</td><td style="padding:6px">^2.4.0</td><td style="padding:6px">Media storage</td></tr>
  <tr><td style="padding:6px">nodemailer</td><td style="padding:6px">^6.10.0</td><td style="padding:6px">Email SMTP</td></tr>
  <tr><td style="padding:6px">exceljs</td><td style="padding:6px">^4.4.0</td><td style="padding:6px">Export Excel</td></tr>
  <tr><td style="padding:6px">uuidv4</td><td style="padding:6px">^6.2.13</td><td style="padding:6px">IDs de archivos</td></tr>
  <tr><td style="padding:6px">resend</td><td style="padding:6px">^4.1.2</td><td style="padding:6px">Email API (no usado)</td></tr>
  <tr><td style="padding:6px">nodemon</td><td style="padding:6px">^3.1.9</td><td style="padding:6px">Dev reload</td></tr>
</table>

## Estructura del proyecto
```
app.js
controllers/
database/
helpers/
middlewares/
models/
routes/
services/
public/
```

## Variables de entorno
No se incluyen valores reales. Definirlas segun el entorno:

```
PORT
MONGODB_CNN
SECRETORPRIVATEKEY
EMAIL_USER
EMAIL_PASS
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
API_KEY_RESEND
GOOGLE_CLIENTE_ID
GOOGLE_SECRET_ID
```

## Ejecucion local
```
yarn install
yarn start
```

## Endpoints principales
<table>
  <tr>
    <th style="text-align:left;background:#4c1d95;color:#f9fafb;padding:6px">Metodo</th>
    <th style="text-align:left;background:#4c1d95;color:#f9fafb;padding:6px">Ruta</th>
    <th style="text-align:left;background:#4c1d95;color:#f9fafb;padding:6px">Descripcion</th>
  </tr>
  <tr>
    <td style="padding:6px">POST</td>
    <td style="padding:6px">/api/auth</td>
    <td style="padding:6px">Login de usuario, devuelve JWT</td>
  </tr>
  <tr>
    <td style="padding:6px">GET</td>
    <td style="padding:6px">/api/users</td>
    <td style="padding:6px">Listado paginado de usuarios</td>
  </tr>
  <tr>
    <td style="padding:6px">POST</td>
    <td style="padding:6px">/api/users</td>
    <td style="padding:6px">Crear usuario</td>
  </tr>
  <tr>
    <td style="padding:6px">PUT</td>
    <td style="padding:6px">/api/users/:id</td>
    <td style="padding:6px">Actualizar usuario</td>
  </tr>
  <tr>
    <td style="padding:6px">DELETE</td>
    <td style="padding:6px">/api/users/:id</td>
    <td style="padding:6px">Baja logica de usuario</td>
  </tr>
  <tr>
    <td style="padding:6px">GET</td>
    <td style="padding:6px">/api/afiliados</td>
    <td style="padding:6px">Listado paginado de afiliados</td>
  </tr>
  <tr>
    <td style="padding:6px">GET</td>
    <td style="padding:6px">/api/afiliados/:id</td>
    <td style="padding:6px">Detalle de afiliado por id</td>
  </tr>
  <tr>
    <td style="padding:6px">POST</td>
    <td style="padding:6px">/api/afiliados</td>
    <td style="padding:6px">Crear afiliado con archivos y firma</td>
  </tr>
  <tr>
    <td style="padding:6px">POST</td>
    <td style="padding:6px">/api/uploads</td>
    <td style="padding:6px">Subida de archivo simple</td>
  </tr>
  <tr>
    <td style="padding:6px">PUT</td>
    <td style="padding:6px">/api/uploads/:coleccion/:id</td>
    <td style="padding:6px">Actualizar imagen (local)</td>
  </tr>
  <tr>
    <td style="padding:6px">PUT</td>
    <td style="padding:6px">/api/uploads/cloudinary/:coleccion/:id</td>
    <td style="padding:6px">Actualizar imagen (Cloudinary)</td>
  </tr>
  <tr>
    <td style="padding:6px">GET</td>
    <td style="padding:6px">/api/uploads/:coleccion/:id</td>
    <td style="padding:6px">Ver imagen de entidad</td>
  </tr>
  <tr>
    <td style="padding:6px">POST</td>
    <td style="padding:6px">/api/consultas</td>
    <td style="padding:6px">Crear consulta y envio de email</td>
  </tr>
  <tr>
    <td style="padding:6px">GET</td>
    <td style="padding:6px">/api/consultas</td>
    <td style="padding:6px">Listado paginado de consultas</td>
  </tr>
  <tr>
    <td style="padding:6px">GET</td>
    <td style="padding:6px">/api/export</td>
    <td style="padding:6px">Exportacion a Excel</td>
  </tr>
</table>

## Ejemplos de requests y responses
<div style="border:1px solid #0f766e;padding:12px;border-radius:8px;background:#f0fdfa">
  <strong style="color:#0f766e">Auth - Login</strong>
</div>

```bash
curl -X POST http://localhost:PORT/api/auth \
  -H "Content-Type: application/json" \
  -d '{"correo":"user@example.com","password":"secret"}'
```

```json
{
  "usuario": {
    "uid": "string",
    "nombre": "string",
    "correo": "string",
    "rol": "string"
  },
  "token": "jwt"
}
```

<div style="border:1px solid #7c2d12;padding:12px;border-radius:8px;background:#fff7ed">
  <strong style="color:#7c2d12">Usuarios - Listado</strong>
</div>

```bash
curl "http://localhost:PORT/api/users?limite=5&desde=0"
```

```json
{
  "total": 0,
  "usuarios": []
}
```

<div style="border:1px solid #1f2937;padding:12px;border-radius:8px;background:#f9fafb">
  <strong style="color:#1f2937">Afiliados - Crear</strong>
</div>

```bash
curl -X POST http://localhost:PORT/api/afiliados \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"string",
    "dni":"string",
    "correo":"string",
    "fechaNacimiento":"YYYY-MM-DD",
    "domicilio":"string",
    "celular":"string",
    "ocupacion":"string",
    "estadoCivil":"string",
    "pais":"string",
    "provincia":"string",
    "departamento":"string",
    "firma":"data:image/png;base64,..."
  }'
```

```json
{
  "msg": "Afiliado creado exitosamente.",
  "afiliado": {
    "id": "string"
  }
}
```

<div style="border:1px solid #0f172a;padding:12px;border-radius:8px;background:#e2e8f0">
  <strong style="color:#0f172a">Consultas - Enviar</strong>
</div>

```bash
curl -X POST http://localhost:PORT/api/consultas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"string","correo":"string","mensaje":"string"}'
```

```json
{
  "msg": "Consulta enviada y almacenada correctamente."
}
```

<div style="border:1px solid #6b21a8;padding:12px;border-radius:8px;background:#faf5ff">
  <strong style="color:#6b21a8">Uploads - Archivo simple</strong>
</div>

```bash
curl -X POST http://localhost:PORT/api/uploads \
  -F "archivo=@/path/archivo.jpg"
```

```json
{
  "nombre": "archivo.jpg"
}
```

<div style="border:1px solid #1f2937;padding:12px;border-radius:8px;background:#f3f4f6">
  <strong style="color:#1f2937">Uploads - Actualizar (Cloudinary)</strong>
</div>

```bash
curl -X PUT http://localhost:PORT/api/uploads/cloudinary/users/USER_ID \
  -F "archivo=@/path/archivo.jpg"
```

```json
{
  "_id": "string",
  "img": "https://res.cloudinary.com/.../image.jpg"
}
```

<div style="border:1px solid #991b1b;padding:12px;border-radius:8px;background:#fef2f2">
  <strong style="color:#991b1b">Errores - Ejemplo 400</strong>
</div>

```json
{
  "msg": "Usuario / Password no son correctos."
}
```

<div style="border:1px solid #7c2d12;padding:12px;border-radius:8px;background:#fff7ed">
  <strong style="color:#7c2d12">Errores - Ejemplo 500</strong>
</div>

```json
{
  "msg": "ERROR: Hable con el administrador."
}
```

<div style="border:1px solid #1d4ed8;padding:12px;border-radius:8px;background:#eff6ff">
  <strong style="color:#1d4ed8">Export - Excel</strong>
</div>

```bash
curl -X GET http://localhost:PORT/api/export -o afiliados.xlsx
```

## Logs y trazabilidad
- Los controladores registran logs de entrada y salida con informacion de request y respuesta.
- El envio de email se ejecuta en segundo plano y reporta el resultado en consola.
