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
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus } from "lucide-react"
import { deleteActivity } from "@/app/actions/activity"
import { useRouter } from "next/navigation"
import { ActivityFormDialog } from "./activity-form-dialog"
import { format } from "date-fns"

interface Activity {
    id: number
    code: string
    name: string
    description: string
    outputCode: string
    startDate: string // Changed to string
    endDate: string   // Changed to string
    status: string
    output?: {
        code: string
        description: string
    }
}

interface ActivityTableProps {
    activities: Activity[]
}

export function ActivityTable({ activities }: ActivityTableProps) {
    const [open, setOpen] = useState(false)
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
    const [searchColumn, setSearchColumn] = useState<string>("code")
    const [searchValue, setSearchValue] = useState<string>("")
    const router = useRouter()

    const handleEdit = (activity: Activity) => {
        setSelectedActivity(activity)
        setOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this activity?")) {
            await deleteActivity(id)
            router.refresh()
        }
    }

    const handleCreate = () => {
        setSelectedActivity(null)
        setOpen(true)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "default"
            case "completed": return "success"
            case "on_hold": return "warning"
            case "cancelled": return "destructive"
            default: return "secondary"
        }
    }

    // Filter data based on selected column and search value
    const filteredActivities = activities.filter((item) => {
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
                            Total: {activities.length} Activities
                            {searchValue && (
                                <span className="ml-1">
                                    (filtered by "{searchColumn === "code" ? "Code" : "Description"} | {searchValue}": {filteredActivities.length} Activities)
                                </span>
                            )}
                        </span>
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Activity
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
                            <TableHead className="w-[100px]">Output</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredActivities.map((activity) => (
                            <TableRow key={activity.id}>
                                <TableCell className="font-medium">{activity.code}</TableCell>
                                <TableCell>{activity.outputCode}</TableCell>
                                <TableCell>
                                    <div className="font-medium">{activity.name}</div>
                                    <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                                        {activity.description}
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm">
                                    <div>{format(new Date(activity.startDate), "MMM d, yyyy")}</div>
                                    <div className="text-muted-foreground text-xs">to {format(new Date(activity.endDate), "MMM d, yyyy")}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusColor(activity.status) as any}>
                                        {activity.status.replace("_", " ")}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(activity)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(activity.id)}
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
            <ActivityFormDialog
                open={open}
                onOpenChange={setOpen}
                activity={selectedActivity}
            />
        </div>
    )
}
