"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { updateUserRole, assignMenusToUser } from "@/app/actions/user"
import { getMenu } from "@/app/actions/get-menu"

interface UserMenuPermission {
    menuId: number
    canRead: boolean
    canCreate: boolean
    canUpdate: boolean
    canDelete: boolean
}

interface User {
    id: string
    name: string | null
    email: string | null
    role: string | null
    userMenus: UserMenuPermission[]
}

interface UserFormDialogProps {
    user: User | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UserFormDialog({ user, open, onOpenChange }: UserFormDialogProps) {
    const [role, setRole] = useState<string>("user")
    const [selectedMenus, setSelectedMenus] = useState<UserMenuPermission[]>([])
    const [allMenus, setAllMenus] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Initialise state when a user is provided
    useEffect(() => {
        if (user) {
            setRole(user.role || "user")
            const perms = user.userMenus.map(um => ({
                menuId: um.menuId,
                canRead: um.canRead ?? true,
                canCreate: um.canCreate ?? false,
                canUpdate: um.canUpdate ?? false,
                canDelete: um.canDelete ?? false,
            }))
            setSelectedMenus(perms)
        }
    }, [user])

    // Load menu hierarchy when the dialog opens
    useEffect(() => {
        async function fetchMenus() {
            const menus = await getMenu()
            setAllMenus(menus)
        }
        if (open) {
            fetchMenus()
        }
    }, [open])

    // Reset selected menus when dialog opens for a new user or if user changes
    useEffect(() => {
        if (open && user) {
            const perms = user.userMenus.map(um => ({
                menuId: um.menuId,
                canRead: um.canRead ?? true,
                canCreate: um.canCreate ?? false,
                canUpdate: um.canUpdate ?? false,
                canDelete: um.canDelete ?? false,
            }))
            setSelectedMenus(perms)
        } else if (!open) {
            // Clear selected menus when dialog closes
            setSelectedMenus([]);
        }
    }, [open, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        setLoading(true)

        // Ensure unique menu IDs
        const uniqueMenus = Array.from(new Map(selectedMenus.map(item => [item.menuId, item])).values())

        console.log("Submitting user update:", { userId: user.id, role, uniqueMenus })

        const roleResult = await updateUserRole(user.id, role)
        if (!roleResult.success) {
            console.error("Role update failed:", roleResult.error)
        }

        const menuResult = await assignMenusToUser(user.id, uniqueMenus)
        if (!menuResult.success) {
            console.error("Menu assignment failed:", menuResult.error)
        }

        setLoading(false)

        if (roleResult.success && menuResult.success) {
            onOpenChange(false)
            router.refresh()
        } else {
            const errorMsg = [
                roleResult.error ? `Role update: ${roleResult.error}` : null,
                menuResult.error ? `Menu assignment: ${menuResult.error}` : null
            ].filter(Boolean).join(", ")
            alert(`Failed to update user: ${errorMsg}`)
        }
    }

    // Helper to find a menu (including children) by id
    const findMenuById = (menus: any[], id: number): any => {
        for (const m of menus) {
            if (m.id === id) return m
            if (m.children) {
                const found = findMenuById(m.children, id)
                if (found) return found
            }
        }
        return null
    }

    // Toggle read permission for a menu and all its descendants
    const toggleMenuRead = (menuId: number) => {
        const menu = findMenuById(allMenus, menuId)
        if (!menu) return
        const currentlyChecked = selectedMenus.some(p => p.menuId === menuId && p.canRead)
        const enable = !currentlyChecked
        const collectIds = (m: any, arr: number[]) => {
            arr.push(m.id)
            if (m.children) {
                m.children.forEach((c: any) => collectIds(c, arr))
            }
        }
        const ids: number[] = []
        collectIds(menu, ids)
        setSelectedMenus(prev => {
            if (enable) {
                const newEntries = ids
                    .filter(id => !prev.find(p => p.menuId === id))
                    .map(id => ({
                        menuId: id,
                        canRead: true,
                        canCreate: true,
                        canUpdate: true,
                        canDelete: true
                    }))
                return [...prev, ...newEntries]
            } else {
                return prev.filter(p => !ids.includes(p.menuId))
            }
        })
    }

    const selectAllMenus = () => {
        const flatten = (menus: any[], acc: any[] = []): any[] => {
            for (const m of menus) {
                acc.push(m)
                if (m.children) flatten(m.children, acc)
            }
            return acc
        }
        const flat = flatten(allMenus)
        const all = flat.map(m => ({
            menuId: m.id,
            canRead: true,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
        }))
        setSelectedMenus(all)
    }

    const deselectAllMenus = () => {
        setSelectedMenus([])
    }

    // Recursive component to render a menu and its children
    const MenuItem = ({ menu, depth }: { menu: any; depth: number }) => {
        const isChecked = selectedMenus.some(p => p.menuId === menu.id && p.canRead)
        return (
            <div style={{ marginLeft: depth * 16 }} className="py-1">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={`menu-${menu.id}`}
                        checked={isChecked}
                        onCheckedChange={() => toggleMenuRead(menu.id)}
                    />
                    <label htmlFor={`menu-${menu.id}`} className="text-sm font-medium leading-none cursor-pointer">
                        {menu.title}
                    </label>
                </div>
                {menu.children && menu.children.length > 0 && (
                    <div className="mt-1">
                        {menu.children.map((child: any) => (
                            <MenuItem key={child.id} menu={child} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update user role and menu access for {user?.email}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Role selector */}
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="administrator">Administrator</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Menu & permission selector */}
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label>Menu Access</Label>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" size="sm" onClick={selectAllMenus}>
                                        Select All
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={deselectAllMenus}>
                                        Deselect All
                                    </Button>
                                </div>
                            </div>
                            <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                                {allMenus
                                    .filter((m: any) => !m.parentId)
                                    .map((menu: any) => (
                                        <MenuItem key={menu.id} menu={menu} depth={0} />
                                    ))}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
