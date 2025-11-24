"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { createProjectPeriod, updateProjectPeriod } from "@/app/actions/projectperiod"

interface ProjectPeriod {
    id: number
    code: string
    period: string
    note: string | null
    active: boolean
    order: number
}

interface ProjectPeriodFormDialogProps {
    period: ProjectPeriod | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ProjectPeriodFormDialog({ period, open, onOpenChange }: ProjectPeriodFormDialogProps) {
    const [code, setCode] = useState('')
    const [periodName, setPeriodName] = useState('')
    const [active, setActive] = useState(true)
    const [order, setOrder] = useState('')
    const [note, setNote] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter() // Added missing router initialization
    useEffect(() => {
        if (period) {
            setCode(period.code)
            setPeriodName(period.period)
            setActive(period.active)
            setOrder(period.order.toString())
            setNote(period.note || '')
        } else {
            setCode('')
            setPeriodName('')
            setActive(true)
            setOrder('')
            setNote('')
        }
    }, [period])

    // Removed duplicate useEffect that reset fields without note


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const data = {
            code,
            period: periodName,
            active,
            order: parseInt(order),
            note,
        }
        let result

        if (period) {
            result = await updateProjectPeriod(period.id, data)
        } else {
            result = await createProjectPeriod(data)
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{period ? "Edit Project Period" : "Add Project Period"}</DialogTitle>
                    <DialogDescription>
                        {period ? "Update project period details." : "Create a new project period."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="code">Code</Label>
                            <Input
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="e.g. msa-1"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="period">Period</Label>
                            <Input
                                id="period"
                                value={periodName}
                                onChange={(e) => setPeriodName(e.target.value)}
                                placeholder="e.g. 1st SOW"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="active"
                                    checked={active}
                                    onCheckedChange={(checked) => setActive(checked as boolean)}
                                />
                                <Label htmlFor="active" className="cursor-pointer">
                                    Active
                                </Label>
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
