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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Plus } from "lucide-react"
import { deleteOutcome } from "@/app/actions/outcome"
import { useRouter } from "next/navigation"
import { OutcomeFormDialog } from "./outcome-form-dialog"

interface Outcome {
    id: number
    code: string
    description: string
    _count?: {
        outputs: number
    }
}

interface OutcomeTableProps {
    outcomes: Outcome[]
}

export function OutcomeTable({ outcomes }: OutcomeTableProps) {
    const [open, setOpen] = useState(false)
    const [selectedOutcome, setSelectedOutcome] = useState<Outcome | null>(null)
    const [searchColumn, setSearchColumn] = useState<string>("code")
    const [searchValue, setSearchValue] = useState<string>("")
    const router = useRouter()

    const handleEdit = (outcome: Outcome) => {
        setSelectedOutcome(outcome)
        setOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this outcome?")) {
            await deleteOutcome(id)
            router.refresh()
        }
    }

    const handleCreate = () => {
        setSelectedOutcome(null)
        setOpen(true)
    }

    // Filter data based on selected column and search value
    const filteredOutcomes = outcomes.filter((item) => {
        if (!searchValue) return true

        if (searchColumn === "code") {
            return item.code.toLowerCase().includes(searchValue.toLowerCase())
        } else if (searchColumn === "description") {
            return item.description.toLowerCase().includes(searchValue.toLowerCase())
        }
        return true
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">
                            Total: {outcomes.length} Outcomes
                            {searchValue && (
                                <span className="ml-1">
                                    (filtered by "{searchColumn === "code" ? "Code" : "Description"} | {searchValue}": {filteredOutcomes.length} Outcomes)
                                </span>
                            )}
                        </span>
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Outcome
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
                            <TableHead>Description</TableHead>
                            <TableHead className="text-center">Outputs</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOutcomes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    No outcomes found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOutcomes.map((outcome) => (
                                <TableRow key={outcome.id}>
                                    <TableCell className="font-medium">{outcome.code}</TableCell>
                                    <TableCell>{outcome.description}</TableCell>
                                    <TableCell className="text-center">{outcome._count?.outputs || 0}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(outcome)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(outcome.id)}
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
            <OutcomeFormDialog
                open={open}
                onOpenChange={setOpen}
                outcome={selectedOutcome}
            />
        </div>
    )
}
