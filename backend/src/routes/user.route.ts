import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { token } from "../JWT/token";

const userRouter = Router();

// Ruta para consultar todos los usuarios
userRouter.get("/", async (req, res): Promise<any> => {
  try {
    const users = await User.find(); // Obtiene todos los usuarios
    res.json(users); // Devuelve la lista de usuarios
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
});

userRouter.post("/login", async (req, res): Promise<any> => {
  const { email, password } = req.body;

  try {
    console.log("Intento de inicio de sesión con:", email, password);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log("Usuario encontrado:", user);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Contraseña incorrecta");
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    console.log("Contraseña correcta, generando token...");
    const tk = token(user.id.toString(), user.role);

    res.json({
      token: tk,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
});

// Ruta de registro
userRouter.post('/register', async (req, res): Promise<any> => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user',  
    });

    await newUser.save();

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario', error: error instanceof Error ? error.message : error });
  }
});

export default userRouter; 
