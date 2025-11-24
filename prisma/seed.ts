import { PrismaClient } from '@prisma/client'
import { seedUser } from './seeds/seed-table-user'
import { seedMenu } from './seeds/seed-table-menu'
import { seedDistricts } from './seeds/seed-table-districts'
import { seedIcs } from './seeds/seed-table-ics'
import { seedIcsDetail } from './seeds/seed-table-icsdetail'
import { seedOutcome } from './seeds/seed-table-outcome'
import { seedOutput } from './seeds/seed-table-output'
import { seedActivity } from './seeds/seed-table-activity'
import { seedActTracker } from './seeds/seed-table-acttracker'
import { seedProjectPeriod } from './seeds/seed-table-projectperiod'

const prisma = new PrismaClient()

async function main() {
    await seedUser()
    await seedMenu()
    await seedDistricts()
    await seedIcs()
    await seedIcsDetail()
    await seedOutcome()
    await seedOutput()
    await seedActivity()
    await seedActTracker()
    await seedProjectPeriod()
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
