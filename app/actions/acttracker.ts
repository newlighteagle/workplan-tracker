"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getActTrackers() {
    try {
        console.log("Fetching activity trackers...")
        const actTrackers = await prisma.actTracker.findMany({
            orderBy: {
                actCode: "asc",
            },
            include: {
                activity: {
                    select: {
                        name: true,
                    }
                }
            }
        })
        console.log(`Fetched ${actTrackers.length} activity trackers`)
        return { success: true, data: actTrackers }
    } catch (error) {
        console.error("Error fetching activity trackers:", error)
        return { success: false, error: "Failed to fetch activity trackers" }
    }
}

export async function createActTracker(data: {
    actCode: string
    actDesc: string
    period: string
    deadline: string
    plan: bigint
    actual: bigint
    note?: string | null
}) {
    try {
        await prisma.actTracker.create({
            data: {
                activity: { connect: { code: data.actCode } },
                actDesc: data.actDesc,
                period: data.period,
                deadline: data.deadline,
                plan: data.plan,
                actual: data.actual,
                note: data.note || null,
            },
        })
        revalidatePath("/dashboard/activity-tracker")
        return { success: true }
    } catch (error) {
        console.error("Error creating activity tracker:", error)
        return { success: false, error: "Failed to create activity tracker" }
    }
}

export async function updateActTracker(id: number, data: {
    actCode: string
    actDesc: string
    period: string
    deadline: string
    plan: bigint
    actual: bigint
    note?: string | null
}) {
    try {
        await prisma.actTracker.update({
            where: { id },
            data: {
                activity: { connect: { code: data.actCode } },
                actDesc: data.actDesc,
                period: data.period,
                deadline: data.deadline,
                plan: data.plan,
                actual: data.actual,
                note: data.note || null,
            },
        })
        revalidatePath("/dashboard/activity-tracker")
        return { success: true }
    } catch (error) {
        console.error("Error updating activity tracker:", error)
        return { success: false, error: "Failed to update activity tracker" }
    }
}

export async function deleteActTracker(id: number) {
    try {
        await prisma.actTracker.delete({
            where: { id },
        })
        revalidatePath("/dashboard/activity-tracker")
        return { success: true }
    } catch (error) {
        console.error("Error deleting activity tracker:", error)
        return { success: false, error: "Failed to delete activity tracker" }
    }
}
