"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ics, District } from "@prisma/client"
import { deleteIcs } from "@/app/actions/ics"
import { IcsForm } from "./ics-form"

// Extend Ics type to include District
export type IcsWithDistrict = Ics & {
    district: District
}

// We need to pass districts to the columns for the edit form
// But columns definition in tanstack table is static.
// A common pattern is to create a function that returns columns, or just pass data to the cell component.
// However, for simplicity here, we will assume we can fetch districts inside the form or pass them down.
// Since we can't easily pass props to columns definition, we'll make the cell component handle the form rendering
// and it will need to receive districts.
// Actually, the cleanest way in this setup is to have the Page pass the districts to the DataTable, 
// and the DataTable could pass it to the columns? No, DataTable is generic.
// Alternative: The Edit Action opens a dialog that is controlled by the parent or a separate component.
// But we implemented the Form inside the Dropdown in District.
// Let's stick to that pattern. But we need 'districts' list for the select.
// We can't easily pass 'districts' to the column definition file unless we make it a function.

export const getColumns = (districts: District[]): ColumnDef<IcsWithDistrict>[] => [
    {
        accessorKey: "district.name",
        header: "District",
    },
    {
        accessorKey: "code",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ICS Code
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "fid",
        header: "FID",
    },
    {
        accessorKey: "abbreviation",
        header: "Abbreviation",
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Full Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const ics = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(ics.name)}
                        >
                            Copy ICS name
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <div onSelect={(e) => e.preventDefault()}>
                            <IcsForm ics={ics} districts={districts} />
                        </div>
                        <DropdownMenuItem onClick={async () => {
                            if (confirm("Are you sure you want to delete this ICS?")) {
                                await deleteIcs(ics.id)
                            }
                        }}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
