export default function TrackerDetailPage({
    params,
}: {
    params: { districtCode: string; icsAbbreviation: string }
}) {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Workplan Tracker - {params.districtCode} / {params.icsAbbreviation}
                    </h1>
                    <p className="text-muted-foreground">
                        Manage workplan activities for this ICS
                    </p>
                </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <p className="text-muted-foreground">
                    Workplan tracker content will be implemented here.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    District Code: <span className="font-semibold">{params.districtCode}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                    ICS: <span className="font-semibold">{params.icsAbbreviation}</span>
                </p>
            </div>
        </div>
    )
}
