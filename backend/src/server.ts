import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();
const PORT = 3000;

// Configuración de multer para guardar las imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Usamos el directorio 'backend/public/images'
        const imagePath = path.join(__dirname, '..', 'public', 'images');
        console.log("Guardando imagen en: " + imagePath);
        cb(null, imagePath);  
    },
    filename: (req, file, cb) => {
        // Usamos un nombre único basado en la fecha
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

// Obtener los productos
let products: Array<any> = [];

// Servir las imágenes estáticas desde la carpeta 'public/images' en 'backend'
app.use("/images", express.static(path.join(__dirname, '..', 'public', 'images')));

// Manejo de errores de multer
app.use((err: any, req: any, res: any, next: any) => {
    if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: err.message });
    }
    if (err) {
        return res.status(500).json({ message: err.message });
    }
    next();
});

// Middleware de logging para ver las rutas solicitadas
app.use((req, res, next) => {
    console.log(`Request for: ${req.url}`);
    next();
});

// Ruta para subir los productos
app.post("/products", upload.single("image"), (req, res) => {
    if (req.file) {
        console.log(`Imagen subida: ${req.file.filename}`);
    } else {
        console.log("No se subió ninguna imagen.");
    }

    const { name, price, desc, type } = req.body; // Recibir los atributos del producto
    const image = req.file ? `/images/${req.file.filename}` : ""; // Asignar la ruta a la imagen

    const newProduct = { id: Date.now(), name, price, desc, type, image };
    products.push(newProduct); // Agregar el nuevo producto al array

    res.status(201).json(newProduct); // Devolver el producto agregado
});

// Ruta para obtener los productos agregados
app.get("/products", (req, res) => {
    res.json(products);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
