
import { db } from "../../../../../lib/firebase";
import { Order } from "../../../../../types-db";
import { auth } from "@clerk/nextjs/server";

import {
    deleteDoc,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { collection, getDocs } from 'firebase/firestore';

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    const { order_status } = body;

    if (!order_status) {
      return new NextResponse("Order Status is required", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 402 });
    }

    if (!params.orderId) {
      return new NextResponse("Order Id is required", { status: 403 });
    }

    const storeRef = doc(db, "stores", params.storeId);
    const store = await getDoc(storeRef);

    if (!store.exists()) {
      return new NextResponse("Store Not Found", { status: 404 });
    }

    const storeData = store.data();
    if (storeData?.userId !== userId) {
      return new NextResponse("Unauthorized Access", { status: 405 });
    }

    
    const ordersCollectionRef = collection(db, "stores", params.storeId, "orders");
        const querySnapshot = await getDocs(ordersCollectionRef);
        let foundOrder = false;

        querySnapshot.forEach((doc) => {
            const orderData = doc.data();
            if (orderData.id === params.orderId) {
                foundOrder = true;
                console.log(`Deleting document with ID ${params.orderId} in store ${params.storeId}`);
                 updateDoc(doc.ref, {
                    order_status,
                    updatedAt: serverTimestamp(),
                  }
                  );
            }
        });

        if (!foundOrder) {
            console.log(`Order with ID ${params.orderId} not found in store ${params.storeId}`);
            return new NextResponse("Order Not Found", { status: 406 });
        


    } else {
      console.log(`Order with ID ${params.orderId} not found in store ${params.storeId}`);
      return new NextResponse("Order Not Found", { status: 407 });
    }
  } catch (error) {
    console.log(`[ORDER_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
): Promise<NextResponse> => {
  try {
      const { userId } = auth();
      if (!userId) {
          return new NextResponse("Unauthorized", { status: 401 });
      }

      const { storeId, orderId } = params;

      if (!storeId || !orderId) {
          return new NextResponse("Store Id and Order Id are required", { status: 400 });
      }

      console.log("Deleting order:", orderId, "from store:", storeId);

      const storeRef = doc(db, "stores", storeId);
      const storeSnapshot = await getDoc(storeRef);
      if (!storeSnapshot.exists()) {
          return new NextResponse("Store Not Found", { status: 404 });
      }

      const storeData = storeSnapshot.data();
      if (storeData?.userId !== userId) {
          return new NextResponse("Unauthorized Access", { status: 403 });
      }

      const ordersCollectionRef = collection(db, "stores", storeId, "orders");
      const querySnapshot = await getDocs(ordersCollectionRef);

      let foundOrder = false;
      querySnapshot.forEach(async (doc) => {
          const orderData = doc.data();
          if (orderData.id === orderId) {
              foundOrder = true;
              await deleteDoc(doc.ref);
              console.log("Order deleted:", orderId);
          }
      });

      if (!foundOrder) {
          return new NextResponse("Order Not Found", { status: 404 });
      }

      console.log("Order successfully deleted:", orderId);
      return new NextResponse("Order Deleted", { status: 200 });
  } catch (error: any) {
      console.error("[ORDER_DELETE] Error:", error.message);
      return new NextResponse("Internal Server Error", { status: 500 });
  }
};