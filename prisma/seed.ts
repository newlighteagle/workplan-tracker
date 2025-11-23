import { PrismaClient } from '@prisma/client'
import { seedUser } from './seeds/seed-table-user'
import { seedMenu } from './seeds/seed-table-menu'
import { seedDistricts } from './seeds/seed-table-districts'
import { seedIcs } from './seeds/seed-table-ics'

const prisma = new PrismaClient()

async function main() {
    await seedUser()
    await seedMenu()
    await seedDistricts()
    await seedIcs()
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
