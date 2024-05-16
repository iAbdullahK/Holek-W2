import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { serverTimestamp, getDoc, doc, addDoc, collection, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types-db';

export const POST = async (req, { params }: { params: { storeId: string } }) => {
    try {
        const { userId } = auth();
        const body = await req.json();

        if (!userId) {
            return new NextResponse("Un-Authorized!!", { status: 405 });
        }

        const { name, price, image, category, qty } = body;

        if (!name || !price || !image || !category || !qty) {
            return new NextResponse("Required fields are missing!", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is missing!", { status: 405 });
        }

        const store = await getDoc(doc(db, "stores", params.storeId));

        if (!store.exists()) {
            return new NextResponse("Store not found!", { status: 404 });
        }

        const storeData = store.data();
        if (storeData?.userId !== userId) {
            return new NextResponse("Un-Authorized Access!", { status: 401 });
        }

        const productData = {
            name,
            price,
            image,
            qty,
            category,
            createdAt: serverTimestamp(),
        };

        const productRef = await addDoc(collection(db, "stores", params.storeId, "products"), productData);
        const id = productRef.id;

        await updateDoc(doc(db, "stores", params.storeId, "products", id), {
            ...productData,
            id,
            updatedAt: serverTimestamp()
        });

        return new NextResponse(JSON.stringify({ id, ...productData }), { status: 200 });
    } catch (error) {
        console.error(`Error processing POST request: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const GET = async ({ params }: { params: { storeId: string } }) => {
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