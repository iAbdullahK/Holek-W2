
import { getDoc, doc, getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, Category } from '@/types-db';
import ProductForm from './components/product-form';

const ProductPage = async (
    {params} : {params :  
        {productId : string, storeId : string,  }}) => {
            //const product = (await getDoc(doc(db, "stores", params.storeId, "orders", params.productId))).data() as Product;

           // const categoriesData = (await getDocs(collection(doc(db, "stores", params.storeId), "categories"))).docs.map(doc => doc?.data()) as Category[];
    return ( 
    <div className='flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
        </div>
    </div> 
    );
}
 
export default ProductPage;