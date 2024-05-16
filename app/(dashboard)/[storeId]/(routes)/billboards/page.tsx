import { BillboardClient } from "./_components/client";
import { getDocs, collection, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Billboards } from "@/types-db";
import { BillboardColumns } from './_components/columns';
import { format } from "date-fns"
import { Separator } from '@/components/ui/separator';

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {

    const billboardsData = (
        await getDocs(collection(doc(db, "stores", params.storeId), "billboards"))
    ).docs.map(doc => doc.data()) as Billboards[];

    const formattedBillboards: BillboardColumns[] = billboardsData.map(item => ({
        id: item.id,
        label: item.label,
        imageUrl: item.imageUrl,
        createdAt: item.createdAt ? format(item.createdAt.toDate(), "MMMM do, yyyy") : ""
    }))

    return <>
        <div className="flex-col">
            <Separator className="bg-purple-700" />
            <div className="flex-1 space-y-4 p-8 pt">
                <BillboardClient data={formattedBillboards} />
            </div>
        </div>
    </>
}

export default BillboardsPage;