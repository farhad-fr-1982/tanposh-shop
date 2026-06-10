export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'فروشگاه تن پوشان'
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'فروشگاه اینترنتی لباس و پوشاک'
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
export const LATEST_PRODUCT_LIMIT = Number(process.env.LATEST_PRODUCT_LIMIT) || 4

export const SignInDefaultValues = {
    email: '',
    password: ''
}

export const SignUpDefaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
}

export const shippingaddressDefaultValues ={
    fullName:'farhad rezazadeh',
    streetAddress:'123 خیابان شریعتی',
    postalCode:'1234567890'

}