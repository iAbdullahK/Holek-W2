import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { serverTimestamp, getDoc, doc, addDoc, collection, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { Product, Store } from '../../../../types-db';

interface Params {
    storeId: string;
    orderId: string;
}

export const POST = async (req: NextRequest, { params }: { params: Params }) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Un-Authorized!!", { status: 401 });
        }

        const { storeId } = params;

        const body = await req.json();

        const { name, price, cal, image, category, qty } = body;

        if (!name || !price || !image || !category || !qty) {
            return new NextResponse("Required fields are missing!", { status: 400 });
        }

        if (!storeId) {
            return new NextResponse("Store ID is missing!", { status: 400 });
        }

        const storeDoc = await getDoc(doc(db, "stores", storeId));

        if (!storeDoc.exists()) {
            return new NextResponse("Store not found!", { status: 404 });
        }

        const storeData = storeDoc.data();
        if (storeData?.userId !== userId) {
            return new NextResponse("Un-Authorized Access!", { status: 403 });
        }

        const productData = {
            name,
            price,
            cal,
            image,
            qty,
            category,
            createdAt: serverTimestamp(),
        };

        const productRef = await addDoc(collection(db, "stores", storeId, "products"), productData);
        const id = productRef.id;

        await updateDoc(doc(db, "stores", storeId, "products", id), {
            ...productData,
            id,
            storeName: storeData.name,
            storeId: storeData.id,
            updatedAt: serverTimestamp(),
        });

        return new NextResponse(JSON.stringify({ id, ...productData }), { status: 200 });
    } catch (error) {
        console.error(`Error processing POST request: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const GET = async (req: NextRequest, { params }: { params: Params }) => {
    try {
        if (!params.storeId) {
            return new NextResponse("Store ID is missing!", { status: 402 });
        }
        
        const productData = (
            await getDocs(collection(doc(db, "stores", params.storeId), "products"))
        ).docs.map(doc => doc.data()) as Product[];

        return new NextResponse(JSON.stringify(productData), { status: 200 });
    } catch (error) {
        console.error(`Error processing GET request: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};