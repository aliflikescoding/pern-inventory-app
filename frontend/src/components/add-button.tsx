"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AddButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-[1.2rem] w-[1.2rem] text-foreground" />
          <span className="sr-only">Add New Stuff</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href="/newcategory">
            New Category
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem >
        <Link href="/newitem">
            New Item
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
