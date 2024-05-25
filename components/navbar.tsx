import { UserButton } from '@clerk/nextjs';
import { MainNav } from './main-nav';
import { StoreSwitcher } from './store-switcher';
import { auth } from '@clerk/nextjs/server';
import { redirect } from '../node_modules/next/navigation';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Store } from '../types-db';
import React from 'react';


export const Navbar = async () => {

    const{userId} = auth();
    if(!userId){
        redirect("/sign-in");
    }

    const storeSnap = await getDocs(
        query(
            collection(db, "stores"),
            where("userId", "==", userId),
        )
    );
    
    let stores = [] as Store[];

    storeSnap.forEach(doc => {
        stores.push(doc.data() as Store) 
    });
    
  return (
    <div className="boreder-p">
    <div className="flex h-14 items-center px-8">
       <StoreSwitcher items={stores} />

       {/* routes  */}
       <MainNav />

       {/* userprofile */}
       <div className="ml-auto">
       <UserButton afterSignOutUrl="/" />
       </div> 
    </div>
    </div>
  );
};
