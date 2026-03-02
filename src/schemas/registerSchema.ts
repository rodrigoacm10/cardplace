import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const registerSchema = toTypedSchema(
  z
    .object({
      name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
      email: z.string().email({ message: 'E-mail inválido' }),
      password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
      confirmPassword: z.string().min(6, { message: 'Confirme sua senha' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    }),
)
