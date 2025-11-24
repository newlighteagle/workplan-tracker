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
import { deleteOutput } from "@/app/actions/output"
import { useRouter } from "next/navigation"
import { OutputFormDialog } from "./output-form-dialog"

interface Output {
    id: number
    code: string
    description: string
    outcomeCode: string
    outcome?: {
        code: string
        description: string
    }
    _count?: {
        activities: number
    }
}

interface OutputTableProps {
    outputs: Output[]
}

export function OutputTable({ outputs }: OutputTableProps) {
    const [open, setOpen] = useState(false)
    const [selectedOutput, setSelectedOutput] = useState<Output | null>(null)
    const [searchColumn, setSearchColumn] = useState<string>("code")
    const [searchValue, setSearchValue] = useState<string>("")
    const router = useRouter()

    const handleEdit = (output: Output) => {
        setSelectedOutput(output)
        setOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this output?")) {
            await deleteOutput(id)
            router.refresh()
        }
    }

    const handleCreate = () => {
        setSelectedOutput(null)
        setOpen(true)
    }

    // Filter data based on selected column and search value
    const filteredOutputs = outputs.filter((item) => {
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
                            Total: {outputs.length} Outputs
                            {searchValue && (
                                <span className="ml-1">
                                    (filtered by "{searchColumn === "code" ? "Code" : "Description"} | {searchValue}": {filteredOutputs.length} Outputs)
                                </span>
                            )}
                        </span>
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Output
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
                            <TableHead className="w-[100px]">Outcome</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-center">Activities</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOutputs.map((output) => (
                            <TableRow key={output.id}>
                                <TableCell className="font-medium">{output.code}</TableCell>
                                <TableCell>{output.outcomeCode}</TableCell>
                                <TableCell>{output.description}</TableCell>
                                <TableCell className="text-center">{output._count?.activities || 0}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(output)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(output.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <OutputFormDialog
                open={open}
                onOpenChange={setOpen}
                output={selectedOutput}
            />
        </div>
    )
}
