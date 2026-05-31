import { insertProductSchema } from '@/lib/validators'
import {z} from 'zod'


export type Product = z.infer<typeof insertProductSchema> & {
    id:string;
    rating:number;
    createdAt:Date
}

export function formatNumberWithDecimal(num:string):string{
    const [int,decimal] = num.toString().split('.')
    return decimal ? `${int}.${decimal.padEnd(2,'0')}`
}