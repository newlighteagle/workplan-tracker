"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getActivities() {
    try {
        const activities = await prisma.activity.findMany({
            orderBy: {
                code: "asc",
            },
            include: {
                output: true,
            }
        })

        // Serialize dates to strings
        const serializedActivities = activities.map(activity => ({
            ...activity,
            startDate: activity.startDate.toISOString(),
            endDate: activity.endDate.toISOString(),
        }))

        return { success: true, data: serializedActivities }
    } catch (error) {
        return { success: false, error: "Failed to fetch activities" }
    }
}

export async function createActivity(data: {
    code: string;
    name: string;
    description: string;
    outputCode: string;
    startDate: Date;
    endDate: Date;
    status: string;
}) {
    try {
        const existing = await prisma.activity.findUnique({
            where: { code: data.code }
        })

        if (existing) {
            return { success: false, error: "Activity code already exists" }
        }

        await prisma.activity.create({
            data: {
                code: data.code,
                name: data.name,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate,
                status: data.status,
                output: {
                    connect: { code: data.outputCode }
                }
            },
        })
        revalidatePath("/dashboard/activity")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to create activity" }
    }
}

export async function updateActivity(id: number, data: {
    code: string;
    name: string;
    description: string;
    outputCode: string;
    startDate: Date;
    endDate: Date;
    status: string;
}) {
    try {
        const existing = await prisma.activity.findUnique({
            where: { code: data.code }
        })

        if (existing && existing.id !== id) {
            return { success: false, error: "Activity code already exists" }
        }

        await prisma.activity.update({
            where: { id },
            data: {
                code: data.code,
                name: data.name,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate,
                status: data.status,
                output: {
                    connect: { code: data.outputCode }
                }
            },
        })
        revalidatePath("/dashboard/activity")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to update activity" }
    }
}

export async function deleteActivity(id: number) {
    try {
        await prisma.activity.delete({
            where: { id },
        })
        revalidatePath("/dashboard/activity")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to delete activity" }
    }
}
