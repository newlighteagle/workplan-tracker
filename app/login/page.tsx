import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import { GalleryVerticalEnd } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    Workplan Tracker
                </a>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold">Login to your account</h1>
                        <p className="text-balance text-sm text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <div className="grid gap-6">
                        <form
                            action={async () => {
                                "use server"
                                await signIn("google", { redirectTo: "/dashboard" })
                            }}
                        >
                            <Button type="submit" className="w-full">
                                Login with Google
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
