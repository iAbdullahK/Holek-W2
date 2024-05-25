"use client";
import { Check, Truck } from "lucide-react";
import React from "react";
import { cn } from '../lib/utils';

interface StoreListItemProps {
  store: any;
  onSelect: (store: any) => void;
  isChecked: boolean;
}

export const StoreListItem = ({ store, onSelect, isChecked }: StoreListItemProps) => {
  return (
    <div
      className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-50 text-muted-foreground hover:text-primary"
      onClick={() => onSelect(store)}
    >
      <Truck className="mr-2 h-4 w-4" />
      <p className="w-full truncate text-sm whitespace-nowrap">{store.label}</p>
      <Check className={cn("ml-auto w-4 h-4", isChecked ? "opacity-100" : "opacity-0")} />
    </div>
  );
};
