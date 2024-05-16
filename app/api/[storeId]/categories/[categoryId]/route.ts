import { NextResponse } from '@/node_modules/next/server';
import { auth } from '@clerk/nextjs/server';
import { serverTimestamp, getDoc, doc, addDoc, collection, updateDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/types-db';


export const PATCH = async (req : Request,
    {params} : {params : {storeId : string, categoryId : string}}
    ) => {
        try {
        
            const { userId } = auth();
            const body = await req.json();
    
            if (!userId) {
                return new NextResponse("Un-Authorized!!", { status: 405 });
            }

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

            const store = await getDoc(doc(db, "stores", params.storeId))

            if(store.exists()){
                let storeData = store.data()
                if(storeData?.userId !== userId) {
                    return new NextResponse("Un-Authorized Access!", {status: 500})
                }
            }

            const categoryRef = await getDoc(
                doc(db, "stores", params.storeId, "categories", params.categoryId)
            )

            if(categoryRef.exists()){
                await updateDoc(
                    doc(db, "stores", params.storeId, "categories", params.categoryId), {
                        ...categoryRef.data(),
                        name,
                        billboardId,
                        billboardLabel,
                        updatedAt: serverTimestamp(),
                    }
                )
            }else{
                return new NextResponse("Category Not Found", {status : 400})
            }

            const Category = (
                await getDoc(
                    doc(db, "stores", params.storeId, "categories", params.categoryId)
                )
            ).data() as Category
            return NextResponse.json(Category)
        } catch (error) {
            console.error(`Error processing PATCH request: ${error}`);
            return new NextResponse("Internal Server Error", { status: 500 });
        }
    };

    export const DELETE = async (req : Request,
        {params} : {params : {storeId : string, categoryId : string}}
        ) => {
            try {
            
                const { userId } = auth();
        
                if (!userId) {
                    return new NextResponse("Un-Authorized!!", { status: 405 });
                }

                if (!params.storeId) {
                    return new NextResponse("Store ID is missing!", { status: 402 });
                }
                if (!params.categoryId) {
                    return new NextResponse("Category ID is missing!", { status: 402 });
                }
    
                const store = await getDoc(doc(db, "stores", params.storeId))
    
                if(store.exists()){
                    let storeData = store.data()
                    if(storeData?.userId !== userId) {
                        return new NextResponse("Un-Authorized Access!", {status: 500})
                    }
                }
    
                const CategoryRef = await doc(db, "stores", params.storeId, "categories", params.categoryId);
    
                await deleteDoc(CategoryRef)

                
                return NextResponse.json({msg: "Category Deleted" });
            } catch (error) {
                console.error(`Error processing PATCH request: ${error}`);
                return new NextResponse("Internal Server Error", { status: 500 });
            }
        };
    