import { getIcs } from "@/app/actions/ics"
import { getDistricts } from "@/app/actions/district"
import { IcsClient } from "./ics-client"

export default async function IcsPage() {
    const icsList = await getIcs()
    const districts = await getDistricts()

    return <IcsClient icsList={icsList} districts={districts} />
}
