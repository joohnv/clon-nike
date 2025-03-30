import mongoose, { Schema } from "mongoose";
import { productInterface } from "../interfaces/product.interface";

const productSchema: Schema = new Schema({
    name: {type:String, required:true},
    desc: {type:String, required:true},
    price: {type:Number, required:true},
    stock: {type:Number, required:true},
    image: {type:String, required:true}
});

const Product = mongoose.model<productInterface>('Product', productSchema);

export default Product;