"use client"

import { DataTable } from "@/components/ui/data-table"
import { IcsForm } from "./ics-form"
import { getColumns } from "./columns"
import { Ics, District } from "@prisma/client"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

type IcsWithDistrict = Ics & {
    district: District
}

interface IcsClientProps {
    icsList: IcsWithDistrict[]
    districts: District[]
}

export function IcsClient({ icsList, districts }: IcsClientProps) {
    const columns = getColumns(districts)
    const [searchColumn, setSearchColumn] = useState<string>("name")
    const [searchValue, setSearchValue] = useState<string>("")

    // Filter data based on selected column and search value
    const filteredData = icsList.filter((item) => {
        if (!searchValue) return true

        if (searchColumn === "name") {
            return item.name.toLowerCase().includes(searchValue.toLowerCase())
        } else if (searchColumn === "district") {
            return item.district.name.toLowerCase().includes(searchValue.toLowerCase())
        }
        return true
    })

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">ICS (Internal Control System)</h2>
                        <p className="text-muted-foreground">
                            Manage the list of ICS.
                            <span className="ml-2 font-semibold text-primary">
                                Total: {icsList.length} ICS
                                {searchValue && (
                                    <span className="ml-1">
                                        (filtered by "{searchColumn === "name" ? "ICS Name" : "District"} | {searchValue}": {filteredData.length} ICS)
                                    </span>
                                )}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <IcsForm districts={districts} />
                </div>
            </div>

            {/* Custom Search Section */}
            <div className="flex items-center space-x-2">
                <Select value={searchColumn} onValueChange={setSearchColumn}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Search by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">ICS Name</SelectItem>
                        <SelectItem value="district">District</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    placeholder={`Search by ${searchColumn === "name" ? "ICS Name" : "District"}...`}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <DataTable data={filteredData} columns={columns} searchKey="" />
        </div>
    )
}
