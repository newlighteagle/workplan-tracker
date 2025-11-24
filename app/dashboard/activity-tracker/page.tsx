import { getActTrackers } from "@/app/actions/acttracker"
import { ActTrackerTable } from "./acttracker-table"

export default async function ActivityTrackerPage() {
    const result = await getActTrackers()
    const actTrackers = result.success ? result.data : []

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Activity Tracker</h1>
                    <p className="text-muted-foreground">
                        Track activity progress, plans, and actuals per period.
                    </p>
                </div>
            </div>
            <ActTrackerTable actTrackers={actTrackers || []} />
        </div>
    )
}
