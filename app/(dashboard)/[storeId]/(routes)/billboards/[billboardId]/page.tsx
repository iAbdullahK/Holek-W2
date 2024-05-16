import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BillboardForm } from './components/billboard-form';
import { Billboards } from '@/types-db';

const BillboardPage = async (
    {params} : {params :  
        {billboardId : string, storeId : string,  }}) => {
            const billboard = (await getDoc(doc(db, "stores", params.storeId, "billboards", params.billboardId))).data() as Billboards;

    return ( 
    <div className='flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <BillboardForm initialData = {billboard} />
        </div>
    </div> 
    );
}
 
export default BillboardPage;