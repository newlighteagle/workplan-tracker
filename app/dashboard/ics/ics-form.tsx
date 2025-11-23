"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createIcs, updateIcs } from "@/app/actions/ics"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { Ics, District } from "@prisma/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
    code: z.string().min(1, "Code is required"),
    name: z.string().min(1, "Name is required"),
    fid: z.string().optional(),
    abbreviation: z.string().optional(),
    description: z.string().optional(),
    districtId: z.coerce.number().min(1, "District is required"),
})

interface IcsFormProps {
    ics?: Ics
    districts: District[]
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function IcsForm({ ics, districts, open: controlledOpen, onOpenChange }: IcsFormProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = controlledOpen ?? internalOpen
    const setOpen = onOpenChange ?? setInternalOpen

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            name: "",
            fid: "",
            abbreviation: "",
            description: "",
            districtId: 0,
        },
    })

    useEffect(() => {
        if (ics) {
            form.reset({
                code: ics.code,
                name: ics.name,
                fid: ics.fid || "",
                abbreviation: ics.abbreviation || "",
                description: ics.description || "",
                districtId: ics.districtId,
            })
        } else {
            form.reset({
                code: "",
                name: "",
                fid: "",
                abbreviation: "",
                description: "",
                districtId: 0,
            })
        }
    }, [ics, form, open])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (ics) {
            await updateIcs(ics.id, values)
        } else {
            await createIcs(values)
        }
        setOpen(false)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {ics ? (
                    <Button variant="ghost" className="w-full justify-start">
                        Edit
                    </Button>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add ICS
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{ics ? "Edit ICS" : "Add ICS"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="districtId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>District</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value ? String(field.value) : undefined} value={field.value ? String(field.value) : undefined}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a district" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {districts.map((district) => (
                                                <SelectItem key={district.id} value={String(district.id)}>
                                                    {district.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ICS Code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fid"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>FID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="FID" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ICS Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="abbreviation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Abbreviation</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Abbreviation" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
