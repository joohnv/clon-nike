import { Document } from "mongoose";

export interface userInterface extends Document{
    username: string;
    email: string;
    password: string;
    role: "admin" | "user";
}