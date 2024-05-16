import { Timestamp } from "firebase/firestore";

export interface store {
    id : string;
    name : string;
    userId : string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface Billboards {
    id: string,
    label: string, 
    imageUrl: string,
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface Category {
    id: string,
    billboardId: string, 
    billboardLabel: string,
    name: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface Product{
    id: string,
    name: string,
    price: number,
    qty : number,
    image: string,
    category: string,
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface Order{
    id: string,
    isPaid: string,
    phone: string,
    orderItems: Product[],
    order_status: string,
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}


