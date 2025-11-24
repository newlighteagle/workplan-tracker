"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getOutcomes() {
    try {
        console.log("Fetching outcomes...")
        const outcomes = await prisma.outcome.findMany({
            orderBy: {
                code: "asc",
            },
            include: {
                _count: {
                    select: { outputs: true }
                }
            }
        })
        console.log(`Fetched ${outcomes.length} outcomes`)
        return { success: true, data: outcomes }
    } catch (error) {
        console.error("Error fetching outcomes:", error)
        return { success: false, error: "Failed to fetch outcomes" }
    }
}

export async function createOutcome(data: { code: string; description: string }) {
    try {
        const existing = await prisma.outcome.findUnique({
            where: { code: data.code }
        })

        if (existing) {
            return { success: false, error: "Outcome code already exists" }
        }

        await prisma.outcome.create({
            data: {
                code: data.code,
                description: data.description,
            },
        })
        revalidatePath("/dashboard/outcome")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to create outcome" }
    }
}

export async function updateOutcome(id: number, data: { code: string; description: string }) {
    try {
        // Check if code is being changed and if it conflicts
        const existing = await prisma.outcome.findUnique({
            where: { code: data.code }
        })

        if (existing && existing.id !== id) {
            return { success: false, error: "Outcome code already exists" }
        }

        await prisma.outcome.update({
            where: { id },
            data: {
                code: data.code,
                description: data.description,
            },
        })
        revalidatePath("/dashboard/outcome")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to update outcome" }
    }
}

export async function deleteOutcome(id: number) {
    try {
        await prisma.outcome.delete({
            where: { id },
        })
        revalidatePath("/dashboard/outcome")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to delete outcome" }
    }
}
