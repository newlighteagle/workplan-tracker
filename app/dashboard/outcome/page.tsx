import { getOutcomes } from "@/app/actions/outcome"
import { OutcomeTable } from "./outcome-table"

export default async function OutcomePage() {
    const result = await getOutcomes()
    console.log("OutcomePage result:", result)
    const outcomes = result.success ? result.data : []

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Outcome Management</h1>
                    <p className="text-muted-foreground">
                        Manage program outcomes and their descriptions.
                    </p>
                </div>
            </div>
            <OutcomeTable outcomes={outcomes || []} />
        </div>
    )
}
