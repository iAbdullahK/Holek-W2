import { NextResponse } from '@/node_modules/next/server';
import { auth } from '@clerk/nextjs/server';
import { serverTimestamp, getDoc, doc, addDoc, collection, updateDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types-db';


export const PATCH = async (req : Request,
    {params} : {params : {storeId : string, productId : string}}
    ) => {
        try {
        
            const { userId } = auth();
            const body = await req.json();
    
            if (!userId) {
                return new NextResponse("Un-Authorized!!", { status: 405 });
            }

            const {  name,
                price,
                image,
                category,
                qty,
             } = body;
    
            if (!name) {
                return new NextResponse("Product name is missing!", { status: 400 });
            }

            if (!image) {
                return new NextResponse("Product image is missing!", { status: 401 });
            }
            if (!price) {
                return new NextResponse("Product price is missing!", { status: 402 });
            }
            if (!qty) {
                return new NextResponse("Product quantity is missing!", { status: 403 });
            }
            if (!category) {
                return new NextResponse("Product category is missing!", { status: 404 });
            }

            if (!params.storeId) {
                return new NextResponse("Store ID is missing!", { status: 405 });
            }
            if (!params.productId) {
                return new NextResponse("Product ID is missing!", { status: 406 });
            }

            const store = await getDoc(doc(db, "stores", params.storeId))

            if(store.exists()){
                let storeData = store.data()
                if(storeData?.userId !== userId) {
                    return new NextResponse("Un-Authorized Access!", {status: 500})
                }
            }

            const productRef = await getDoc(
                doc(db, "stores", params.storeId, "products", params.productId)
            )

            if(productRef.exists()){
                await updateDoc(
                    doc(db, "stores", params.storeId, "products", params.productId), {
                        ...productRef.data(),
                        name,
                        price,
                        image,
                        qty,
                        category,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    }
                )
            }else{
                return new NextResponse("Product Not Found", {status : 400})
            }

            const product = (
                await getDoc(
                    doc(db, "stores", params.storeId, "products", params.productId)
                )
            ).data() as Product
            return NextResponse.json(product)
        } catch (error) {
            console.error(`Error processing PATCH request: ${error}`);
            return new NextResponse("Internal Server Error", { status: 500 });
        }
    };

    export const DELETE = async (req : Request,
        {params} : {params : {storeId : string, productId : string}}
        ) => {
            try {
            
                const { userId } = auth();
        
                if (!userId) {
                    return new NextResponse("Un-Authorized!!", { status: 405 });
                }

                if (!params.storeId) {
                    return new NextResponse("Store ID is missing!", { status: 402 });
                }
                if (!params.productId) {
                    return new NextResponse("Product ID is missing!", { status: 403 });
                }
    
                const store = await getDoc(doc(db, "stores", params.storeId))
    
                if(store.exists()){
                    let storeData = store.data()
                    if(storeData?.userId !== userId) {
                        return new NextResponse("Un-Authorized Access!", {status: 500})
                    }
                }
    
                const productRef = await doc(db, "stores", params.storeId, "products", params.productId)
                
                const productDoc = await getDoc(productRef)
                if(!productDoc.exists()){
                    return new NextResponse("Product not found!!", {status: 404})
                }
                await deleteDoc(productRef)

                
                return NextResponse.json({msg: "Product Deleted!" });
            } catch (error) {
                console.error(`Error processing PATCH request: ${error}`);
                return new NextResponse("Internal Server Error", { status: 500 });
            }
        };
    