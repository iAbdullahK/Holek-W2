"use client"

import { BillboardColumns } from './columns';
import { useRouter, useParams } from '../../../../../../node_modules/next/navigation';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, } from '../../../../../../components/ui/dropdown-menu';
import { Button } from '../../../../../../components/ui/button';
import { MoreVertical, Copy, Trash, Edit } from 'lucide-react';
import { deleteObject, ref } from 'firebase/storage';
import { storage } from '../../../../../../lib/firebase';
import axios from 'axios';
import { AlertModel } from '../../../../../../components/model/alert-model';
import React from 'react';
import toast from 'react-hot-toast';

interface CellActionsProps {
    data: BillboardColumns
}


export const CellAction = ({ data }: CellActionsProps) => {

    const router = useRouter()
    const params = useParams()

    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast?.success("Billboard id copied to clipboard")
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await deleteObject(ref(storage, data.imageUrl)).then(async () => {
                await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
            });
            toast?.success("Billboards Removed");
            router.push(`/${params.storeId}/billboards`);
            location.reload();
        } catch (error) {
            toast?.error("Something went wrong");
        } finally {
            setIsLoading(false);
            setOpen(false);
        }
    }
    
    return ( 
        <>
        <AlertModel 
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
        />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8 p-0" variant={"ghost"}>
                    <span className="sr-only"> Open </span>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick= {() => onCopy(data.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy ID
                </DropdownMenuItem>

                <DropdownMenuItem onClick={()=> router.push(`/${params.storeId}/billboards/${data.id}`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Update
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}
