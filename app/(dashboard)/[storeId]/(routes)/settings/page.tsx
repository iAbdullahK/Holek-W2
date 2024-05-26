
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import { Store } from '../../../../../types-db';
import { Separator } from '../../../../../components/ui/separator';
import React from 'react';
import { SettingsForm } from './components/settings-form';
import GeolocationUpdater from '../../_components/GeolocationUpdater';

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
            <GeolocationUpdater storeId={params.storeId} /> 
        </div>
    </div>
}

export default SettingsPage;