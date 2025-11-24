"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Trash2, Plus, Settings2 } from "lucide-react"
import { deleteProjectPeriod } from "@/app/actions/projectperiod"
import { useRouter } from "next/navigation"
import { ProjectPeriodFormDialog } from "./projectperiod-form-dialog"

interface ProjectPeriod {
    id: number
    code: string
    period: string
    active: boolean
    order: number
    note: string | null
}

interface ProjectPeriodTableProps {
    periods: ProjectPeriod[]
}

interface ColumnVisibility {
    code: boolean
    period: boolean
    status: boolean
    order: boolean
    note: boolean
}

export function ProjectPeriodTable({ periods }: ProjectPeriodTableProps) {
    const [open, setOpen] = useState(false)
    const [showNote, setShowNote] = useState(false)
    const [selectedPeriod, setSelectedPeriod] = useState<ProjectPeriod | null>(null)
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
        code: true,
        period: true,
        status: true,
        order: true,
        note: false, // Hidden by default
    })
    const router = useRouter()

    const handleEdit = (period: ProjectPeriod) => {
        setSelectedPeriod(period)
        setOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this project period?")) {
            await deleteProjectPeriod(id)
            router.refresh()
        }
    }

    const handleCreate = () => {
        setSelectedPeriod(null)
        setOpen(true)
    }

    const toggleColumn = (column: keyof ColumnVisibility) => {
        setColumnVisibility(prev => ({
            ...prev,
            [column]: !prev[column]
        }))
    }

    const visibleColumnsCount = Object.values(columnVisibility).filter(Boolean).length + 1 // +1 for actions column

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Settings2 className="mr-2 h-4 w-4" />
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[200px]">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                            checked={columnVisibility.code}
                            onCheckedChange={() => toggleColumn('code')}
                        >
                            Code
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={columnVisibility.period}
                            onCheckedChange={() => toggleColumn('period')}
                        >
                            Period
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={columnVisibility.status}
                            onCheckedChange={() => toggleColumn('status')}
                        >
                            Status
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={columnVisibility.order}
                            onCheckedChange={() => toggleColumn('order')}
                        >
                            Order
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={columnVisibility.note}
                            onCheckedChange={() => toggleColumn('note')}
                        >
                            Note
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Period
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columnVisibility.code && <TableHead className="w-[100px]">Code</TableHead>}
                            {columnVisibility.period && <TableHead>Period</TableHead>}
                            {columnVisibility.status && <TableHead className="text-center">Status</TableHead>}
                            {columnVisibility.order && <TableHead className="text-center">Order</TableHead>}
                            {columnVisibility.note && <TableHead>Note</TableHead>}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {periods.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={visibleColumnsCount} className="text-center h-24 text-muted-foreground">
                                    No project periods found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            periods.map((period) => (
                                <TableRow key={period.id}>
                                    {columnVisibility.code && (
                                        <TableCell className="font-medium">{period.code}</TableCell>
                                    )}
                                    {columnVisibility.period && (
                                        <TableCell>{period.period}</TableCell>
                                    )}
                                    {columnVisibility.status && (
                                        <TableCell className="text-center">
                                            <Badge
                                                variant={period.active ? "default" : "destructive"}
                                                className={
                                                    period.active
                                                        ? "bg-emerald-500 text-white dark:bg-emerald-600 dark:text-white hover:bg-emerald-600 dark:hover:bg-emerald-700 font-medium"
                                                        : "bg-rose-500 text-white dark:bg-rose-600 dark:text-white hover:bg-rose-600 dark:hover:bg-rose-700 font-medium"
                                                }
                                            >
                                                {period.active ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                    )}
                                    {columnVisibility.order && (
                                        <TableCell className="text-center">{period.order}</TableCell>
                                    )}
                                    {columnVisibility.note && (
                                        <TableCell>
                                            <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                                                {period.note || "-"}
                                            </div>
                                        </TableCell>
                                    )}
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(period)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(period.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <ProjectPeriodFormDialog
                open={open}
                onOpenChange={setOpen}
                period={selectedPeriod}
            />
        </div>
    )
}
