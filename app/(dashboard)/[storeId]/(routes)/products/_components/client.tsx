"use client"

import { useParams, useRouter } from 'next/navigation';
import {Plus} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/heading';
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { columns, ProductColumns } from './columns';


interface ProductsClientProps{
  data: ProductColumns[];
}

export const ProductsClient = ({data}: ProductsClientProps) => {

    const params = useParams();
    const router = useRouter();


    return (
      <>
        <div className='flex items-center justify-between'>
          <Heading
            title={`Products (${data.length})`}
            description="Manage Products for your store"
          />
          <Button
            onClick={() => router.push(`/${params.storeId}/products/create`)}
            className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
        <Separator className="bg-purple-700" />
        <DataTable searchKey="name" columns={columns} data={data} />
      </>
    );
};
