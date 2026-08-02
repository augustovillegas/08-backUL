import dotenv from 'dotenv';
const NODE_ENV = process.env.NODE_ENV || 'development';
dotenv.config();
dotenv.config({ path: `.env.${NODE_ENV}`, override: true });

import {Server} from './models/server.js';




//creacion instancia del servidor
const server = new Server();





//levantando servidor
server.listen();
