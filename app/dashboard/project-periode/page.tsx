import { getProjectPeriods } from "@/app/actions/projectperiod"
import { ProjectPeriodTable } from "./projectperiod-table"

export default async function ProjectPeriodePage() {
    const result = await getProjectPeriods()
    console.log("ProjectPeriodePage result:", result)
    const periods = result.success ? result.data : []

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Project Periode</h1>
                    <p className="text-muted-foreground">
                        Manage project periods and their ordering.
                    </p>
                </div>
            </div>
            <ProjectPeriodTable periods={periods || []} />
        </div>
    )
}
