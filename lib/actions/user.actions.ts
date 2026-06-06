'use server'

import { signInFormSchema } from "../validators"
import { signIn, signOut } from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect"

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
    await signOut({ redirectTo: '/' })  // ✅ فقط این خط رو عوض کن
}