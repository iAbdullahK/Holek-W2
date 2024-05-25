
import { getDoc, doc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../../../../../lib/firebase';
import { OrderForm } from './components/order-form';
import { Order, Product } from '../../../../../../types-db';
import React from 'react';

const OrderPage = async (
    {params} : {params :  
        {orderId : string, storeId : string,  }}) => {
            const order = (await getDoc(doc(db, "stores", params.storeId, "orders", params.orderId))).data() as Order;

            const ProductsData = (await getDocs(collection(doc(db, "stores", params.storeId), "products"))).docs.map(doc => doc?.data()) as Product[];
    return ( 
    <div className='flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <OrderForm initialData = {order} products={ProductsData} />
        </div>
    </div> 
    );
}
 
export default OrderPage;