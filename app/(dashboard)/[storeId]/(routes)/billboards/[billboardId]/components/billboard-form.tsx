"use client"

import { Billboards, Billboard } from '@/types-db';
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
import ImageUpload from '@/components/image-upload';
import { deleteObject, ref } from 'firebase/storage';
import { storage } from '@/lib/firebase';


interface BillboardFormProps {
    initialData: Billboards;
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
});


export const BillboardForm = ({ initialData }: BillboardFormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            defaulValues: initialData,
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit Billboard" : "Create Billboard";
    const description = initialData ? "Edit a Billboard" : "Add a new billboard"
    const toastMessage = initialData ? "Billboard Updated!" : "Billboard Created!";
    const action = initialData ? "Save Changes" : "Create Billboards";

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);

            if (initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, data);
            }
            toast?.success(toastMessage);
            router.refresh();
            router.push(`/${params.storeId}/billboards`);

        } catch (error) {
            toast?.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setIsLoading(true);

            const { imageUrl } = form.getValues()
            await deleteObject(ref(storage, imageUrl)).then(async () => {

                await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            });
            toast?.success("Billboards Removed");
            location.reload();
            router.push(`/${params.storeId}/billboards`);
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
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-purple-900"> Billboard Image</FormLabel>
                                <FormControl>
                                    <ImageUpload value={field.value ? [field.value] : []}
                                        disabled={isLoading}
                                        onChanged={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="label" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-purple-900">Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder="Your Billboards name.."
                                        {...field}
                                        value={field.value || (initialData ? initialData.label : "")}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <Button className="bg-purple-700" disabled={isLoading} type="submit" >
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
}

export default BillboardForm;
