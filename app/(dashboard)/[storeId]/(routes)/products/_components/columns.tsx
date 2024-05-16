"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { CellAction } from './cell-actions';
import { CellImage } from './cell-image';


export type ProductColumns = {
    id: string,
    name: string,
    price: string,
    qty? : string,
    image: string,
    category: string,
    createdAt: string;
}

export const columns: ColumnDef<ProductColumns>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({row}) =>  {
        const {image} = row.original
        return(
            <CellImage image={image} />
        )
    }
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "category",
    header: "Category"
  },
  {
    accessorKey: "qty",
    header: "Quantity"
  },
  {
    accessorKey: "price",
    header: "Price"
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
