import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Cleaning up user and related data...')

    // Delete all user-related data
    await prisma.userMenu.deleteMany({})
    await prisma.account.deleteMany({})
    await prisma.session.deleteMany({})
    await prisma.user.deleteMany({})

    console.log('User data cleaned.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
