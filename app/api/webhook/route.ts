import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "@/node_modules/next/server";
import { stripe } from "@/lib/stripe";
import { addDoc,
    collection,
    doc,
    serverTimestamp,
    updateDoc,
     } from 'firebase/firestore';
import { db } from "@/lib/firebase";
import { metadata } from '../../layout';

export const POST = async (req: Request) => {
    const body = await req.text()

    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try{
        event = stripe.webhook.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error : any){
        return new NextResponse(`WEBHOOK Error " ${(error as Error)?.message}`)
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if(event.type == "checkout.session.completed"){
        console.log(`Order ID: `, session?.metadata.orderId);
        if(session?.metadata?.orderId){
            await updateDoc(doc(db, "stores", session?.metadata?.storeId, "orders", session?.metadata?.orderId), {
                isPaid: true,
                phone: session?.customer_details?.phone,
                updatedAt: serverTimestamp(),
            }
            );
        }
    }

    return new NextResponse(null, {status: 200})

}