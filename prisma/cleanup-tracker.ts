import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Cleaning up Tracker menus...')

    // Delete 1st SOW first (child)
    await prisma.menu.deleteMany({
        where: { title: '1st SOW' }
    })

    // Delete Tracker (parent)
    await prisma.menu.deleteMany({
        where: { title: 'Tracker' }
    })

    console.log('Tracker menus deleted.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
