"use client"

import { Heading } from '../../../../../../../components/heading';
import { Button } from "../../../../../../../components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "../../../../../../../components/ui/separator";
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../../../../components/ui/form";
import { Input } from "../../../../../../../components/ui/input";
import axios from 'axios';
import { AlertModel } from "../../../../../../../components/model/alert-model";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../../../components/ui/select';
import { Product, Order } from '../../../../../../../types-db';
import ImageUpload from '../../../../../../../components/image-upload';
import toast from 'react-hot-toast';
import React from 'react';


interface OrdersFormProps {
    initialData: Order;
    products: Product[],

}
const formSchema = z.object({
    isPaid: z.string().optional(),
    order_status: z.string().optional(),
    orderItems: z.array(z.string()).min(1), // Change to array of strings
    qty: z.number().min(1), // Change to number
});

export const OrderForm = ({ initialData, products }: OrdersFormProps) => {

    const defaultOrderItems = initialData.orderItems.map(item => item.name);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isPaid: initialData.isPaid?.toString() || 'false', // Convert boolean to string
            order_status: initialData.order_status || 'Processing', // Use initialData if provided
            orderItems: defaultOrderItems,
            qty: 0, // Assuming default qty is 0
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit Order" : "Create Order";
    const description = initialData ? "Edit a Order" : "Add a new Order"
    const toastMessage = initialData ? "Order Updated!" : "Order Created!";
    const action = initialData ? "Save Changes" : "Create Order";

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);

            if (initialData) {
                await axios.patch(`/api/${params.storeId}/orders/${params.orderId}`,
                    data,
                );
            } else {
                await axios.post(`/api/${params.storeId}/orders`,
                    data,
                );
            }
            toast?.success(toastMessage);
            router.refresh();
            router.push(`/${params.storeId}/orders`);
        } catch (error) {
            toast?.error("Something went wrong");
        } finally {
            router.refresh();
            setIsLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/${params.storeId}/orders/${params.orderId}`);
            toast?.success("Product Removed");
            location.reload();
            router.push(`/${params.storeId}/orders`);
        } catch (error) {
            toast?.error("Something went wrong");
        } finally {
            setIsLoading(false);
            setOpen(false);
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
            <div className="flex items-center justify-between ">
                <div className="text-left">
                    <Heading title={title} description={description} />
                </div>
                {initialData && (
                    <Button disabled={isLoading} variant={"destructive"} size={"icon"} onClick={() => setOpen(true)} >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <Separator className="bg-purple-700" />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">

                    <FormField
                        control={form.control}
                        name="orderItems"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-purple-900">Product Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value || ""} // Ensure value is a string
                                        disabled={isLoading}
                                        onChanged={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="isPaid" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-purple-900">Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder="Your product name.."
                                        {...field}
                                        value="true"

                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                            control={form.control}
                            name="order_status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-purple-900">order_status</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isLoading}
                                            placeholder="0"
                                            {...field}
                                            value={field.value || (initialData ? initialData.order_status : "")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {
                            <FormField
                                control={form.control}
                                name="qty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-purple-900">Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={isLoading}
                                                placeholder="0"
                                                {...field}
                                                value={field.value || (initialData && 'qty' in initialData ? initialData.qty as number : 0)}
                                                />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        }
                        <FormField
                            control={form.control}
                            name="orderItems"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-purple-900">Products</FormLabel>
                                    <FormControl>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value && field.value.length > 0 ? field.value[0] : ''}
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder="Select a product"
                                                    defaultValue={field.value && field.value.length > 0 ? field.value[0] : ''}
                                                    />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map(product => (
                                                    <SelectItem key={product.id} value={product.name}>{product.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />


                    </div>

                    <Button disabled={isLoading} type="submit" className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );


}
export default OrdersFormProps;
