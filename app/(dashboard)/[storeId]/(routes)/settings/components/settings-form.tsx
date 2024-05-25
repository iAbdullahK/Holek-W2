"use client";
import { Store } from "../../../../../../types-db";
import { Heading } from '../../../../../../components/heading';
import { Button } from "../../../../../../components/ui/button";
import { Separator } from '../../../../../../components/ui/separator';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../../../components/ui/form";
import { Input } from "../../../../../../components/ui/input";
import axios from 'axios';
import { AlertModel } from "../../../../../../components/model/alert-model";
import { useOrigin } from '../../../../../../hooks/use-origin';
import React, { useState, useEffect } from "react";
import ImageUpload from '../../../../../../components/image-upload';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from "../../../../../../lib/firebase";
import toast from 'react-hot-toast';

interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object({
    description: z.string().min(3, { message: "Description should be minimum 3 characters" }),
    image: z.string().url({ message: "You should add an image !!" }).min(3),
});

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || "", // Set default value for description
            image: initialData?.image || "", // Set default value for image
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // State variable for success message
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/stores/${params.storeId}`, data);
            toast?.success("Store Updated");
            setSuccessMessage("Description and image added successfully"); // Set success message
            // Update description and image in Firebase
            await updateDoc(doc(db, "stores", params.storeId), {
                description: data.description,
                image: data.image,
            });
            router.refresh();
        } catch (error) {
            toast?.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageError = (error) => {
        console.error("Image load error: ", error);
        toast?.error("Failed to load image. Please check the URL or upload a new image.");
    };

    return (
        <>
            <AlertModel
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={() => {}}
                loading={isLoading}
            />
            <div className="flex items-center justify-center">
                <Heading title="Settings" description="Manage foodtruck Description and Image" />
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                    <FormField control={form.control} name="image" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Foodtruck Image</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value ? [field.value] : []}
                                    disabled={isLoading}
                                    onChanged={(url) => field.onChange(url)}
                                    onRemove={() => field.onChange("")}
                                    onError={handleImageError}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Foodtruck Description</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder="Your foodtruck description.."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    {successMessage && ( // Render success message if present
                        <div className="text-green-500">{successMessage}</div>
                    )}
                    <Button
                        disabled={isLoading}
                        type="submit"
                        className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded"
                    >
                        Save Changes
                    </Button>
                </form>
            </Form>
        </>
    );
}
