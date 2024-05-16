"use client"

import { useParams, useRouter } from 'next/navigation';
import {Plus} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/heading';
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { columns, BillboardColumns } from './columns';


interface BillboardClientProps{
  data: BillboardColumns[]
}

export const BillboardClient = ({data}: BillboardClientProps) => {

    const params = useParams();
    const router = useRouter();


    return (
      <>
        <div className='flex items-center justify-between'>
          <Heading
            title={`Billboards (${data.length})`}
            description="Manage billboards for your store"
          />
          <Button
            onClick={() => router.push(`/${params.storeId}/billboards/create`)}
            className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
        <Separator />
        <DataTable searchKey="label" columns={columns} data={data} />
      </>
    );
};
