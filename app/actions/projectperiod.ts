"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getProjectPeriods() {
    try {
        console.log("Fetching project periods...")
        const periods = await prisma.projectPeriod.findMany({
            orderBy: {
                order: "desc",
            },
        })
        console.log(`Fetched ${periods.length} project periods:`, periods)
        return { success: true, data: periods }
    } catch (error) {
        console.error("Error fetching project periods:", error)
        return { success: false, error: "Failed to fetch project periods" }
    }
}

export async function createProjectPeriod(data: {
    code: string
    period: string
    active: boolean
    order: number
    note?: string | null
}) {
    try {
        const existing = await prisma.projectPeriod.findUnique({
            where: { code: data.code }
        })

        if (existing) {
            return { success: false, error: "Project period code already exists" }
        }

        await prisma.projectPeriod.create({
            data: {
                code: data.code,
                period: data.period,
                active: data.active,
                order: data.order,
                note: data.note || null,
            },
        })
        revalidatePath("/dashboard/project-periode")
        return { success: true }
    } catch (error) {
        console.error("Error creating project period:", error)
        return { success: false, error: "Failed to create project period" }
    }
}

export async function updateProjectPeriod(id: number, data: {
    code: string
    period: string
    active: boolean
    order: number
    note?: string | null
}) {
    try {
        const existing = await prisma.projectPeriod.findUnique({
            where: { code: data.code }
        })

        if (existing && existing.id !== id) {
            return { success: false, error: "Project period code already exists" }
        }

        await prisma.projectPeriod.update({
            where: { id },
            data: {
                code: data.code,
                period: data.period,
                active: data.active,
                order: data.order,
                note: data.note || null,
            },
        })
        revalidatePath("/dashboard/project-periode")
        return { success: true }
    } catch (error) {
        console.error("Error updating project period:", error)
        return { success: false, error: "Failed to update project period" }
    }
}

export async function deleteProjectPeriod(id: number) {
    try {
        await prisma.projectPeriod.delete({
            where: { id },
        })
        revalidatePath("/dashboard/project-periode")
        return { success: true }
    } catch (error) {
        console.error("Error deleting project period:", error)
        return { success: false, error: "Failed to delete project period" }
    }
}
