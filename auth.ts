import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { authConfig } from "./auth.config"

import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    callbacks: {
        ...authConfig.callbacks,
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                session.user.role = token.role as string
            }
            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token
            const user = await prisma.user.findUnique({
                where: { id: token.sub },
            })
            if (user) {
                token.role = user.role
            }
            return token
        },
    },
})
