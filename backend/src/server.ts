import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import path from "path";
import dotenv from 'dotenv';

//importar rutas
import userRouter  from './routes/user.route';
import productRouter from "./routes/product.route";

//cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use(cors());

//servir imagenes desde la carpeta public/images
app.use('/images', express.static(path.join(__dirname, '..', 'public/images')));

// Conectar a MongoDB usando la variable de entorno
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error de conexión:', err));

// Rutas
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});