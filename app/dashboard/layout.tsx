import { AppSidebar } from "@/components/app-sidebar"
import { DashboardBreadcrumb } from "./dashboard-breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import { ModeToggle } from "@/components/mode-toggle"
import { getMenu } from "@/app/actions/get-menu"
import { getDistricts } from "@/app/actions/district"
import { getIcs } from "@/app/actions/ics"
import { auth } from "@/auth"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const menus = await getMenu()
    const session = await auth()
    const districts = await getDistricts()
    const icsList = await getIcs()

    // Group ICS by district
    const districtsWithIcs = districts.map(district => ({
        ...district,
        ics: icsList.filter(ics => ics.districtId === district.id)
    }))

    return (
        <SidebarProvider>
            <AppSidebar
                menus={menus}
                districts={districtsWithIcs}
                user={{
                    name: session?.user?.name || "User",
                    email: session?.user?.email || "user@example.com",
                    avatar: session?.user?.image || "/avatars/shadcn.jpg",
                }}
            />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <DashboardBreadcrumb menus={menus} districts={districtsWithIcs} />
                    </div>
                    <div className="ml-auto flex items-center gap-2 px-4">
                        <NavUser user={{
                            name: session?.user?.name || "User",
                            email: session?.user?.email || "user@example.com",
                            avatar: session?.user?.image || "/avatars/shadcn.jpg",
                        }} />
                        <ModeToggle />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
