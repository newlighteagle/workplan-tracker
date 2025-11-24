import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedMenu() {
    console.log('Seeding Menus...')

    // Delete all existing menus and user menu assignments
    await prisma.userMenu.deleteMany({})
    await prisma.menu.deleteMany({})
    console.log('  - Existing menus cleared.')

    // Dashboard
    const dashboard = await prisma.menu.create({
        data: {
            title: 'Dashboard',
            url: '#',
            icon: 'PieChart',
            order: 1,
        },
    })

    await prisma.menu.create({
        data: {
            title: 'Workplan Tracker',
            url: '/dashboard/workplan',
            parentId: dashboard.id,
            order: 1,
        },
    })

    // Master Data
    const masterData = await prisma.menu.create({
        data: {
            title: 'Master Data',
            url: '#',
            icon: 'Map',
            order: 2,
        },
    })

    const masterItems = [
        { title: 'District', url: '/dashboard/district', order: 1 },
        { title: 'ICS', url: '/dashboard/ics', order: 2 },
        { title: 'Outcome', url: '/dashboard/outcome', order: 3 },
        { title: 'Output', url: '/dashboard/output', order: 4 },
        { title: 'Activity', url: '/dashboard/activity', order: 5 },
        { title: 'Activity Tracker', url: '/dashboard/activity-tracker', order: 6 },
        { title: 'Project Periode', url: '/dashboard/project-periode', order: 7 },
        { title: 'User', url: '/dashboard/user', order: 8 },
    ]

    for (const item of masterItems) {
        await prisma.menu.create({
            data: {
                ...item,
                parentId: masterData.id,
            },
        })
    }

    // Tracker
    const tracker = await prisma.menu.create({
        data: {
            title: 'Tracker',
            url: '#',
            icon: 'ClipboardList',
            order: 3,
        },
    })

    await prisma.menu.create({
        data: {
            title: '1st SOW',
            url: '/dashboard/tracker/1st-sow',
            parentId: tracker.id,
            order: 1,
        },
    })

    console.log('  - Menus created.')

    // Assign Menus to Admin
    console.log('Assigning Menus to Admin...')
    const admin = await prisma.user.findUnique({
        where: { email: 'sofyan.agus18@gmail.com' },
    })

    if (admin) {
        const allMenus = await prisma.menu.findMany()
        for (const menu of allMenus) {
            await prisma.userMenu.upsert({
                where: {
                    userId_menuId: {
                        userId: admin.id,
                        menuId: menu.id,
                    },
                },
                update: {
                    canCreate: true,
                    canRead: true,
                    canUpdate: true,
                    canDelete: true,
                },
                create: {
                    userId: admin.id,
                    menuId: menu.id,
                    canCreate: true,
                    canRead: true,
                    canUpdate: true,
                    canDelete: true,
                },
            })
        }
        console.log('  - All menus assigned to admin.')
    } else {
        console.log('  - Admin user not found. Skipping assignment.')
    }
}
