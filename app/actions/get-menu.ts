"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

import { auth } from "@/auth"

export async function getMenu() {
    const session = await auth()
    const role = session?.user?.role || "public"

    const menus = await prisma.menu.findMany({
        where: {
            parentId: null,
        },
        include: {
            children: {
                orderBy: {
                    order: "asc",
                },
            },
        },
        orderBy: {
            order: "asc",
        },
    })

    if (role === "public") {
        return menus.filter((menu) => menu.title === "Dashboard")
    }

    return menus
}
