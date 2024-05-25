import { NextResponse } from "../../../node_modules/next/server";
import { auth } from "@clerk/nextjs/server";
import { getFirestore, serverTimestamp, addDoc, collection, updateDoc, doc } from "firebase/firestore";

import { db } from "../../../lib/firebase";

export const POST = async (req: Request) => {
    try {
        
        const { userId } = auth();
        
        // Check if the user is authenticated
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        // Check if the 'name' field is provided
        if (!name) {
            return new NextResponse("Store name is missing", { status: 400 });
        }


        // Create store data object
        const storeData = {
            name,
            userId,
            createdAt: serverTimestamp(),
        };

        // Add data to Firestore
        const storeRef = await addDoc(collection(db, "stores"), storeData);
        const id = storeRef.id;

        // Update document with additional data
        await updateDoc(doc(db, "stores", id), {
            ...storeData,
            id,
            updatedAt: serverTimestamp(),
        });

        // Return success response
        return new NextResponse(JSON.stringify({ id, ...storeData }), { status: 200 });
    } catch (error) {
        // Log error
        console.error(`Error processing POST request: ${error}`);

        // Return error response
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};