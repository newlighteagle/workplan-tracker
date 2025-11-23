"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const icsSchema = z.object({
    code: z.string().min(1, "Code is required"),
    name: z.string().min(1, "Name is required"),
    fid: z.string().optional(),
    abbreviation: z.string().optional(),
    description: z.string().optional(),
    districtId: z.coerce.number().min(1, "District is required"),
})

export async function getIcs() {
    return await prisma.ics.findMany({
        include: {
            district: true,
        },
        orderBy: {
            code: "asc",
        },
    })
}

export async function createIcs(data: z.infer<typeof icsSchema>) {
    const result = icsSchema.safeParse(data)

    if (!result.success) {
        return { error: "Invalid data" }
    }

    try {
        await prisma.ics.create({
            data: result.data,
        })
        revalidatePath("/dashboard/ics")
        return { success: true }
    } catch (error) {
        return { error: "Failed to create ICS. Code might be duplicate." }
    }
}

export async function updateIcs(id: number, data: z.infer<typeof icsSchema>) {
    const result = icsSchema.safeParse(data)

    if (!result.success) {
        return { error: "Invalid data" }
    }

    try {
        await prisma.ics.update({
            where: { id },
            data: result.data,
        })
        revalidatePath("/dashboard/ics")
        return { success: true }
    } catch (error) {
        return { error: "Failed to update ICS." }
    }
}

export async function deleteIcs(id: number) {
    try {
        await prisma.ics.delete({
            where: { id },
        })
        revalidatePath("/dashboard/ics")
        return { success: true }
    } catch (error) {
        return { error: "Failed to delete ICS." }
    }
}
