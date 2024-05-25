"use client"

import { Billboards, Billboard } from '../../../../../../../types-db';
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
import { Category } from '../../../../../../../types-db';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../../../components/ui/select';
import React from 'react';
import toast from 'react-hot-toast';


interface CategoryFormProps {
    initialData: Category;
    billboards: Billboards[];
}

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
});


export const CategoryForm = ({ initialData, billboards }: CategoryFormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaulValues: initialData,

    });

    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit Category" : "Create Category";
    const description = initialData ? "Edit a Category" : "Add a new Category"
    const toastMessage = initialData ? "Category Updated!" : "Billboard Created!";
    const action = initialData ? "Save Changes" : "Create Category";

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
    
            const { billboardId: formBillId } = data; // Corrected the key name to match the schema
            const matchingBillboard = billboards?.find((item) => item.id === formBillId);
    
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, {
                    ...data,
                    billboardLabel: matchingBillboard?.label,
                });
            } else {
                await axios.post(`/api/${params.storeId}/categories`, {
                    ...data,
                    billboardLabel: matchingBillboard?.label,
                });
            }
            toast?.success(toastMessage);
            router.refresh();
            router.push(`/${params.storeId}/categories`);
        } catch (error) {
            toast?.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };
    
    const onDelete = async () => {
        try {
            setIsLoading(true);


            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            toast?.success("Category Removed");
            location.reload();
            router.push(`/${params.storeId}/categories`);
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
            <div className="flex items-center justify-center">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button disabled={isLoading} variant={"destructive"} size={"icon"} onClick={() => setOpen(true)} >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator className="bg-purple-700" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">

                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-purple-900">Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder="Your Category name.."
                                        {...field}
                                        value={field.value || (initialData ? initialData.name : "")}
                                   />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField control={form.control} name="billboardId" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-purple-900">Billboard</FormLabel>
                                <FormControl>
                                    <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    value={field.value || (initialData ? initialData.billboardId : "")}
                                    defaultValue={field.value}
                                    >    
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue 
                                            defaultValue={field.value}
                                            placeholder="Select a billboard"
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {billboards.map(billboard => (
                                            <SelectItem key={billboard.id} 
                                        value={billboard.id || (initialData ? initialData.id : "")}
                                            >
                                                {billboard.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                    </div>
                    <Button className="bg-purple-700" disabled={isLoading} type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
}

export default CategoryForm;
