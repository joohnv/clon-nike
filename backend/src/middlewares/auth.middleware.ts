import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { userInterface } from "../interfaces/user.interface";
import User from "../models/user.model";

const bcrypt = require('bcryptjs');

// Extender la interfaz Request de Express para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: userInterface;
    }
  }
}

// Middleware para verificar que es valido el usuario
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Acceso no autorizado" });
      return; 
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { _id: string };
    
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      res.status(401).json({ message: "Usuario no encontrado o eliminado" });
      return; 
    }

    req.user = user; 
    next(); 
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

// Middleware para verificar que el usuario está autenticado
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Permiso denegado" });
    return; 
  }

  next(); 
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está en uso.' });
    }

    // Crear un nuevo usuario con rol 'user'
    const hashedPassword = await bcrypt.hash(password, 10); // Encriptamos la contraseña

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user' // Asignamos 'user' como rol
    });

    await newUser.save(); // Guardamos al usuario en la base de datos

    // Respondemos con el usuario registrado
    return res.status(201).json({ user: newUser, message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Hubo un error al registrar al usuario.' });
  }
};