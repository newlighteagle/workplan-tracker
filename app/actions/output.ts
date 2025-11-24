"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getOutputs() {
    try {
        const outputs = await prisma.output.findMany({
            orderBy: {
                code: "asc",
            },
            include: {
                outcome: true,
                _count: {
                    select: { activities: true }
                }
            }
        })
        return { success: true, data: outputs }
    } catch (error) {
        return { success: false, error: "Failed to fetch outputs" }
    }
}

export async function createOutput(data: { code: string; description: string; outcomeCode: string }) {
    try {
        const existing = await prisma.output.findUnique({
            where: { code: data.code }
        })

        if (existing) {
            return { success: false, error: "Output code already exists" }
        }

        await prisma.output.create({
            data: {
                code: data.code,
                description: data.description,
                outcome: {
                    connect: { code: data.outcomeCode }
                }
            },
        })
        revalidatePath("/dashboard/output")
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, error: "Failed to create output" }
    }
}

export async function updateOutput(id: number, data: { code: string; description: string; outcomeCode: string }) {
    try {
        const existing = await prisma.output.findUnique({
            where: { code: data.code }
        })

        if (existing && existing.id !== id) {
            return { success: false, error: "Output code already exists" }
        }

        await prisma.output.update({
            where: { id },
            data: {
                code: data.code,
                description: data.description,
                outcome: {
                    connect: { code: data.outcomeCode }
                }
            },
        })
        revalidatePath("/dashboard/output")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to update output" }
    }
}

export async function deleteOutput(id: number) {
    try {
        await prisma.output.delete({
            where: { id },
        })
        revalidatePath("/dashboard/output")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to delete output" }
    }
}
