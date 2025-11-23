import { getDistricts } from "@/app/actions/district"
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { DistrictForm } from "./district-form"

export default async function DistrictPage() {
    const districts = await getDistricts()

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Districts</h2>
                    <p className="text-muted-foreground">
                        Manage the list of districts.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <DistrictForm />
                </div>
            </div>
            <DataTable data={districts} columns={columns} searchKey="name" />
        </div>
    )
}
