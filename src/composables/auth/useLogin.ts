import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { loginSchema } from '@/schemas/loginSchema'

export function useLogin() {
  const router = useRouter()
  const authStore = useAuthStore()

  const isLoading = ref(false)
  const rememberMe = ref(false)
  const showPassword = ref(false)

  const form = useForm({
    validationSchema: loginSchema,
  })

  const onSubmit = form.handleSubmit(async (values) => {
    isLoading.value = true

    const result = await authStore.login(values, rememberMe.value)

    isLoading.value = false

    if (result.success) {
      toast.success('Login realizado com sucesso!')
      router.push('/cards')
    } else {
      toast.error(result.message)
    }
  })

  return {
    form,
    isLoading,
    rememberMe,
    showPassword,
    onSubmit,
  }
}
