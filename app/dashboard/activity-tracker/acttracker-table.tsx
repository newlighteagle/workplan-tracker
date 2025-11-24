"use client"

import React, { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Plus, Check, X } from "lucide-react"
import { deleteActTracker, updateActTracker } from "@/app/actions/acttracker"
import { useRouter } from "next/navigation"
import { ActTrackerFormDialog } from "./acttracker-form-dialog"

interface ActTracker {
    id: number
    actCode: string
    actDesc: string
    period: string
    deadline: string
    plan: bigint
    actual: bigint
    activity?: {
        name: string
    }
}

interface ActTrackerTableProps {
    actTrackers: ActTracker[]
}

interface EditingCell {
    id: number
    field: 'deadline' | 'plan' | 'actual'
    value: string
}

export function ActTrackerTable({ actTrackers }: ActTrackerTableProps) {
    const [open, setOpen] = useState(false)
    const [selectedTracker, setSelectedTracker] = useState<ActTracker | null>(null)
    const [searchColumn, setSearchColumn] = useState<string>("code")
    const [searchValue, setSearchValue] = useState<string>("")
    const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
    const router = useRouter()

    const handleEdit = (tracker: ActTracker) => {
        setSelectedTracker(tracker)
        setOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this activity tracker?")) {
            await deleteActTracker(id)
            router.refresh()
        }
    }

    const handleDoubleClick = (tracker: ActTracker, field: 'deadline' | 'plan' | 'actual') => {
        const value = field === 'deadline' ? tracker.deadline : tracker[field].toString()
        setEditingCell({ id: tracker.id, field, value })
    }

    const handleCellChange = (value: string) => {
        if (editingCell) {
            setEditingCell({ ...editingCell, value })
        }
    }

    const handleSaveCell = async () => {
        if (!editingCell) return
        const tracker = actTrackers.find(t => t.id === editingCell.id)
        if (!tracker) return
        const data = {
            actCode: tracker.actCode,
            actDesc: tracker.actDesc,
            period: tracker.period,
            deadline: editingCell.field === 'deadline' ? editingCell.value : tracker.deadline,
            plan: editingCell.field === 'plan' ? BigInt(editingCell.value) : tracker.plan,
            actual: editingCell.field === 'actual' ? BigInt(editingCell.value) : tracker.actual,
        }
        await updateActTracker(tracker.id, data)
        setEditingCell(null)
        router.refresh()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveCell()
        } else if (e.key === 'Escape') {
            handleCancelEdit()
        }
    }




    const handleCancelEdit = () => {
        setEditingCell(null)
    }

    const renderEditableCell = (tracker: ActTracker, field: 'deadline' | 'plan' | 'actual', className: string = "") => {
        const isEditing = editingCell?.id === tracker.id && editingCell?.field === field;
        const value = field === 'deadline' ? tracker.deadline : tracker[field].toString();

        if (isEditing) {
            return (
                <div className="flex items-center gap-1">
                    <Input
                        type={field === 'deadline' ? 'text' : 'number'}
                        value={editingCell.value}
                        onChange={(e) => handleCellChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-8 w-24"
                        autoFocus
                    />
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleSaveCell}>
                        <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleCancelEdit}>
                        <X className="h-4 w-4 text-red-600" />
                    </Button>
                </div>
            );
        }

        return (
            <div
                className={`cursor-pointer hover:bg-muted/50 px-2 py-1 rounded ${className}`}
                onDoubleClick={() => handleDoubleClick(tracker, field)}
                title="Double-click to edit"
            >
                {value}
            </div>
        );
    };


    // Filter data based on selected column and search value
    const filteredTrackers = actTrackers.filter((item) => {
        if (!searchValue) return true

        if (searchColumn === "code") {
            return item.actCode.toLowerCase().includes(searchValue.toLowerCase())
        } else if (searchColumn === "description") {
            return item.actDesc.toLowerCase().includes(searchValue.toLowerCase())
        }
        return true
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">
                            Total: {actTrackers.length} Trackers
                            {searchValue && (
                                <span className="ml-1">
                                    (filtered by "{searchColumn === "code" ? "Code" : "Description"} | {searchValue}": {filteredTrackers.length} Trackers)
                                </span>
                            )}
                        </span>
                    </p>
                </div>
                <Button onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Tracker
                </Button>
            </div>

            {/* Search Section */}
            <div className="flex items-center space-x-2">
                <Select value={searchColumn} onValueChange={setSearchColumn}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Search by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="code">Code</SelectItem>
                        <SelectItem value="description">Description</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    placeholder={`Search by ${searchColumn === "code" ? "Code" : "Description"}...`}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Code</TableHead>
                            <TableHead>Activity</TableHead>
                            <TableHead>Period</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead className="text-center">Plan</TableHead>
                            <TableHead className="text-center">Actual</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTrackers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No activity trackers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTrackers.map((tracker) => (
                                <TableRow key={tracker.id}>
                                    <TableCell className="font-medium">{tracker.actCode}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{tracker.activity?.name}</div>
                                        <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                                            {tracker.actDesc}
                                        </div>
                                    </TableCell>
                                    <TableCell>{tracker.period}</TableCell>
                                    <TableCell>
                                        {renderEditableCell(tracker, 'deadline')}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {renderEditableCell(tracker, 'plan', 'text-center')}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {renderEditableCell(tracker, 'actual', 'text-center')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(tracker)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(tracker.id)}
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
            <ActTrackerFormDialog
                open={open}
                onOpenChange={setOpen}
                tracker={selectedTracker}
            />
        </div>
    )
}
