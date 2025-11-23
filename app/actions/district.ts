"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const districtSchema = z.object({
    code: z.string().min(1, "Code is required"),
    name: z.string().min(1, "Name is required"),
})

export async function getDistricts() {
    return await prisma.district.findMany({
        orderBy: {
            code: "asc",
        },
    })
}

export async function createDistrict(data: z.infer<typeof districtSchema>) {
    const result = districtSchema.safeParse(data)

    if (!result.success) {
        return { error: "Invalid data" }
    }

    try {
        await prisma.district.create({
            data: result.data,
        })
        revalidatePath("/dashboard/district")
        return { success: true }
    } catch (error) {
        return { error: "Failed to create district. Code might be duplicate." }
    }
}

export async function updateDistrict(id: number, data: z.infer<typeof districtSchema>) {
    const result = districtSchema.safeParse(data)

    if (!result.success) {
        return { error: "Invalid data" }
    }

    try {
        await prisma.district.update({
            where: { id },
            data: result.data,
        })
        revalidatePath("/dashboard/district")
        return { success: true }
    } catch (error) {
        return { error: "Failed to update district." }
    }
}

export async function deleteDistrict(id: number) {
    try {
        await prisma.district.delete({
            where: { id },
        })
        revalidatePath("/dashboard/district")
        return { success: true }
    } catch (error) {
        return { error: "Failed to delete district." }
    }
}
