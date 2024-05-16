"use client"

import Image from "next/image";

interface CellActionsProps {
    data: string
}

//for multiple images

export const CellImage = ({ data }: CellActionsProps) => {
    return (<>
    {data.map((url, index) => (
        <div key={index} className="overflow-hidden w-16 h-16 min-w-16 min-w-16 aspect-square rounded-md">
            <Image
                alt="image"
                fill
                className="object-contain"
                src={url}
            />
        </div>
    ))}
    </>
    );
}
