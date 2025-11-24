import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedIcsDetail() {
    console.log('Seeding ICS Details...')

    // Get all ICS records
    const allIcs = await prisma.ics.findMany()

    // Create IcsDetail for each ICS using their name as description
    for (const ics of allIcs) {
        await prisma.icsDetail.upsert({
            where: { icsId: ics.id },
            update: {
                description: ics.name,
            },
            create: {
                icsId: ics.id,
                description: ics.name,
            },
        })
    }

    console.log(`  - ${allIcs.length} ICS Details seeded.`)
}
