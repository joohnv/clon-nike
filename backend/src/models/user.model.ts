import mongoose, { Schema } from "mongoose";
import { userInterface } from "../interfaces/user.interface";

const userSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },  
    role: { type: String, required: true, default: 'user' },  
  });


  const User = mongoose.model<userInterface>('User', userSchema);

  export default User;