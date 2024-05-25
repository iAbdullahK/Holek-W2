import { useState, useEffect } from 'react';
import { PuffLoader } from "react-spinners";
import { Label } from '../components/ui/label';
import { ImagePlus, Trash } from 'lucide-react';
import { storage } from '../lib/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { Button } from '../components/ui/button';
import toast from 'react-hot-toast';
import React from 'react';
//need to fix !!
interface ImagesUploadProps {
    disabled?: boolean;
    onChanged: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImagesUpload = ({
    disabled, onChanged, onRemove, value
}: ImagesUploadProps) => {

    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        setIsLoading(true);

        const storageRef = ref(storage, `Images/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file, { contentType: file.type });

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                toast?.error(error.message);
                setIsLoading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    onChanged(downloadURL);
                    setIsLoading(false);
                }).catch((error) => {
                    toast?.error(error.message);
                    setIsLoading(false);
                });
            }
        );
    };

    const onDelete = (url : string) => {
        onRemove(url)
        deleteObject(ref(storage, url)).then(() => {
            toast?.success("Image Removed");
        })
    }
    return (
        <div>
            {value && value.length > 0 ? (
                <div className="mb-4 flex items-center gap-4">
                    {value.map(url => (
                        <div className="relative w-52 h-52 rounded-md overflow-hidden" key={url}>
                            <img className="object-cover" alt="Billboard Image" src={url} />
                            <div className="absolute z10 top-2 right-2">
                                <Button type="button" onClick={() => onDelete(url)} variant="destructive" size="icon">
                                    <Trash className="h-4 w-4" />
                                </Button>
                                 </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-grey-200 flex items-center justify-center flex-col gap-3">
                    {isLoading ? (
                        <>
                            <PuffLoader size={30} color="#555" />
                            <p>{`${progress.toFixed(2)}%`}</p>
                        </>
                    ) : (
                        <>
                            <Label>
                                <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer">
                                    <ImagePlus className="h-4 w-4" />
                                    <p>Upload an image</p>
                                </div>
                                <input type="file" onChange={onUpload} accept="image/*" className="w-0 h-0" />
                            </Label>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default ImagesUpload;
