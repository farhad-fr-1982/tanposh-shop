import NextAuth from 'next-auth';
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from './db/prisma';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const config = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
        strategy: 'jwt' as const,
        maxAge: 60 * 60 * 24 * 30,
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
            if (user) {
                token.id = user.id;
                token.role = user.role;

                if (user.name === 'No_NAME' && user.email) {
                    token.name = user.email.split('@')[0];
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name }
                    });
                }
            }

            if (trigger === 'update' && session?.name) {
                token.name = session.name;
            }

            if (trigger === 'signIn' || trigger === 'signUp') {
                const cookiesObject = await cookies();
                const sessionCartId = cookiesObject.get('sessionCartId')?.value;

                if (sessionCartId && token.id) {
                    await prisma.cart.deleteMany({
                        where: { userId: token.id }
                    });

                    const sessionCart = await prisma.cart.findFirst({
                        where: { sessionCartId }
                    });

                    if (sessionCart) {
                        await prisma.cart.update({
                            where: { id: sessionCart.id },
                            data: { userId: token.id }
                        });
                    } else {
                        await prisma.cart.create({
                            data: {
                                sessionCartId: sessionCartId,
                                userId: token.id,
                                items: [],
                                itemsPrice: 0,
                                totalPrice: 0,
                                shippingPrice: 0,
                                taxPrice: 0,
                            }
                        });
                    }
                }
            }

            return token;
        },
        async session({ session, token }: any) {
            if (session.user && token) {
                session.user.id = token.id || token.sub;
                session.user.role = token.role;
                session.user.name = token.name;
            }
            return session;
        },
        async authorized({ request, auth }: any) {
            // Array of regex patterns of paths we want to protect
            const protectedPaths = [
                /\/shipping-address/,
                /\/payment-method/,
                /\/place-order/,
                /\/profile/,
                /\/user\/(.*)/,
                /\/order\/(.*)/,
                /\/admin/,
            ];

            // Get pathname from the req URL object
            const { pathname } = request.nextUrl;

            // Check if user is not authenticated and accessing a protected path
            if (!auth && protectedPaths.some((p) => p.test(pathname))) {
                return false;
            }

            // اگر کوکی sessionCartId وجود نداشت
            if (!request.cookies.get('sessionCartId')) {
                const sessionCartId = crypto.randomUUID();
                const response = NextResponse.next();

                response.cookies.set('sessionCartId', sessionCartId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 30
                });

                return response;
            }

            return true;
        }
    }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);