"use client"

import { ChevronRight } from "lucide-react"
import { useState } from "react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface IcsItem {
    id: number
    abbreviation: string | null
    districtId: number
}

interface DistrictItem {
    id: number
    code: string
    name: string
    ics: IcsItem[]
}

interface TrackerNavProps {
    districts: DistrictItem[]
}

export function TrackerNav({ districts }: TrackerNavProps) {
    const [openDistricts, setOpenDistricts] = useState<Record<number, boolean>>({})

    const toggleDistrict = (districtId: number) => {
        setOpenDistricts(prev => ({
            ...prev,
            [districtId]: !prev[districtId]
        }))
    }

    return (
        <SidebarMenuSub>
            <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                    <a href="/dashboard/tracker/1st-sow">
                        <span>1st SOW</span>
                    </a>
                </SidebarMenuSubButton>

                {/* District Level */}
                <SidebarMenuSub className="ml-4">
                    {districts.map((district) => (
                        <Collapsible
                            key={district.id}
                            open={openDistricts[district.id]}
                            onOpenChange={() => toggleDistrict(district.id)}
                        >
                            <SidebarMenuSubItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuSubButton className="w-full">
                                        <span className="text-xs">{district.name}</span>
                                        <ChevronRight className="ml-auto h-3 w-3 transition-transform duration-200 data-[state=open]:rotate-90" />
                                    </SidebarMenuSubButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    {/* ICS Level */}
                                    <SidebarMenuSub className="ml-4">
                                        {district.ics.map((ics) => (
                                            <SidebarMenuSubItem key={ics.id}>
                                                <SidebarMenuSubButton asChild>
                                                    <a href={`/dashboard/tracker/1st-sow/${district.code}/${ics.abbreviation}`}>
                                                        <span className="text-xs">{ics.abbreviation}</span>
                                                    </a>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuSubItem>
                        </Collapsible>
                    ))}
                </SidebarMenuSub>
            </SidebarMenuSubItem>
        </SidebarMenuSub>
    )
}
