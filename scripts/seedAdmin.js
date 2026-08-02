import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import dotenv from 'dotenv';
const NODE_ENV = process.env.NODE_ENV || 'development';
dotenv.config();
dotenv.config({ path: `.env.${NODE_ENV}`, override: true });

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { Role } from '../models/role.js';
import { Usuario } from '../models/usuario.js';

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@democratik.ar';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin.2024!';
const ADMIN_NAME     = 'Administrador';

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_CNN);
  console.log('Conectado a MongoDB');

  // Seed roles
  for (const rol of ['ADMIN_ROLE', 'USER_ROLE']) {
    const exists = await Role.findOne({ rol });
    if (!exists) {
      await new Role({ rol }).save();
      console.log(`Rol creado: ${rol}`);
    }
  }

  // Seed admin
  const existing = await Usuario.findOne({ correo: ADMIN_EMAIL });
  if (existing) {
    console.log(`Admin ya existe: ${ADMIN_EMAIL}`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const salt = bcryptjs.genSaltSync();
  await new Usuario({
    nombre: ADMIN_NAME,
    correo: ADMIN_EMAIL,
    password: bcryptjs.hashSync(ADMIN_PASSWORD, salt),
    rol: 'ADMIN_ROLE',
    estado: true,
  }).save();

  console.log(`Admin creado exitosamente:`);
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => {
  console.error('Error en seed:', err.message);
  process.exit(1);
});
