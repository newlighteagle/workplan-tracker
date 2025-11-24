import { getUsers } from "@/app/actions/user"
import { UserTable } from "./user-table"

export default async function UserPage() {
    const users = await getUsers()

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage users, roles, and menu access
                    </p>
                </div>
            </div>

            <UserTable users={users} />
        </div>
    )
}
