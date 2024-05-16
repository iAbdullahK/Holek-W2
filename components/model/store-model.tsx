"use client"
import * as React from "react";
import { Model } from "@/components/model"
import { useStoreModel } from "@/hooks/use-store-model"
import { useState } from "react";
import { useForm } from 'react-hook-form';
import {Form, FormControl,FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input} from "@/components/ui/input";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from '@/providers/toast-provider';

const formSchema = z.object({
    name : z.string().min(3, {message : "Store name should be minimum 3 characters"}),
});

export const StoreModel = () => {
  
    const storeModel = useStoreModel()

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues : {
            name : ""
        }
    })

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try{
            setIsLoading(true);

            const response = await axios.post("/api/stores", values); 
            toast?.success("Store Created");
            window.location.assign(`/${response.data.id}`);
        }catch (error){
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <Model title="Create a new store"
         description="Add a new store to manage the products and catagories"
        isOpen={storeModel.isOpen}
        onClose={storeModel.onClose}
        >
        <div>
            <div className="space-y-4 py-2 pb-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name="name" render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input 
                                    disabled={isLoading}
                                    placeholder="Your store name.."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                     />
                     <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                        <Button disabled={isLoading} type="button" variant={"outline"} size={"sm"}>
                             Cancel 
                             </Button>
                        <Button disabled={isLoading} type="submit" size={"sm"}> 
                        Continue 
                        </Button>

                     </div>
                </form>
            </Form>
            </div>
        </div>
        </Model>
    );
};