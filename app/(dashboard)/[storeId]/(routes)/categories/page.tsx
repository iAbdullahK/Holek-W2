import { CategoryClient } from './_components/client';
import { getDocs, collection, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from "@/types-db";
import { format } from "date-fns";
import { CategoryColumns } from './_components/columns';
import { Separator } from '@/components/ui/separator';

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
    const categoriesData = (
        await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
    ).docs.map(doc => doc.data()) as Category[];

    const formattedCategories: CategoryColumns[] = categoriesData.map(item => ({
        id: item.id,
        billboardLabel: item.billboardLabel,
        name: item.name,
        createdAt: item.createdAt ? format(item?.createdAt.toDate(), "MMMM do, yyyy") : ""
    }));

    return (
        <div className="flex-col">
            <Separator className="bg-purple-700" />
            <div className="flex-1 space-y-4 p-8 pt">
                <CategoryClient data={formattedCategories} />
            </div>
        </div>
    );
}

export default CategoriesPage;
