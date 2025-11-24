"use client"

import { useState } from "react"
import { Trash2, Edit, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserFormDialog } from "./user-form-dialog"
import { deleteUser } from "@/app/actions/user"
import { useRouter } from "next/navigation"

interface User {
    id: string
    name: string | null
    email: string | null
    role: string | null
    accounts: { provider: string }[]
    userMenus: any[]
}

export function UserTable({ users }: { users: User[] }) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const router = useRouter()

    const handleEdit = (user: User) => {
        setSelectedUser(user)
        setIsDialogOpen(true)
    }

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return

        const result = await deleteUser(userId)
        if (result.success) {
            router.refresh()
        } else {
            alert(result.error)
        }
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Menus Assigned</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                    No users found. Login with Google to create your first user.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name || "-"}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                            {user.role || "user"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {user.accounts[0]?.provider || "none"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.userMenus.length} menus</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(user)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <UserFormDialog
                user={selectedUser}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </>
    )
}
