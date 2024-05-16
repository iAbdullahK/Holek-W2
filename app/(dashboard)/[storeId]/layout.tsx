import { redirect } from "@/node_modules/next/navigation";
import { auth } from "@clerk/nextjs/server";
import { collection, getDocs, query, where} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Store } from "@/type-db";
import { Navbar } from "@/components/navbar";

interface DashboardLayoutProps{
    children : React.ReactNode,
    params: {storeId : string}
}

const DashboardLayout = async ({children, params} : DashboardLayoutProps) => {
    const{userId} = auth();
    if(!userId){
        redirect("/sign-in");
    }

    const storeSnap = await getDocs(
        query(
            collection(db, "stores"),
            where("userId", "==", userId),
            where("id", "==", params.storeId)
        )
    )
    
    let store = null as any

    storeSnap.forEach((doc) => {
        store = doc.data() as Store;
    });

    if(!store){
        redirect("/");
    }

    return <>
    <Navbar /> 
    {children}
    </>
    return ( <div> </div>);
};

export default DashboardLayout;