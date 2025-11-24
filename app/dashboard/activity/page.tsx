import { getActivities } from "@/app/actions/activity"
import { ActivityTable } from "./activity-table"

export default async function ActivityPage() {
    const result = await getActivities()
    const activities = result.success ? result.data : []

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Activity Management</h1>
                    <p className="text-muted-foreground">
                        Manage program activities, timelines, and status.
                    </p>
                </div>
            </div>
            <ActivityTable activities={activities || []} />
        </div>
    )
}
