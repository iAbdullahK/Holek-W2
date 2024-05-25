"use client"

import Image from "next/image";
import React from "react";

interface CellImageProps{
    images: string
}

export const CellImage = ({images} : CellImageProps) => {
  return (
    <div className="overflow-hidden w-32 min-h-16 h-16 min-w-32 relative rounded-md shadow-md">
        <Image 
        fill
        alt="Product Image"
        className="object-cover"
        src={images}
        />
        </div>
  )
}
