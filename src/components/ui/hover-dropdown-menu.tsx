"use client";

import * as React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface HoverDropdownMenuProps {
  trigger: React.ReactNode;
  items: Array<{
    label: React.ReactNode;
    onClick?: () => void;
  }>;
}

export function HoverDropdownMenu({ trigger, items }: HoverDropdownMenuProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="outline-none"
      >
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      >
        {items.map((item, index) => (
          <DropdownMenuItem 
            key={index} 
            onClick={item.onClick}
            className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}