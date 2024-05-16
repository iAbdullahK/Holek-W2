"use client"

import { UserButton } from "@clerk/nextjs";
import { Model } from "@/components/model";
import { useStoreModel } from "@/hooks/use-store-model";
import { useEffect } from "react";

const SetUpPage = () => {
    const onOpen = useStoreModel((state) => state.onOpen)
    const isOpen = useStoreModel((state) => state.isOpen)

    useEffect(()=> {
        if(!isOpen){
            onOpen()
        }
    }, [isOpen, onOpen])
    return null;
};
export default SetUpPage;