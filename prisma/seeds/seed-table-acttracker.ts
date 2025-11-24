import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedActTracker() {
    console.log('Seeding ActTracker...')

    // Clear existing data
    await prisma.actTracker.deleteMany()

    // Get all activities
    const activities = await prisma.activity.findMany({
        select: {
            code: true,
            description: true,
        },
    })

    // Create ActTracker records for each activity
    const actTrackerData = activities.map((activity) => ({
        actCode: activity.code,
        actDesc: activity.description,
        period: '1st SOW',
        deadline: 'dec-2026',
        plan: BigInt(1),
        actual: BigInt(0),
    }))

    await prisma.actTracker.createMany({
        data: actTrackerData,
    })

    console.log(`${actTrackerData.length} ActTracker records seeded.`)
}
