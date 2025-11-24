"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getMenu() {
    const session = await auth()
    const role = session?.user?.role || "public"
    const userId = session?.user?.id

    // Admin (or any role with full access) gets all menus
    if (role === "admin" || role === "administrator") {
        const allMenus = await prisma.menu.findMany({
            where: { parentId: null },
            include: {
                children: {
                    orderBy: { order: "asc" },
                },
            },
            orderBy: { order: "asc" },
        })
        return allMenus
    }

    // For regular users, fetch allowed menu IDs from UserMenu (canRead = true)
    if (userId) {
        const allowed = await prisma.userMenu.findMany({
            where: { userId, canRead: true },
            select: { menuId: true },
        })
        const allowedIds = allowed.map((a) => a.menuId)
        if (allowedIds.length === 0) {
            // No menus assigned – return empty array
            return []
        }
        const menus = await prisma.menu.findMany({
            where: {
                id: { in: allowedIds },
                parentId: null,
            },
            include: {
                children: {
                    where: { id: { in: allowedIds } },
                    orderBy: { order: "asc" },
                },
            },
            orderBy: { order: "asc" },
        })
        return menus
    }

    // Fallback: public users only see Dashboard
    const publicMenus = await prisma.menu.findMany({
        where: { parentId: null },
        include: { children: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
    })
    return publicMenus.filter((menu) => menu.title === "Dashboard")
}
