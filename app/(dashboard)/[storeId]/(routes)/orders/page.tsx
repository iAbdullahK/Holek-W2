import { getDocs, collection, doc } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import { format } from "date-fns";
import { OrdersColumns } from "./_components/columns";
import { formatter } from '../../../../../lib/utils';
import { OrdersClient } from './_components/client';
import { Order } from '../../../../../types-db';
import { Separator } from '../../../../../components/ui/separator';
import React from 'react';

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
    const ordersData = (
        await getDocs(collection(doc(db, "stores", params.storeId), "orders"))
    ).docs.map(doc => doc.data()) as Order[];

    const formattedOrders: OrdersColumns[] = ordersData.map(item => ({
        id: item.id,
        isPaid: item.isPaid,
        orderNumber: item.orderNumber,
        qty: item.orderItems.map(item => item.qty).join(", "),
        products: item.orderItems.map(item => item.name).join(", "),
        order_status: item.order_status,
        totalPrice: formatter.format(
            item.orderItems.reduce((total, item) => {
                if (item && item.qty !== undefined) {
                    return total + Number(item.price * item.qty)
                }
                return total
            }, 0),
        ),
        images: item.orderItems.map(item => item.image).join(", "),
        createdAt: item.createdAt ? format(item?.createdAt.toDate(), "MMMM do, yyyy h:mm a") : ""
    }));

    return (
        <div className="flex-col">
                        <Separator className="bg-purple-700" />
            <div className="flex-1 space-y-4 p-8 pt">
                <OrdersClient data={formattedOrders} />
            </div>
        </div>
    );
}

export default OrdersPage;