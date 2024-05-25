"use client"

import { useParams, useRouter } from 'next/navigation';
import {Plus} from "lucide-react";
import { Button } from '../../../../../../components/ui/button';
import { Heading } from '../../../../../../components/heading';
import { Separator } from "../../../../../../components/ui/separator";
import { DataTable } from "../../../../../../components/ui/data-table";
import React from 'react';
import { OrdersColumns, columns } from './columns';


interface OrdersClientProps{
  data: OrdersColumns[];
}

export const OrdersClient = ({data}: OrdersClientProps) => {

    const params = useParams();
    const router = useRouter();


  return (
  <>
    <div className='flex items-center justify-center justify-between'>
        <Heading title={`Orders (${data.length})`} 
        description="Manage Orders for your foodtruck" 
        />
    </div>
    <Separator />
    <DataTable searchKey="orderNumber" columns={columns} data={data}/>
  </>
  )
};
