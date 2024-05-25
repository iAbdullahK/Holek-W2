"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from '../../../../../../components/ui/button';
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { CellAction } from './cell-actions';
import { cn } from "../../../../../../lib/utils";
import { CellImage } from "../../orders/_components/cell-image";
import React from "react";

export type OrdersColumns = {
  id: string,
  orderNumber: number,
  isPaid: boolean,
  products: string,
  images: string,
  order_status: string,
  createdAt: string;
}

export const columns: ColumnDef<OrdersColumns>[] = [
  {
    accessorKey: "images",
    header: "Image",
    cell: ({row}) =>  {
        const {images} = row.original
        return(
            <CellImage images={images} />
        )
    }
  },
  {
    accessorKey: "orderNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "products",
    header: "Product name"
  },
  {
    accessorKey: "qty",
    header: "Quantity"
  },
  {
    accessorKey: "totalPrice",
    header: "Amount"
  },
  {
    accessorKey: "isPaid",
    header: "Payment Status",
    cell: ({ row }) => {
      const { isPaid } = row.original;
  
      return (
        <p className={cn("text-lg font-semibold", {
          "text-emerald-500": isPaid,
          "text-red-500": !isPaid
        })}>
          {isPaid ? "Success!" : "Pending"}
        </p>
      );
    }
  },
  {
    accessorKey: "order_status",
    header: "Order status",
    cell: ({row}) => {
      const{order_status} = row.original

      return (
        <p className={cn("text-lg font-semibold",
        (order_status === "Processing" && "text-orange-500") ||
         (order_status === "Ready!" && "text-yellow-500") ||
         (order_status === "Delivered!" && "text-emerald-500") ||
         (order_status === "Canceled!" && "text-red-500") 
        )}
        >{order_status}</p>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original}/>
  }
];
