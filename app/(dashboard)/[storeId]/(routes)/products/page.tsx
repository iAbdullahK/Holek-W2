import { ProductsClient } from './_components/client';
import { getDocs, collection, doc } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import { format } from "date-fns";
import { ProductColumns } from './_components/columns';
import { Product } from '../../../../../types-db';
import { formatter } from '../../../../../lib/utils';
import React from 'react';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
    const ProductsData = (
        await getDocs(collection(doc(db, "stores", params.storeId), "products"))
    ).docs.map(doc => doc.data()) as Product[];

    const formattedProducts: ProductColumns[] = ProductsData.map(item => ({
        id: item.id,
        image: item.image,
        name: item.name,
        cal: item.cal,
        qty: item.qty,
        price: formatter.format(item.price),
        category: item.category,
        createdAt: item.createdAt ? format(item?.createdAt.toDate(), "MMMM do, yyyy h:mm a") : ""
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt">
                <ProductsClient data={formattedProducts} />
            </div>
        </div>
    );
}

export default ProductsPage;
