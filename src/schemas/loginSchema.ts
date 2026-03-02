import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const loginSchema = toTypedSchema(
  z.object({
    email: z.string().email({ message: 'E-mail inválido' }),
    password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  }),
)
