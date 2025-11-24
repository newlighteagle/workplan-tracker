import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedIcs() {
    console.log('Seeding ICS...')

    // Raw data from user
    const rawData = [
        { districtCode: '1406', districtName: 'Kampar', code: 'ICS-1406-01', fid: 'APSS', abbreviation: 'APSS - Sei Galuh', name: 'Asosiasi Petani Sawit Swadaya Sei Galuh' },
        { districtCode: '1406', districtName: 'Kampar', code: 'ICS-1406-02', fid: 'KSM', abbreviation: 'KUD Karya Sembada', name: 'KUD Karya Sembada' },
        { districtCode: '1406', districtName: 'Kampar', code: 'ICS-1406-03', fid: 'HJP', abbreviation: 'KUD Hasrat Jaya Pagaruyung', name: 'KUD Hasrat Jaya Pagaruyung' },
        { districtCode: '1406', districtName: 'Kampar', code: 'ICS-1406-04', fid: 'FK', abbreviation: 'FORTASKI', name: 'Forum Petani Sawit Kijang Rejo (FORTASKI)' },
        { districtCode: '1406', districtName: 'Kampar', code: 'ICS-1406-05', fid: 'SGO', abbreviation: 'FPS - Sei Garo', name: 'Forum Petani Sawit Sei Garo (FPS-Sei Garo)' },
        { districtCode: '1406', districtName: 'Kampar', code: 'ICS-1406-06', fid: 'KBM', abbreviation: 'KP KBM', name: 'KP. Kusuma Bakti Mandiri' },
        { districtCode: '1406', districtName: 'Kampar', code: 'ICS-1406-07', fid: 'KTM', abbreviation: 'Kopsa Tri Manunggal', name: 'Kopsa Tri Manunggal' },
        { districtCode: '1406', districtName: 'Kampar', code: 'ICS-1406-08', fid: 'TSL', abbreviation: 'TSL', name: 'Teratai Sawit Lestari - Sungai Putih' },
        { districtCode: '1406', districtName: 'Kampar', code: 'ICS-1406-09', fid: 'PPKS-PBS', abbreviation: 'PPKS-PBS', name: 'Perkumpulan Petani Kelapa Sawit - Pangkalan Baru Sejahtera' },
        { districtCode: '1406', districtName: 'Kampar', code: 'ICS-1406-10', fid: 'MPH', abbreviation: 'KUD Mitra Petani Hangtuah', name: 'KUD Mitra Petani Hangtuah' },
        { districtCode: '1406', districtName: 'Kampar', code: 'ICS-1406-11', fid: 'KMS', abbreviation: 'Koperasi Mekar Sejahtera', name: 'Koperasi Mekar Sejahtera' },
        { districtCode: '1406', districtName: 'Kampar', code: 'ICS-1406-12', fid: 'KAS', abbreviation: 'Asosiasi ?? - Kepau Jaya', name: 'Asosiasi ?? - Kepau Jaya' },
        { districtCode: '1404', districtName: 'Pelalawan', code: 'ICS-1404-01', fid: 'MUL', abbreviation: 'KUD Mulia', name: 'KUD Mulia' },
        { districtCode: '1407', districtName: 'Rokan Hulu', code: 'ICS-1407-01', fid: 'TJP', abbreviation: 'KUD Tujuh Permata', name: 'KUD Tujuh Permata' },
        { districtCode: '1407', districtName: 'Rokan Hulu', code: 'ICS-1407-02', fid: 'ITM', abbreviation: 'KUD Intan Makmur', name: 'KUD Intan Makmur' },
        { districtCode: '1407', districtName: 'Rokan Hulu', code: 'ICS-1407-03', fid: 'SSJ', abbreviation: 'KUD Sawit Sejahtera', name: 'KUD Sawit Sejahtera' },
        { districtCode: '1407', districtName: 'Rokan Hulu', code: 'ICS-1407-04', fid: 'SM', abbreviation: 'FPSS Semarak Mudo', name: 'FPSS Semarak Mudo' },
        { districtCode: '1407', districtName: 'Rokan Hulu', code: 'ICS-1407-05', fid: 'TBR', abbreviation: 'PPKSS Tayo Barokah', name: 'PPKSS Tayo Barokah' },
        { districtCode: '1407', districtName: 'Rokan Hulu', code: 'ICS-1407-06', fid: 'SKPE', abbreviation: 'APKASA Rayon SKPE', name: 'APKASA Rayon SKPE' },
        { districtCode: '1407', districtName: 'Rokan Hulu', code: 'ICS-1407-07', fid: 'RAS', abbreviation: 'ASPEK RAS', name: 'Asosiasi Petani Kelapa Sawit Rantau Kasai' },
        { districtCode: '1407', districtName: 'Rokan Hulu', code: 'ICS-1407-08', fid: 'ASPEK RSB', abbreviation: 'ASPEK RSB', name: 'Asosiasi Petani Kelapa Sawit Rambah Samo' },
        { districtCode: '1407', districtName: 'Rokan Hulu', code: 'ICS-1407-09', fid: 'KRE', abbreviation: 'ASPEK KRE', name: 'Asosiasi Petani Kelapa Sawit Kenegrian Rokan Emas' },
        { districtCode: '1407', districtName: 'Rokan Hulu', code: 'ICS-1407-10', fid: 'CTG', abbreviation: 'Citra Gemilang', name: 'Citra Gemilang' },
        { districtCode: '1407', districtName: 'Rokan Hulu', code: 'ICS-1407-11', fid: 'TSS', abbreviation: 'Kelompok Tani Sungai Singkumeh', name: 'Kelompok Tani Sungai Singkumeh' },
        { districtCode: '1405', districtName: 'Siak', code: 'ICS-1405-01', fid: 'KMJ', abbreviation: 'KPM KM', name: 'Koperasi Produsen Mandiri Karya Maju' },
        { districtCode: '1405', districtName: 'Siak', code: 'ICS-1405-02', fid: 'DYN', abbreviation: 'APKASDU', name: 'Asosiasi Petani Kelapa Sawit Dayun Bersatu' },
        { districtCode: '1405', districtName: 'Siak', code: 'ICS-1405-03', fid: 'SMB', abbreviation: 'APKSMB', name: 'Asosiasi Petani Kelapa Sawit Mempura Bersatu' },
        { districtCode: '1405', districtName: 'Siak', code: 'ICS-1405-04', fid: 'MIS', abbreviation: 'ASERMISAS', name: 'Asosiasi Sertifikasi Mitra Sawit Siak' },
        { districtCode: '1405', districtName: 'Siak', code: 'ICS-1405-05', fid: 'SSB', abbreviation: 'APKSSB', name: 'Asosiasi Petani Kelapa Sawit Siak Bersatu' },
        { districtCode: '1405', districtName: 'Siak', code: 'ICS-1405-06', fid: 'SAI', abbreviation: 'APKASAIBER', name: 'Asosiasi Petani Kelapa Sawit Sungai Apit Bersatu' },
        { districtCode: '1405', districtName: 'Siak', code: 'ICS-1405-07', fid: 'SAB', abbreviation: 'ASPEKSAB', name: 'Asosiasi Petani Kelapa Sawit Sabak Auh Bersatu' },
        { districtCode: '1405', districtName: 'Siak', code: 'ICS-1405-08', fid: 'RAP', abbreviation: 'KP PKSJ', name: 'Koperasi Produsen Putera Karya Siak Jaya' },
        { districtCode: '1405', districtName: 'Siak', code: 'ICS-1405-09', fid: 'KBJ', abbreviation: 'KBJ', name: 'Koperasi Beringin Jaya' },
        { districtCode: '1405', districtName: 'Siak', code: 'ICS-1405-10', fid: 'KSJ', abbreviation: 'KSJ', name: 'Koperasi Sawit Jaya' },
        { districtCode: '1405', districtName: 'Siak', code: 'ICS-1405-11', fid: 'MNS', abbreviation: 'KT Delima HPTR Minas', name: 'KT Delima HPTR Minas' },
        { districtCode: '1405', districtName: 'Siak', code: 'ICS-1405-12', fid: 'GU2', abbreviation: 'Gapoktan Unit 2', name: 'Gapoktan Unit 2' },
    ]

    for (const item of rawData) {
        // Find District by Code
        const district = await prisma.district.findUnique({
            where: { code: item.districtCode },
        })

        if (!district) {
            console.warn(`  - District not found for code: ${item.districtCode}. Skipping ICS: ${item.code}`)
            continue
        }

        await prisma.ics.upsert({
            where: { code: item.code },
            update: {
                name: item.name,
                fid: item.fid,
                abbreviation: item.abbreviation,
                districtId: district.id,
            },
            create: {
                code: item.code,
                name: item.name,
                fid: item.fid,
                abbreviation: item.abbreviation,
                districtId: district.id,
            },
        })
    }
    console.log('  - ICS seeded.')
}