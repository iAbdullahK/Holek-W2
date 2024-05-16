import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Store } from '@/types-db';
import { SettingsForm } from './components/settings-form';
import { Separator } from '@/components/ui/separator';

interface SettingsPageProps {
    params: {
        storeId: string
    }
}

const SettingsPage = async ({ params }: SettingsPageProps) => {

    const userId = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const store = (
        await getDoc(doc(db, "stores", params.storeId))).data() as Store;

    if (!store) {
        redirect("/");
    }

    return <div className="flex-col">
        <Separator className="bg-purple-700" />

        <div className="flex-1 space-y-5 p-8 pt-6">
            <SettingsForm initialData={store} />
        </div>
    </div>
}

export default SettingsPage;