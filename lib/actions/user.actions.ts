'use server'

import { signInFormSchema, signIUpFormSchema } from "../validators"
import { signIn, signOut } from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect"
import { hashSync } from "bcrypt-ts-edge"
import { prisma } from "@/db/prisma"
import { redirect } from "next/navigation"
import { formatError } from "../utils"

export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password')
        })

        const callbackUrl = formData.get('callbackUrl') as string || '/'

        await signIn('credentials', {
            email: user.email,
            password: user.password,
            redirectTo: callbackUrl
        })

        return { success: true, message: 'ورود با موفقیت انجام شد' }

    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return { success: false, message: 'اطلاعات ورود صحیح نمی باشد' }
    }
}

export async function signOutUser() {
    await signOut({ redirectTo: '/' })
}

export async function signUpUser(prevState: unknown, formData: FormData) {
    try {
        const user = signIUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        })

        const plainPassword = user.password

        user.password = hashSync(user.password, 10)

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
            }
        })

        await signIn('credentials', {
            email: user.email,
            password: plainPassword,
            redirect: false,  // ✅ redirect رو false کن
        })

        // ✅ بعد از لاگین موفق، ریدایرکت کن
        redirect('/')

    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return { success: false, message: formatError(error) }
    }
}

export async function getUserById(userId: string) {
    const user = await prisma.user.findFirst({
        where: { id: userId }
    })
    if (!user) throw new Error('کاربری یافت نشد')
    return user
}