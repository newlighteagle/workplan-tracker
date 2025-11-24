import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function seedOutcome() {
    console.log("Seeding Outcomes...")

    // Clear existing data
    await prisma.outcome.deleteMany()

    const outcomes = [
        {
            code: "I",
            description: "Achieved effective sustainable smallholder program governance through commitment and support from the local government, private sector (supply chain actors), stakeholders, and the utilization of MIS"
        },
        {
            code: "II",
            description: "Improved organizational management of smallholder groups toward a professional and productive organization"
        },
        {
            code: "III",
            description: "Improved palm oil yield and quality through the consistent implementation of the Regenerative Agriculture Practices"
        },
        {
            code: "IV",
            description: "Improved labor, women, and children's well-being in the ecosystem of oil palm smallholder farming"
        },
        {
            code: "V",
            description: "Enhanced environmental quality through biodiversity protection, GHG emissions reduction, and deforestation prevention through monitoring and traceability implementation."
        },
        {
            code: "VI",
            description: "Improved access to the market resulted from the compliance of farmers' agricultural practices with sustainability standards"
        },
        {
            code: "VII",
            description: "Empowered women, youth, and other marginalized groups in the decision-making process and established an alternative livelihood business model"
        }
    ]

    for (const outcome of outcomes) {
        await prisma.outcome.create({
            data: outcome
        })
    }

    console.log("Outcomes seeded.")
}