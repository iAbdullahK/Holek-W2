import { NextResponse } from "../../../../node_modules/next/server";
import { auth } from "@clerk/nextjs/server";
import { updateDoc, doc, getDoc } from 'firebase/firestore';

import { db } from "../../../../lib/firebase";
import { Store } from '../../../../types-db';

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

        const { description } = body;

        // Check if the 'description' field is provided
        if (!description) {
            return new NextResponse("Store description is missing", { status: 400 });
        }

        const docRef = doc(db, "stores", params.storeId);
        await updateDoc(docRef, { description });
        const updatedStore = (await getDoc(docRef)).data() as Store;

        // Return success response with updated store data
        return new NextResponse(JSON.stringify(updatedStore), { status: 200 });
    } catch (error) {
        // Log error
        console.error(`Error processing PATCH request: ${error}`);

        // Return error response
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
