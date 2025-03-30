import { Router } from "express";
import Product from "../models/product.model";
import upload from "../middlewares/upload.middleware";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware";

const productRouter = Router();

// Ruta para crear un producto (solo admin)
productRouter.post(
  "/",
  isAuthenticated,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, desc, price, stock } = req.body;
      const imageUrl = req.file ? `/images/${req.file.filename}` : null;

      const newProduct = new Product({
        name,
        desc,
        price,
        stock,
        image: imageUrl,
      });

      await newProduct.save();
      res.json({
        message: "Producto creado exitosamente",
        product: newProduct,
      });
    } catch (error) {
      res.status(500).json({ message: "Error al crear el producto", error });
    }
  }
);

// Ruta para editar un producto (solo admin)
productRouter.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, desc, price, stock } = req.body;
      const imageUrl = req.file ? `/images/${req.file.filename}` : undefined;

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, desc, price, stock, ...(imageUrl ? { image: imageUrl } : {}) },
        { new: true }
      );

      if (!updatedProduct) {
        res.status(404).json({ message: "Producto no encontrado" });
        return;
      }

      res.json({ message: "Producto actualizado", product: updatedProduct });
    } catch (error) {
      next(error);
    }
  }
);

// Endpoint para que cualquier usuario pueda modificar SOLO el stock
productRouter.put("/:id/update-stock", async (req, res) => {
  try {
    
    console.log("🔹 Datos recibidos en req.body:", req.body);
    const { stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
      return; // 
    }

    product.stock = stock;
    await product.save();

    res.json({ message: "Stock actualizado", product }); 
  } catch (error) {
    console.error("ERROR en update-stock:", error);
    res.status(500).json({ message: "Error al actualizar el stock" });
  }
});

// Ruta para eliminar un producto (solo admin)
productRouter.delete(
  "/:id",
  isAuthenticated,
  isAdmin,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        res.status(404).json({ message: "Producto no encontrado" });
        return;
      }

      res.json({ message: "Producto eliminado" });
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para obtener todos los productos (accesible para todos)
productRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos", error });
  }
});

export default productRouter;
