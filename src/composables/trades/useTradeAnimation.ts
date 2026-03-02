import gsap from 'gsap'

export interface TradeAnimationRefs {
  centralButton: HTMLElement | null
  shockwave: HTMLElement | null
  offering: HTMLElement | null
  receiving: HTMLElement | null
}

export function useTradeAnimation() {
  const playTradeAnimation = async (refs: TradeAnimationRefs) => {
    const tl = gsap.timeline()
    const isMobile = window.innerWidth < 768

    if (refs.centralButton) {
      tl.to(refs.centralButton, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'back.in',
      })
    }

    if (refs.shockwave) {
      tl.fromTo(
        refs.shockwave,
        { scale: 0.5, opacity: 1, borderWidth: '10px' },
        {
          scale: 60,
          opacity: 0,
          borderWidth: '1px',
          duration: 2,
          ease: 'power2.out',
        },
        0,
      )
    }

    if (isMobile) {
      if (refs.offering)
        tl.to(refs.offering, { x: '150vw', opacity: 0, duration: 2, ease: 'power2.inOut' }, 0.2)
      if (refs.receiving)
        tl.to(refs.receiving, { x: '-150vw', opacity: 0, duration: 2, ease: 'power2.inOut' }, 0.2)
    } else {
      if (refs.offering)
        tl.to(refs.offering, { y: '-150vh', opacity: 0, duration: 2, ease: 'power2.inOut' }, 0.2)
      if (refs.receiving)
        tl.to(refs.receiving, { y: '150vh', opacity: 0, duration: 2, ease: 'power2.inOut' }, 0.2)
    }

    await tl.play()
  }

  return { playTradeAnimation }
}
