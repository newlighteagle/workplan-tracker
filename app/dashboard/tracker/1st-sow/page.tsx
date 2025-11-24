import { getDistricts } from "@/app/actions/district"
import { prisma } from "@/lib/prisma"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default async function FirstSowPage() {
    const districts = await getDistricts()

    // Fetch ICS with IcsDetail
    const icsList = await prisma.ics.findMany({
        include: {
            icsDetail: true,
        },
        orderBy: {
            code: "asc",
        },
    })

    // Group ICS by district
    const districtsWithIcs = districts.map(district => ({
        ...district,
        ics: icsList.filter(ics => ics.districtId === district.id)
    }))

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">1st SOW (Nov 2025 - Dec 2026)</h1>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                </p>
                <p className="text-muted-foreground">
                    Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.
                </p>
            </div>

            {/* District and ICS Accordion */}
            <div className="mt-6">
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {districtsWithIcs.map((district) => (
                        <AccordionItem
                            key={district.id}
                            value={`district-${district.id}`}
                            className="border rounded-lg bg-card shadow-sm px-2"
                        >
                            <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50 rounded-md transition-all [&[data-state=open]]:bg-accent/50">
                                <span className="text-lg font-semibold text-foreground">{district.name}</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 pt-2">
                                <div className="mt-2 space-y-1">
                                    <Accordion type="single" collapsible className="w-full">
                                        {district.ics.map((ics) => (
                                            <AccordionItem
                                                key={ics.id}
                                                value={`ics-${ics.id}`}
                                                className="border-b last:border-0 border-border/40"
                                            >
                                                <AccordionTrigger className="py-3 text-sm font-medium hover:text-primary hover:no-underline transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-primary/70" />
                                                        {ics.abbreviation}
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="bg-muted/30 p-4 rounded-md text-sm text-muted-foreground leading-relaxed border border-border/50">
                                                        {ics.icsDetail?.description || "No description available for this ICS."}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}
