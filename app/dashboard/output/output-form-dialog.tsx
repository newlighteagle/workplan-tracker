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
import { createOutput, updateOutput } from "@/app/actions/output"
import { getOutcomes } from "@/app/actions/outcome"

interface Output {
    id: number
    code: string
    description: string
    outcomeCode: string
}

interface OutputFormDialogProps {
    output: Output | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OutputFormDialog({ output, open, onOpenChange }: OutputFormDialogProps) {
    const [code, setCode] = useState("")
    const [description, setDescription] = useState("")
    const [outcomeCode, setOutcomeCode] = useState("")
    const [outcomes, setOutcomes] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function fetchOutcomes() {
            const result = await getOutcomes()
            if (result.success && result.data) {
                setOutcomes(result.data)
            }
        }
        if (open) {
            fetchOutcomes()
        }
    }, [open])

    useEffect(() => {
        if (output) {
            setCode(output.code)
            setDescription(output.description)
            setOutcomeCode(output.outcomeCode)
        } else {
            setCode("")
            setDescription("")
            setOutcomeCode("")
        }
    }, [output, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const data = { code, description, outcomeCode }
        let result

        if (output) {
            result = await updateOutput(output.id, data)
        } else {
            result = await createOutput(data)
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
                    <DialogTitle>{output ? "Edit Output" : "Add Output"}</DialogTitle>
                    <DialogDescription>
                        {output ? "Update existing output details." : "Create a new output."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="outcome">Outcome</Label>
                            <Select value={outcomeCode} onValueChange={setOutcomeCode} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select outcome" />
                                </SelectTrigger>
                                <SelectContent>
                                    {outcomes.map((o) => (
                                        <SelectItem key={o.id} value={o.code}>
                                            {o.code} - {o.description.substring(0, 50)}...
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="code">Code</Label>
                            <Input
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="e.g. 1.1.1"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter output description"
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
