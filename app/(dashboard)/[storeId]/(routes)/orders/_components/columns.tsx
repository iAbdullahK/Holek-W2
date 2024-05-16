"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { CellAction } from './cell-actions';
import { CellImage } from './cell-image';
import { cn } from "@/lib/utils";


export type OrdersColumns = {
  id: string,
  isPaid: boolean,
  phone: string,
  products: string,
  totalPrice: string,
  images: string,
  order_status: string,
  createdAt: string;
}

export const columns: ColumnDef<OrdersColumns>[] = [
  {
    accessorKey: "images",
    header: "Image",
    cell: ({row}) =>  {
        const {image} = row.original
        return(
          <div className="grid grid-cols-1 gap-2">
            <CellImage image={image} />
            </div>
        )
    }
  },
  {
    accessorKey: "products",
    header: "Products"
  },
  {
    accessorKey: "category",
    header: "Category"
  },
  {
    accessorKey: "phone",
    header: "Phone"
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
    header: "Payment status",
    cell: ({row}) => {
      const {isPaid } = row.original;

      return <p className={cn("text-lg font-semibold", isPaid ? "text-emerald-500": "text-red-500")}></p>
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
