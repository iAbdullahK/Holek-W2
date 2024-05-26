import { redirect } from "next/navigation"; // Corrected import path
import { auth } from "@clerk/nextjs/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Store } from "../../../types-db";
import { Navbar } from "../../../components/navbar";
import React, { useEffect } from "react"; // Removed async from import

interface DashboardLayoutProps {
    children: React.ReactNode;
    params: { storeId: string };
}

const DashboardLayout = ({ children, params }: DashboardLayoutProps) => {

        const checkPermissions = async () => {
            const { userId, sessionClaims } = auth();
            if (!userId) {
                redirect("/sign-in");
                return;
            }

            // Check if user is admin
            const isAdmin = sessionClaims?.org_role === 'org:admin';

            if (isAdmin) {
                // Fetch all stores if user is admin
                // Redirect admin to specific store if storeId is provided
                if (params.storeId) {
                    redirect(`/${params.storeId}`);
                    return;
                }
            } else {
                // Fetch only user's stores if not an admin
                const storeQuery = query(
                    collection(db, "stores"),
                    where("userId", "==", userId)
                );

                const storeSnap = await getDocs(storeQuery);
                const userStores: Store[] = storeSnap.docs.map(doc => doc.data() as Store);
                
                // Redirect if storeId is provided and it's not in user's stores
                if (params.storeId && !userStores.some(store => store.id === params.storeId)) {
                    redirect("/");
                    return;
                }
            }
        };

        checkPermissions();

    return (
        <>
            <Navbar />
            {children}
        </>
    );
};

export default DashboardLayout;
