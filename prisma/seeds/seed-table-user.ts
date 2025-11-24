import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedUser() {
    console.log('Seeding Users...')

    // Skip user seeding - let Google OAuth create the user on first login
    console.log('  - Skipping user seed. User will be created on first Google login.')

    /* 
    // Seed Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'sofyan.agus18@gmail.com' },
        update: {},
        create: {
            email: 'sofyan.agus18@gmail.com',
            name: 'Admin',
            role: 'admin',
        },
    })

    console.log(`  - Admin user seeded: ${admin.email}`)
    */
}
