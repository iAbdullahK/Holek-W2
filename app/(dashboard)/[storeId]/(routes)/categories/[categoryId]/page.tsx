
import { getDoc, doc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../../../../../lib/firebase';
import { Category, Billboards } from '../../../../../../types-db';
import { CategoryForm } from './components/category-form';
import React from 'react';

const CategoryIdPage = async (
    {params} : {params :  
        {categoryId : string, storeId : string,  }}) => {
            const category = (await getDoc(doc(db, "stores", params.storeId, "categories", params.categoryId))).data() as Category;

            const billboardsData = (
                await getDocs(collection(doc(db, "stores", params.storeId), "billboards"))
            ).docs.map(doc => doc.data()) as Billboards[];

    return ( 
    <div className='flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryForm initialData = {category} billboards={billboardsData} />
        </div>
    </div> 
    );
}
 
export default CategoryIdPage;