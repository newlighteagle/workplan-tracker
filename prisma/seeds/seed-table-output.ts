import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function seedOutput() {
    console.log("Seeding Outputs...")

    // Clear existing data
    await prisma.output.deleteMany()

    const outputs = [
        { outcomeCode: "I", code: "1.1.1", description: "Established functioning Smallholder Hub governance" },
        { outcomeCode: "I", code: "1.2.1", description: "Regular coordination meetings and information exchange between WRI Indonesia and local stakeholders" },
        { outcomeCode: "II", code: "2.1.1", description: "Established smallholder organizations that are recognized legally by the Indonesian laws" },
        { outcomeCode: "II", code: "2.1.2", description: "Established functioning Group Management System or ICS" },
        { outcomeCode: "II", code: "2.1.3", description: "Capacity building on the Group Management" },
        { outcomeCode: "II", code: "2.1.4", description: "A productive business unit is established for each farmer group" },
        { outcomeCode: "II", code: "2.1.5", description: "Business plan for running oil palm businesses professionally and profitably" },
        { outcomeCode: "II", code: "2.1.6", description: "Partnerships and support from off-takers (private sector) or supporting programs from governments" },
        { outcomeCode: "III", code: "3.1.1", description: "Reference/guidance for the implementation of sustainable agricultural practices (SAP) regenerative agriculture" },
        { outcomeCode: "III", code: "3.1.2", description: "Capacity building on sustainable palm oil standard, practices and regenerative agriculture" },
        { outcomeCode: "III", code: "3.1.3", description: "Monitoring on implementation of sustainable palm oil practices and regenerative agriculture" },
        { outcomeCode: "IV", code: "4.1.1", description: "Capacity building on the worker's and children's right protection including health and safety aspect of palm oil plantation" },
        { outcomeCode: "V", code: "5.1.1", description: "Research report on GHG emission based on the GHG protocol-based emission calculator" },
        { outcomeCode: "V", code: "5.2.1", description: "Monitoring Report on RSPO or sustainability standard compliance" },
        { outcomeCode: "V", code: "5.3.1", description: "Capacity building of actors along supply chain on implementation of No Deforestation, No Peat and No Exploitation (NDPE) policy in their supply chains" },
        { outcomeCode: "V", code: "5.4.1", description: "Mapped supply chain network of Unilever’s palm oil suppliers, including key actors" },
        { outcomeCode: "V", code: "5.5.1", description: "Reduced fire risks near smallholder plantations" },
        { outcomeCode: "VI", code: "6.1.1", description: "Administrative requirement of sustainability standard compliance or RSPO certification" },
        { outcomeCode: "VI", code: "6.1.2", description: "Facilities and infrastructure required for RSPO/Sustainability standards compliance" },
        { outcomeCode: "VI", code: "6.1.3", description: "Report on the progress of RSPO/Sustainability standards implementation" },
        { outcomeCode: "VII", code: "7.1.1", description: "Increased smallholders, women, youth, and other marginalized groups about gender equality and equity" },
        { outcomeCode: "VII", code: "7.1.2", description: "Improved capacity of women, youth, and other marginalized groups on alternative livelihood businesses" }
    ]

    for (const output of outputs) {
        await prisma.output.create({
            data: {
                code: output.code,
                description: output.description,
                outcome: {
                    connect: { code: output.outcomeCode }
                }
            }
        })
    }

    console.log("Outputs seeded.")
}