"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useParams, useRouter } from "@/node_modules/next/navigation";
import { Store } from "@/type-db";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check, Store as StoreIcon } from "lucide-react"; // Import icons
import { StoreListItem } from "./store-list-item";
import { useStoreModel } from '../hooks/use-store-model';
import { CreateNewStoreItem } from './create-store-item';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[]
}

export const StoreSwitcher = ({ items }: StoreSwitcherProps) => {

  const params = useParams()
  const router = useRouter()
  const storeModel = useStoreModel()

  const formattedStores = items?.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedStores?.find(
    (item) => item.value === params.storeId
  );

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterd, setFiltered] = useState<{ label: string, value: string }[]>([])


  const onStoreSelect = (store: { value: string, label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`)
  }

  const handleSearchTerm = (e: any) => {
    setSearchTerm(e.target.value);
    setFiltered(
      formattedStores.filter(item =>
        item.label.toLowerCase().includes(searchTerm?.toLowerCase())
      )
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.value
            ? formattedStores?.find((framework) => framework.value === currentStore.value)?.label
            : "Select Store..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <div className="w-full px-2 py-4 flex items-center border rounded-md border-gray-100" >
            <StoreIcon className="mr-2 h-4 w-4 min-w-12" />
            <input type="text" placeholder="Search Store..." onChange={handleSearchTerm} className="flex-1 w-full outline-none" />
          </div>
          <CommandList>
            <CommandGroup heading="Stores">
              {searchTerm === "" ? (
                formattedStores.map((item, i) => (
                  <StoreListItem store={item} key={i} onSelect={onStoreSelect} isChecked={currentStore?.value == item.value} />
                ))
              ) : filterd.length > 0 ? (
                filterd.map((item, i) => (
                  <StoreListItem store={item} key={i} onSelect={onStoreSelect} isChecked={currentStore?.value == item.value} />
                ))
              ) : <CommandEmpty>No Store Found</CommandEmpty>}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CreateNewStoreItem
                onClick={() => {
                  setOpen(false);
                  storeModel.onOpen();
                }}
              />
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>


  )
};

