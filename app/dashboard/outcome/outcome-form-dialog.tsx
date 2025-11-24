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
import { createOutcome, updateOutcome } from "@/app/actions/outcome"

interface Outcome {
    id: number
    code: string
    description: string
}

interface OutcomeFormDialogProps {
    outcome: Outcome | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OutcomeFormDialog({ outcome, open, onOpenChange }: OutcomeFormDialogProps) {
    const [code, setCode] = useState("")
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (outcome) {
            setCode(outcome.code)
            setDescription(outcome.description)
        } else {
            setCode("")
            setDescription("")
        }
    }, [outcome, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const data = { code, description }
        let result

        if (outcome) {
            result = await updateOutcome(outcome.id, data)
        } else {
            result = await createOutcome(data)
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
                    <DialogTitle>{outcome ? "Edit Outcome" : "Add Outcome"}</DialogTitle>
                    <DialogDescription>
                        {outcome ? "Update existing outcome details." : "Create a new outcome."}
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
                                placeholder="e.g. I, II, III"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter outcome description"
                                required
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
