import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedProjectPeriod() {
    console.log('Seeding ProjectPeriod...')

    // Clear existing data
    await prisma.projectPeriod.deleteMany()

    const periods = [
        { code: 'msa-1', period: '1st SOW', active: true, order: 4 },
        { code: 'it-3', period: 'Intermediary 3', active: false, order: 3 },
        { code: 'it-2', period: 'Intermediary 2', active: false, order: 2 },
        { code: 'it-1', period: 'Intermediary 1', active: false, order: 1 },
    ]

    await prisma.projectPeriod.createMany({
        data: periods,
    })

    console.log(`${periods.length} ProjectPeriod records seeded.`)
}
