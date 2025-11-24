"use client"

import { usePathname } from "next/navigation"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"

interface Menu {
    title: string
    url: string
    children?: Menu[]
}

interface Ics {
    abbreviation: string | null
    name: string
}

interface District {
    code: string
    name: string
    ics?: Ics[]
}

interface DashboardBreadcrumbProps {
    menus: Menu[]
    districts: District[]
}

export function DashboardBreadcrumb({ menus, districts }: DashboardBreadcrumbProps) {
    const pathname = usePathname()
    const segments = pathname.split("/").filter(Boolean)

    // Helper to find menu title by url
    const findMenuTitle = (url: string): string | null => {
        const find = (items: Menu[]): string | null => {
            for (const item of items) {
                if (item.url === url) return item.title
                if (item.children) {
                    const found = find(item.children)
                    if (found) return found
                }
            }
            return null
        }
        return find(menus)
    }

    // Helper to find district/ICS name
    const findDynamicName = (segment: string) => {
        // Check if it's a district code
        const district = districts.find(d => d.code === segment)
        if (district) return district.name

        // Check if it's an ICS abbreviation (usually follows district)
        // This is a bit loose, but works for now
        for (const d of districts) {
            const ics = d.ics?.find((i) => i.abbreviation === segment)
            if (ics) return ics.name
        }

        return null
    }

    const breadcrumbItems = segments.map((segment, index) => {
        const url = `/${segments.slice(0, index + 1).join("/")}`
        const isLast = index === segments.length - 1

        // 1. Try to find in menus
        let title = findMenuTitle(url)

        // 2. If not found, try dynamic lookup (District/ICS)
        if (!title) {
            title = findDynamicName(segment)
        }

        // 3. Fallback to capitalizing segment
        if (!title) {
            title = segment.charAt(0).toUpperCase() + segment.slice(1)
        }

        return { title, url, isLast }
    })

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbItems.map((item) => (
                    <React.Fragment key={item.url}>
                        <BreadcrumbItem className="hidden md:block">
                            {item.isLast ? (
                                <BreadcrumbPage>{item.title}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {!item.isLast && (
                            <BreadcrumbSeparator className="hidden md:block" />
                        )}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
