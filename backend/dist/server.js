"use strict";
//server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3000;
//middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//servir las img de los productos
app.use("/images", express_1.default.static("public/images"));
//ruta para obtener la lista de productos (GET)
app.get("/products", (req, res) => {
    const products = [
        { id: 1, name: "Zapatillas Air Max", price: 120, image: "http://localhost:3000/images/air_max.jpg" },
        { id: 2, name: "Zapatillas Blazer", price: 100, image: "http://localhost:3000/images/blazer.jpg" },
        { id: 3, name: "Chaqueta Mujer", price: 150, image: "http://localhost:3000/images/chaqueta_mujer.jpg" },
        { id: 4, name: "Zapatillas Dunk Low", price: 210, image: "http://localhost:3000/images/dunk_low.jpg" },
        { id: 5, name: "Pantalones Jordan", price: 140, image: "http://localhost:3000/images/pantalones_jordan.jpg" },
        { id: 6, name: "Sudadera Negra", price: 80, image: "http://localhost:3000/images/sudadera_negra.jpg" }
    ];
    res.json(products);
});
//iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
