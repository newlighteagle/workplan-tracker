import { getOutputs } from "@/app/actions/output"
import { OutputTable } from "./output-table"

export default async function OutputPage() {
    const result = await getOutputs()
    const outputs = result.success ? result.data : []

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Output Management</h1>
                    <p className="text-muted-foreground">
                        Manage program outputs and their relation to outcomes.
                    </p>
                </div>
            </div>
            <OutputTable outputs={outputs || []} />
        </div>
    )
}
