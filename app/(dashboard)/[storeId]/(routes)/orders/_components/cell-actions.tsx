"use client";
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel } from '../../../../../../components/ui/dropdown-menu';
import { Button } from '../../../../../../components/ui/button';
import { MoreVertical, Copy, Trash, Edit } from 'lucide-react';
import { toast } from '../../../../../../providers/toast-provider';
import { AlertModel } from '../../../../../../components/model/alert-model';
import React from 'react';
import { OrdersColumns } from './columns';

interface CellActionsProps {
    data: OrdersColumns;
}

export const CellAction = ({ data }: CellActionsProps) => {
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast?.success("Order id copied to clipboard");
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/${params.storeId}/orders/${data.id}`);
            toast?.success("Order Removed");
            router.refresh();
            location.reload();
        } catch (error) {
            toast?.error("Something went wrong");
        } finally {
            setIsLoading(false);
            setOpen(false);
        }
    };

    const onUpdate = async (order_status: string) => {
        try {
            setIsLoading(true);
            await axios.patch(`/api/${params.storeId}/orders/${data.id}`, { order_status });
            toast?.success("Order Updated");
            router.refresh();
            location.reload();
        } catch (error) {
            toast?.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

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
                        <span className="sr-only">Open</span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdate("Ready!")}>
                        <Edit className="h-4 w-4 mr-2" />
                        Ready!
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdate("Delivered!")}>
                        <Edit className="h-4 w-4 mr-2" />
                        Delivered!
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdate("Canceled!")}>
                        <Edit className="h-4 w-4 mr-2" />
                        Cancel
                    </DropdownMenuItem>
                    {/*
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
    </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
