import { UserButton } from '@clerk/nextjs';
import { MainNav } from './main-nav';
import { StoreSwitcher } from './store-switcher';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Store } from '../types-db';
import React from 'react';

export const Navbar = async () => {
  const { userId, sessionClaims } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  console.log(sessionClaims.org_role);
  
  // Check if the user has an admin role
  const isAdmin = sessionClaims?.org_role === 'org:admin';

  let storeQuery;
  if (isAdmin) {
    storeQuery = collection(db, "stores"); // Get all stores if the user is an admin
  } else {
    storeQuery = query(
      collection(db, "stores"),
      where("userId", "==", userId) // Get only user's stores if not an admin
    );
  }

  const storeSnap = await getDocs(storeQuery);

  let stores: Store[] = [];

  storeSnap.forEach(doc => {
    stores.push(doc.data() as Store);
  });

  return (
    <div className="border-p">
      <div className="flex h-14 items-center px-8">
        <StoreSwitcher items={stores} />

        {/* routes */}
        <MainNav />

        {/* user profile */}
        <div className="ml-auto">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};
