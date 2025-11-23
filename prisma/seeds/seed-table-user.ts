import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedUser() {
    console.log('Seeding Users...')
    // Seed Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'sofyan.agus18@gmail.com' },
        update: {},
        create: {
            name: 'sofyan',
            email: 'sofyan.agus18@gmail.com',
            role: 'administrator',
        },
    })
    console.log('  - Admin user seeded:', admin.email)
}

