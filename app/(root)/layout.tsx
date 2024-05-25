import { redirect } from 'next/navigation';
import { Store } from '../../types-db';
import { auth } from '@clerk/nextjs/server';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import React from 'react';


interface SetUpLayoutProp{
    children: React.ReactNode
}

const SetUpLayout = async ({children} : SetUpLayoutProp) => {
    const { userId } = auth();
    if (!userId) {
        redirect("/sign-in");
    }

    const storeSnap = await getDocs(
        query(collection(db, "stores"), where("userId", "==", userId))
    );

    let store = null as any;

    storeSnap.forEach((doc) => {
        store = doc.data() as Store;
        return;
    });

    if (store) {
        redirect(`/${store?.id}`);
    }

    return <div>{children}</div>;
};
 
export default SetUpLayout;