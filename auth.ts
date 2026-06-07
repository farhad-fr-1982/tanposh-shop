import NextAuth from 'next-auth';
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from './db/prisma';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';

export const config = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
        strategy: 'jwt' as const,
        maxAge: 60 * 60 * 24 * 30, // 30 days
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string
                    }
                });

                if (user && user.password) {
                    const isMatch = compareSync(credentials.password as string, user.password);

                    if (isMatch) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        };
                    }
                }
                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }: any) {
            // ۱. در اولین لاگین، اطلاعات کاربر را به توکن منتقل می‌کنیم
            if (user) {
                token.id = user.id;
                token.role = user.role;
                
                // بررسی نام و آپدیت آن در دیتابیس در صورت نیاز
                if (user.name === 'No_NAME' && user.email) {
                    token.name = user.email.split('@')[0];
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name }
                    });
                }
            }

            // ۲. مدیریت آپدیت سشن (زمانی که با ()update در فرانت‌اند صدا زده می‌شود)
            if (trigger === 'update' && session?.name) {
                token.name = session.name;
            }

            return token;
        },
        async session({ session, token }: any) {
            // انتقال اطلاعات از توکن به سشن برای دسترسی در فرانت‌اند
            if (session.user && token) {
                session.user.id = token.id || token.sub;
                session.user.role = token.role;
                session.user.name = token.name;
            }
            return session;
        }
    }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);