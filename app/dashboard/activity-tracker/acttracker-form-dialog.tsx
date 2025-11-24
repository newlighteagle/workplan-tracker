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
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createActTracker, updateActTracker } from "@/app/actions/acttracker"
import { getActivities } from "@/app/actions/activity"

interface ActTracker {
    id: number
    actCode: string
    actDesc: string
    period: string
    deadline: string
    plan: bigint
    actual: bigint
    note?: string | null
}

interface ActTrackerFormDialogProps {
    tracker: ActTracker | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ActTrackerFormDialog({ tracker, open, onOpenChange }: ActTrackerFormDialogProps) {
    const [actCode, setActCode] = useState("")
    const [actDesc, setActDesc] = useState("")
    const [period, setPeriod] = useState("")
    const [deadline, setDeadline] = useState("")
    const [plan, setPlan] = useState("")
    const [actual, setActual] = useState("")
    const [activities, setActivities] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [note, setNote] = useState("")

    useEffect(() => {
        async function fetchActivities() {
            const result = await getActivities()
            if (result.success && result.data) {
                setActivities(result.data)
            }
        }
        if (open) {
            fetchActivities()
        }
    }, [open])

    useEffect(() => {
        if (tracker) {
            setActCode(tracker.actCode)
            setActDesc(tracker.actDesc)
            setPeriod(tracker.period)
            setDeadline(tracker.deadline)
            setPlan(tracker.plan.toString())
            setActual(tracker.actual.toString())
            setNote(tracker.note || "")
        } else {
            setActCode("")
            setActDesc("")
            setPeriod("")
            setDeadline("")
            setPlan("")
            setActual("")
            setNote("")
        }
    }, [tracker, open])

    const handleActivityChange = (code: string) => {
        setActCode(code)
        const activity = activities.find(a => a.code === code)
        if (activity) {
            setActDesc(activity.description)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const data = {
            actCode,
            actDesc,
            period,
            deadline,
            plan: BigInt(plan),
            actual: BigInt(actual),
            note,
        }
        let result

        if (tracker) {
            result = await updateActTracker(tracker.id, data)
        } else {
            result = await createActTracker(data)
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
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{tracker ? "Edit Activity Tracker" : "Add Activity Tracker"}</DialogTitle>
                    <DialogDescription>
                        {tracker ? "Update activity tracker details." : "Create a new activity tracker."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="activity">Activity</Label>
                            <Select value={actCode} onValueChange={handleActivityChange} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select activity" />
                                </SelectTrigger>
                                <SelectContent>
                                    {activities.map((a) => (
                                        <SelectItem key={a.id} value={a.code}>
                                            {a.code} - {a.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="actDesc">Activity Description</Label>
                            <Textarea
                                id="actDesc"
                                value={actDesc}
                                onChange={(e) => setActDesc(e.target.value)}
                                placeholder="Activity description"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="period">Period</Label>
                                <Input
                                    id="period"
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    placeholder="e.g. 1st SOW"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="deadline">Deadline</Label>
                                <Input
                                    id="deadline"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    placeholder="e.g. dec-2026"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="plan">Plan</Label>
                                <Input
                                    id="plan"
                                    type="number"
                                    value={plan}
                                    onChange={(e) => setPlan(e.target.value)}
                                    placeholder="0"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="actual">Actual</Label>
                                <Input
                                    id="actual"
                                    type="number"
                                    value={actual}
                                    onChange={(e) => setActual(e.target.value)}
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="note">Note</Label>
                            <RichTextEditor
                                value={note}
                                onChange={setNote}
                                placeholder="Optional note"
                            />
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
