import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { registerSchema } from '@/schemas/registerSchema'

export function useRegister() {
  const router = useRouter()
  const authStore = useAuthStore()

  const isLoading = ref(false)
  const showPassword = ref(false)

  const form = useForm({
    validationSchema: registerSchema,
  })

  const onSubmit = form.handleSubmit(async (values) => {
    isLoading.value = true

    const result = await authStore.register({
      name: values.name,
      email: values.email,
      password: values.password,
    })

    isLoading.value = false

    if (result.success) {
      toast.success('Conta criada com sucesso! Faça login para continuar.')
      router.push('/login')
    } else {
      toast.error(result.message)
    }
  })

  return {
    form,
    isLoading,
    showPassword,
    onSubmit,
  }
}
