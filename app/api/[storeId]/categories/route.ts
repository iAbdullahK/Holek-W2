import { NextResponse } from '../../../../node_modules/next/server';
import { auth } from '@clerk/nextjs/server';
import { serverTimestamp, getDoc, doc, addDoc, collection, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { Billboards } from '../../../../types-db';
import { Category } from '../../../../types-db';

export const POST = async (req: Request, { params }: { params: { storeId: string } }) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Un-Authorized!!", { status: 405 });
        }

        const body = await req.json();
        const { name, billboardLabel, billboardId } = body;

        if (!name) {
            return new NextResponse("Category name is missing!", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("Billboard is missing!", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is missing!", { status: 402 });
        }

        const store = await getDoc(doc(db, "stores", params.storeId));

        if (!store.exists()) {
            return new NextResponse("Store not found!", { status: 404 });
        }

        const storeData = store.data();
        if (storeData.userId !== userId) {
            return new NextResponse("Un-Authorized Access!", { status: 403 });
        }

        const categoryData = {
            name,
            billboardId,
            billboardLabel,
        };

        const categoryRef = await addDoc(collection(db, "stores", params.storeId, "categories"), categoryData);
        const id = categoryRef.id;

        await updateDoc(doc(db, "stores", params.storeId, "categories", id), {
            ...categoryData,
            id,
            updatedAt: serverTimestamp(),
        });

        return NextResponse.json({ id, ...categoryData });
    } catch (error) {
        console.error(`Error processing POST request: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
    try {
        if (!params.storeId) {
            return new NextResponse("Store ID is missing!", { status: 402 });
        }

        const categoriesSnapshot = await getDocs(collection(doc(db, "stores", params.storeId), "categories"));
        const categoriesData = categoriesSnapshot.docs.map(doc => doc.data()) as Category[];

        return NextResponse.json(categoriesData);
    } catch (error) {
        console.error(`Error processing GET request: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};