import { onMounted, type Ref } from 'vue'
import gsap from 'gsap'

export function useCardDetailsAnimation(
  cardImageRef: Ref<HTMLElement | null>,
  cardInfoRef: Ref<HTMLElement | null>,
) {
  onMounted(() => {
    if (cardImageRef.value && cardInfoRef.value) {
      gsap.from(cardImageRef.value, {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
      gsap.from(cardInfoRef.value, {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2,
      })
    }
  })
}
