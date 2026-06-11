'use server'

import { shippingAddressSchema, signInFormSchema, signIUpFormSchema } from "../validators"
import { auth, signIn, signOut } from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect"
import { hashSync } from "bcrypt-ts-edge"
import { prisma } from "@/db/prisma"
import { redirect } from "next/navigation"
import { formatError } from "../utils"
import { ShippingAddress } from "@/types"

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

//*Update users address
export async function updateUserAddress(data: ShippingAddress) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            throw new Error('کاربر یافت نشد')
        }

        const currentUser = await prisma.user.findFirst({
            where: { id: session.user.id }
        })

        if (!currentUser) throw new Error('کاربر یافت نشد')

        const user = shippingAddressSchema.parse(data)

        await prisma.user.update({
            where: { id: currentUser.id },
            data: { address: user }  // ✅ درست: address: user
        })
        
        return {
            success: true,
            message: 'آدرس با موفقیت بروزرسانی شد'
        }
    } catch (error) {
        return { success: false, message: formatError(error) }
    }
}