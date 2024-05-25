import { NextResponse } from "../../../node_modules/next/server";
import { auth } from "@clerk/nextjs/server";
import { updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';

import { db } from "../../../lib/firebase";
import { Store } from '../../../types-db';

export const PATCH = async (req: Request, {params} : {params : {storeId: string}}) => {
    try {
        
        const { userId } = auth();
        const body = await req.json();

        // Check if the user is authenticated
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is Required", { status: 402 });
        }

        const { name } = body;

        // Check if the 'name' field is provided
        if (!name) {
            return new NextResponse("Store name is missing", { status: 400 });
        }

        const docRef = doc(db, "stores", params.storeId);
        await updateDoc(docRef, {name});
        const store = (await getDoc(docRef)).data() as Store

        // Return success response
        return new NextResponse(JSON.stringify(store), { status: 200 });
    } catch (error) {
        // Log error
        console.error(`Error processing PATCH request: ${error}`);

        // Return error response
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const DELETE = async (req: Request, {params} : {params : {storeId: string}}) => {
    try {
        
        const { userId } = auth();
        // Check if the user is authenticated
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is Required", { status: 402 });
        }

        const docRef = doc(db, "stores", params.storeId);
        

        await deleteDoc(docRef);
        
        // Return success response
        return NextResponse.json({msg: "Store and all of its sub-collections deleted",});
    } catch (error) {
        // Log error
        console.error(`Error processing PATCH request: ${error}`);

        // Return error response
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};