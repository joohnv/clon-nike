import {Document} from "mongoose";

export interface productInterface extends Document{
    name:string;
    description:string;
    price:number;
    stock:number;
    image: string;
}