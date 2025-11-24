'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            include: {
                accounts: {
                    select: {
                        provider: true,
                    },
                },
                userMenus: {
                    include: {
                        menu: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return users
    } catch (error) {
        console.error('Failed to fetch users:', error)
        throw new Error('Failed to fetch users')
    }
}

export async function getUserById(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                accounts: true,
                userMenus: {
                    include: {
                        menu: true,
                    },
                },
            },
        })
        return user
    } catch (error) {
        console.error('Failed to fetch user:', error)
        throw new Error('Failed to fetch user')
    }
}

export async function updateUserRole(id: string, role: string) {
    try {
        const user = await prisma.user.update({
            where: { id },
            data: { role },
        })
        revalidatePath('/dashboard/user')
        return { success: true, user }
    } catch (error) {
        console.error('Failed to update user role:', error)
        return { success: false, error: 'Failed to update user role' }
    }
}

export async function deleteUser(id: string) {
    try {
        // Delete related data first
        await prisma.userMenu.deleteMany({
            where: { userId: id },
        })
        await prisma.session.deleteMany({
            where: { userId: id },
        })
        await prisma.account.deleteMany({
            where: { userId: id },
        })

        // Delete user
        await prisma.user.delete({
            where: { id },
        })

        revalidatePath('/dashboard/user')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete user:', error)
        return { success: false, error: 'Failed to delete user' }
    }
}

export async function assignMenusToUser(userId: string, menus: { menuId: number; canRead: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean }[]) {
    try {
        // Delete existing menu assignments
        await prisma.userMenu.deleteMany({
            where: { userId },
        })

        // Create new menu assignments with explicit permission flags
        await prisma.userMenu.createMany({
            data: menus.map(m => ({
                userId: userId,
                menuId: m.menuId,
                canRead: m.canRead,
                canCreate: m.canCreate,
                canUpdate: m.canUpdate,
                canDelete: m.canDelete,
            })),
        })

        revalidatePath('/dashboard/user')
        return { success: true }
    } catch (error) {
        console.error('Failed to assign menus:', error)
        return { success: false, error: 'Failed to assign menus' }
    }
}
