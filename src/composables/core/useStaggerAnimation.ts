import gsap from 'gsap'

export function useStaggerAnimation(maxStaggerItems: number, staggerDelay: number) {
  const onBeforeEnter = (el: Element) => {
    gsap.set(el, {
      opacity: 0,
      y: 120,
    })
  }

  const onEnter = (el: Element, done: () => void) => {
    const htmlElement = el as HTMLElement
    const index = htmlElement.dataset.index !== undefined ? Number(htmlElement.dataset.index) : 0

    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      delay: (index % maxStaggerItems) * staggerDelay,
      ease: 'power2.out',
      onComplete: done,
    })
  }

  return { onBeforeEnter, onEnter }
}
