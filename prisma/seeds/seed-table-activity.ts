import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function seedActivity() {
    console.log("Seeding Activities...")

    // Clear existing data
    await prisma.activity.deleteMany()

    const activities = [
        { outputCode: "1.1.1", code: "1.1.1.1", name: "MIS Smallholder Hub Development", description: "MIS Smallholder Hub Development" },
        { outputCode: "1.1.1", code: "1.1.1.2", name: "Smallholder Hub SOPs Establishment", description: "Smallholder Hub SOPs Establishment" },
        { outputCode: "1.2.1", code: "1.2.1.1", name: "Engagement and regular coordination meetings with local stakeholders", description: "Engagement and regular coordination meetings with local stakeholders" },
        { outputCode: "1.2.1", code: "1.2.1.2", name: "Engagement and regular coordination meetings with the private sector", description: "Engagement and regular coordination meetings with the private sector" },
        { outputCode: "1.2.1", code: "1.2.1.3", name: "Engagement and regular coordination meetings with local CSOs", description: "Engagement and regular coordination meetings with local CSOs" },
        { outputCode: "2.1.1", code: "2.1.1.1", name: "Formation and legalization of smallholder groups by the Indonesian government", description: "Formation and legalization of smallholder groups by the Indonesian government" },
        { outputCode: "2.1.2", code: "2.1.2.1", name: "Establishment of Group Management System or Internal Control System (ICS)", description: "Establishment of Group Management System or Internal Control System (ICS)" },
        { outputCode: "2.1.3", code: "2.1.3.1", name: "Training on sustainable palm oil practices and regenerative agriculture, package 2: Group Management", description: "Training on sustainable palm oil practices and regenerative agriculture, package 2: Group Management" },
        { outputCode: "2.1.4", code: "2.1.4.1", name: "Conduct LSU (Leaf Sampling Unit) and SSU (Soil sampling unit) analyses as a reference for productivity improvement", description: "Conduct LSU (Leaf Sampling Unit) and SSU (Soil sampling unit) analyses as a reference for productivity improvement" },
        { outputCode: "2.1.5", code: "2.1.5.1", name: "Fertilizer business plan and implementation assistance", description: "Fertilizer business plan and implementation assistance" },
        { outputCode: "2.1.6", code: "2.1.6.1", name: "Fertilizer business progress monitoring and business matching with off-takers", description: "Fertilizer business progress monitoring and business matching with off-takers" },
        { outputCode: "3.1.1", code: "3.1.1.2", name: "Production of SAP/ BMP and the regenerative agriculture toolkit", description: "Production of SAP/ BMP and the regenerative agriculture toolkit" },
        { outputCode: "3.1.1", code: "3.1.1.3", name: "Production of toolkit P&C RSPO", description: "Production of toolkit P&C RSPO" },
        { outputCode: "3.1.1", code: "3.1.1.4", name: "Production of the toolkit for HCV and Environmental Management", description: "Production of the toolkit for HCV and Environmental Management" },
        { outputCode: "3.1.1", code: "3.1.1.5", name: "Production of the toolkit Group Dynamics & Management", description: "Production of the toolkit Group Dynamics & Management" },
        { outputCode: "3.1.1", code: "3.1.1.6", name: "Production of the toolkit of HSE & Manpower", description: "Production of the toolkit of HSE & Manpower" },
        { outputCode: "3.1.1", code: "3.1.1.7", name: "Production of toolkit of Gender Equality and Financial Literacy", description: "Production of toolkit of Gender Equality and Financial Literacy" },
        { outputCode: "3.1.1", code: "3.1.1.8", name: "Production of toolkit of business development & alternative livelihood", description: "Production of toolkit of business development & alternative livelihood" },
        { outputCode: "3.1.1", code: "3.1.1.9", name: "Refreshment and coordination workshop with group facilitators", description: "Refreshment and coordination workshop with group facilitators" },
        { outputCode: "3.1.2", code: "3.1.2.1", name: "Training on sustainable palm oil practices and regenerative agriculture, package 1", description: "Training on sustainable palm oil practices and regenerative agriculture, package 1: Sustainable palm oil practices and regenerative agriculture, P&C RPO, and HCV" },
        { outputCode: "3.1.3", code: "3.1.3.1", name: "Monitoring of Best Management Practices (BMP) , Good Agricultural practices (GAP, SAP)", description: "Monitoring of Best Management Practices (BMP) , Good Agricultural practices (GAP, SAP (Sustainable Agricultural Principals), implementation and regenerative agriculture" },
        { outputCode: "4.1.1", code: "4.1.1.1", name: "Training on sustainable palm oil practices and regenerative agriculture, package 2: HSE", description: "Training on sustainable palm oil practices and regenerative agriculture, package 2: HSE" },
        { outputCode: "5.1.1", code: "5.1.1.1", name: "Research on GHG emission reduction", description: "Research on GHG emission reduction from the implementation of regenerative agriculture and sustainability standards, and the utilization of the standardized emission calculator" },
        { outputCode: "5.2.1", code: "5.2.1.1", name: "Monitoring Report on RSPO or sustainability standard compliance (HCV and Social)", description: "Monitoring Report on RSPO or sustainability standard compliance (HCV and Social)" },
        { outputCode: "5.3.1", code: "5.3.1.1", name: "Training in Accountability Framework Initiative (AFI)", description: "Training in Accountability Framework Initiative (AFI)" },
        { outputCode: "5.3.1", code: "5.3.1.2", name: "Training on Global Forest Watch Pro (GFW Pro)", description: "Training on Global Forest Watch Pro (GFW Pro)" },
        { outputCode: "5.3.1", code: "5.3.1.3", name: "Assessment of deforestation risk at the district level", description: "Assessment of deforestation risk at the district level" },
        { outputCode: "5.4.1", code: "5.4.1.1", name: "Unilever Supply Chain Mapping", description: "Unilever Supply Chain Mapping" },
        { outputCode: "5.5.1", code: "5.5.1.1", name: "Fire risk assessment at the district and smallholder group levels", description: "Fire risk assessment at the district and smallholder group levels" },
        { outputCode: "5.5.1", code: "5.5.1.2", name: "Establishment of fire prevention and water management infrastructure", description: "Establishment of fire prevention and water management infrastructure" },
        { outputCode: "5.5.1", code: "5.5.1.3", name: "Development of a fire contingency plan at the district level", description: "Development of a fire contingency plan at the district level by the fire prevention team established at the group level" },
        { outputCode: "6.1.1", code: "6.1.1.1", name: "Facilitation administrative requirement of RSPO certification", description: "Facilitation administrative requirement of RSPO certification" },
        { outputCode: "6.1.2", code: "6.1.2.1", name: "11 smallholder groups facilitated signboards, chemical storage, and document printing", description: "11 smallholder groups facilitated signboards, chemical storage, and document printing for P&C RSPO Fulfilment" },
        { outputCode: "6.1.2", code: "6.1.2.2", name: "Facilitation of Personal Protective Equipment (PPE) for P&C RSPO Fulfillment", description: "Facilitation of Personal Protective Equipment (PPE) for P&C RSPO Fulfillment" },
        { outputCode: "6.1.2", code: "6.1.2.2.a", name: "a. ICS Administrator", description: "a. ICS Administrator" },
        { outputCode: "6.1.2", code: "6.1.2.2.b", name: "b. Farmer Workers", description: "b. Farmer Workers" },
        { outputCode: "6.1.3", code: "6.1.3.1", name: "Internal audit for P&C RSPO Fulfillment", description: "Internal audit for P&C RSPO Fulfillment" },
        { outputCode: "6.1.3", code: "6.1.3.2", name: "SOP development & Socialization", description: "SOP development & Socialization" },
        { outputCode: "7.1.1", code: "7.1.1.1", name: "Training in financial management, including alternative livelihood and gender", description: "Training in financial management, including alternative livelihood and gender" },
        { outputCode: "7.1.1", code: "7.1.1.2", name: "Monitoring and evaluation of gender composition and alternative livelihood", description: "Monitoring and evaluation of gender composition and alternative livelihood at the smallholder group level" },
        { outputCode: "7.1.2", code: "7.1.2.1", name: "Facilitation of alternative livelihood businesses", description: "Facilitation of alternative livelihood businesses by smallholders, women, youth, and other marginalized groups" }
    ]

    for (const activity of activities) {
        await prisma.activity.create({
            data: {
                code: activity.code,
                name: activity.name,
                description: activity.description,
                startDate: new Date(),
                endDate: new Date(),
                output: {
                    connect: { code: activity.outputCode }
                }
            }
        })
    }

    console.log("Activities seeded.")
}