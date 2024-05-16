"use client"

import { Heading } from '@/components/heading';
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from '@/providers/toast-provider';
import axios from 'axios';
import { AlertModel } from "@/components/model/alert-model";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, Category} from '@/types-db';
import ImageUpload from '@/components/image-upload';


interface ProductFormProps {
    initialData: Product;
    categories: Category[],

}

const formSchema = z.object({
    name: z.string().min(1),
    price: z.coerce.number().min(1),
    image: z.string().min(1),
    category: z.string().min(1),
    qty: z.coerce.number().min(1),
});


export const ProductForm = ({ 
    initialData, categories,
 }: ProductFormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaulValues: initialData||{
            name: "",
            price: 0,
            image: "", 
            category: "",
            qty: 0,
        },

    });

    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit Product" : "Create Product";
    const description = initialData ? "Edit a Product" : "Add a new Product"
    const toastMessage = initialData ? "Product Updated!" : "Product Created!";
    const action = initialData ? "Save Changes" : "Create Product";

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);

            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`,
                    data,
                );
            } else {
                await axios.post(`/api/${params.storeId}/products`,
                    data,
                );
            }
            toast?.success(toastMessage);
            router.refresh();
            router.push(`/${params.storeId}/products`);
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

            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            toast?.success("Product Removed");
            location.reload();
            router.push(`/${params.storeId}/products`);
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
                        name="image"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-purple-900"> Product Image</FormLabel>
                                <FormControl>
                                    <ImageUpload 
                                        value={field.value ? [field.value] : []}
                                        disabled={isLoading}
                                        onChanged={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")} 
                                        
                                        />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-purple-900">Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder="Your product name.."
                                        {...field}
                                        value={field.value || (initialData ? initialData.name : "")}

                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        
                        <FormField 
                            control={form.control}
                            name="price"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-purple-900">Price</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number"
                                            disabled={isLoading}
                                            placeholder="0"
                                            {...field}
                                            value={field.value || (initialData ? initialData.price : "")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />                
    
                        <FormField 
                            control={form.control}
                            name="qty"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-purple-900">Quantity</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number"
                                            disabled={isLoading}
                                            placeholder="0"
                                            {...field}
                                            value={field.value || (initialData ? initialData.qty : "")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />   
                        
                        <FormField 
                            control={form.control}
                            name="category"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-purple-900">Category</FormLabel>
                                    <FormControl>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue 
                                                        defaultValue={field.value}
                                                        placeholder="Select a category"
                                                        value={field.value || (initialData ? initialData.category : "")}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map(category => (
                                                    <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
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

export default ProductForm;
