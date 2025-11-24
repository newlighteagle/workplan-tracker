"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createActivity, updateActivity } from "@/app/actions/activity"
import { getOutputs } from "@/app/actions/output"

interface Activity {
    id: number
    code: string
    name: string
    description: string
    outputCode: string
    startDate: string // Changed to string
    endDate: string   // Changed to string
    status: string
}

interface ActivityFormDialogProps {
    activity: Activity | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ActivityFormDialog({ activity, open, onOpenChange }: ActivityFormDialogProps) {
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [outputCode, setOutputCode] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [status, setStatus] = useState("active")
    const [outputs, setOutputs] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function fetchOutputs() {
            const result = await getOutputs()
            if (result.success && result.data) {
                setOutputs(result.data)
            }
        }
        if (open) {
            fetchOutputs()
        }
    }, [open])

    useEffect(() => {
        if (activity) {
            setCode(activity.code)
            setName(activity.name)
            setDescription(activity.description)
            setOutputCode(activity.outputCode)
            // Handle string date from server
            setStartDate(new Date(activity.startDate).toISOString().split('T')[0])
            setEndDate(new Date(activity.endDate).toISOString().split('T')[0])
            setStatus(activity.status)
        } else {
            setCode("")
            setName("")
            setDescription("")
            setOutputCode("")
            setStartDate("")
            setEndDate("")
            setStatus("active")
        }
    }, [activity, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const data = {
            code,
            name,
            description,
            outputCode,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status,
        }
        let result

        if (activity) {
            result = await updateActivity(activity.id, data)
        } else {
            result = await createActivity(data)
        }

        setLoading(false)

        if (result.success) {
            onOpenChange(false)
            router.refresh()
        } else {
            alert(result.error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{activity ? "Edit Activity" : "Add Activity"}</DialogTitle>
                    <DialogDescription>
                        {activity ? "Update existing activity details." : "Create a new activity."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="output">Output</Label>
                            <Select value={outputCode} onValueChange={setOutputCode} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select output" />
                                </SelectTrigger>
                                <SelectContent>
                                    {outputs.map((o) => (
                                        <SelectItem key={o.id} value={o.code}>
                                            {o.code} - {o.description.substring(0, 50)}...
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="code">Code</Label>
                                <Input
                                    id="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="e.g. 1.1.1.1"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="on_hold">On Hold</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Activity name"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Activity description"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
