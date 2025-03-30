import mongoose, { Schema} from "mongoose";
import { orderInterface } from "../interfaces/order.interface";

const orderSchema: Schema = new Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Referencia al modelo User
        required: true,
      },
      products: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product", // Referencia al modelo Product
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
      totalAmount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "shipped", "delivered", "canceled"],
        default: "pending",
      },
    },
    { timestamps: true } // Añade automáticamente createdAt y updatedAt
  );
  
  const Order = mongoose.model<orderInterface>("Order", orderSchema);
  
  export default Order;