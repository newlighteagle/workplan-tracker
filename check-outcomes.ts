import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const count = await prisma.outcome.count()
    console.log(`Total Outcomes: ${count}`)
    const outcomes = await prisma.outcome.findMany()
    console.log(JSON.stringify(outcomes, null, 2))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
