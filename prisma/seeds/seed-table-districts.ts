import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedDistricts() {
    console.log('Seeding Districts...')
    const districts = [
        { code: '1404', name: 'Pelalawan' },
        { code: '1405', name: 'Siak' },
        { code: '1406', name: 'Kampar' },
        { code: '1407', name: 'Rokan Hulu' },
    ]

    for (const district of districts) {
        await prisma.district.upsert({
            where: { code: district.code },
            update: { name: district.name },
            create: {
                code: district.code,
                name: district.name,
            },
        })
    }
    console.log('  - Districts seeded.')
}
