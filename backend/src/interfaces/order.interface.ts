import mongoose , { Document } from "mongoose";

export interface orderInterface extends Document{
    user: mongoose.Schema.Types.ObjectId;
    
    products: Array<{
      product: mongoose.Schema.Types.ObjectId;
      quantity: number;
      price: number;
    }>;

    totalAmount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}