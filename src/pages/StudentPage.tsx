import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useParams } from 'react-router-dom'
import { lookupStudent } from '../data/students'
import { siteConfig, type MessageConfig, type PhotoConfig } from '../data/config'
import { ErrorPage } from '../components/ErrorPage'

const SLIDE_INTERVAL = 8000

gsap.registerPlugin(ScrollTrigger)

function useEditorialScrollMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis: Lenis | undefined
    let lenisRaf: ((time: number) => void) | undefined

    if (!reduceMotion) {
      lenis = new Lenis({
        lerp: 0.08,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.05,
      })
      lenis.on('scroll', ScrollTrigger.update)

      lenisRaf = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(lenisRaf)
      gsap.ticker.lagSmoothing(0)
    }

    const context = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(root.querySelectorAll('[data-reveal], [data-color-section]'), {
          autoAlpha: 1,
          y: 0,
          clearProps: 'filter,clipPath,transform',
        })
        gsap.set(root.querySelectorAll('.image-reveal img'), {
          scale: 1,
          clearProps: 'transform',
        })
        return
      }

      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element, index) => {
        gsap.fromTo(
          element,
          {
            autoAlpha: 0,
            y: 66,
            filter: 'blur(14px)',
          },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.08,
            delay: (index % 3) * 0.035,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 84%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      root.querySelectorAll<HTMLElement>('[data-color-section]').forEach((section) => {
        gsap.fromTo(
          section,
          {
            autoAlpha: 0.88,
            y: 90,
            clipPath: 'inset(5% 0% 0% 0% round 0px)',
          },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      root.querySelectorAll<HTMLImageElement>('.image-reveal img').forEach((image) => {
        gsap.fromTo(
          image,
          { scale: 1.08 },
          {
            scale: 1,
            duration: 1.35,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: image.closest('[data-image-card]') ?? image,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((element) => {
        const speed = Number(element.dataset.parallaxSpeed ?? 36)
        gsap.fromTo(
          element,
          { y: -speed },
          {
            y: speed,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
            },
          }
        )
      })
    }, root)

    const refresh = () => ScrollTrigger.refresh()
    const refreshTimer = window.setTimeout(refresh, 280)
    window.addEventListener('load', refresh)

    return () => {
      window.clearTimeout(refreshTimer)
      window.removeEventListener('load', refresh)
      context.revert()
      if (lenisRaf) gsap.ticker.remove(lenisRaf)
      lenis?.destroy()
    }
  }, [rootRef])
}

function ScrollReveal({
  as = 'div',
  children,
  className = '',
  parallaxSpeed,
}: {
  as?: 'div' | 'figure'
  children: ReactNode
  className?: string
  parallaxSpeed?: number
}) {
  const parallaxProps = {
    'data-parallax': parallaxSpeed === undefined ? undefined : '',
    'data-parallax-speed': parallaxSpeed,
  }

  if (as === 'figure') {
    return (
      <figure data-reveal {...parallaxProps} className={`reveal ${className}`}>
        {children}
      </figure>
    )
  }

  return (
    <div data-reveal {...parallaxProps} className={`reveal ${className}`}>
      {children}
    </div>
  )
}

function StudentIdRoller({ studentId }: { studentId: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cells = container.querySelectorAll<HTMLDivElement>('[data-digit-cell]')
    const cellElements = Array.from(cells)

    if (reduceMotion) {
      cellElements.forEach((cell, i) => {
        const digit = parseInt(studentId[i])
        const cellHeight = cell.parentElement!.clientHeight
        gsap.set(cell, { yPercent: 0, y: 0 })
        gsap.set(cell, { y: -digit * cellHeight })
      })
      return
    }

    cellElements.forEach((cell, i) => {
      const digit = parseInt(studentId[i])
      const cellHeight = cell.parentElement!.clientHeight

      const randomDigit = Math.floor(Math.random() * 10)

      gsap.set(cell, { yPercent: 0, y: 0 })
      gsap.fromTo(cell,
        { y: -randomDigit * cellHeight },
        {
          y: -digit * cellHeight,
          duration: 2,
          delay: i * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play reverse play none',
          },
        }
      )
    })

    return () => {
      gsap.killTweensOf(cellElements)
    }
  }, [studentId])

  return (
    <div ref={containerRef} className="flex items-center justify-center gap-[0.02em]">
      {studentId.split('').map((_char, i) => (
        <div key={i} className="inline-flex flex-col items-center" style={{ height: '1em', overflow: 'hidden' }}>
          <div
            data-digit-cell
            className="flex flex-col"
            style={{ willChange: 'transform' }}
          >
            {[0,1,2,3,4,5,6,7,8,9].map(d => (
              <span key={d} className="flex items-center justify-center" style={{ height: '1em', lineHeight: '1' }}>
                {d}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function PhotoHero({
  photos,
  studentName,
  studentId,
}: {
  photos: PhotoConfig[]
  studentName: string
  studentId: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (photos.length <= 1) return
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % photos.length)
    }, SLIDE_INTERVAL)

    return () => window.clearInterval(timer)
  }, [photos.length])

  // Ken Burns: portrait photos zoom in/out; landscape photos pan horizontally + subtle zoom
  useEffect(() => {
    const container = mediaRef.current
    if (!container) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const images = container.querySelectorAll<HTMLImageElement>('.hero-slide')
    const activeImg = images[activeIndex]
    if (!activeImg) return

    const imgW = activeImg.naturalWidth
    const imgH = activeImg.naturalHeight
    const containerW = container.clientWidth || window.innerWidth
    const containerH = container.clientHeight || window.innerHeight

    // Landscape: image wider than container's aspect ratio → pan + zoom
    const isLandscape = imgW / imgH > containerW / containerH

    if (isLandscape) {
      // Pan via object-position: 0% shows left edge, 100% shows right edge
      // Custom bezier simulates cinematic camera dolly — unified with zoom
      const panRight = activeIndex % 2 === 0
      activeImg.style.objectPosition = `${panRight ? 0 : 100}% center`
      const panEase = 'cubic-bezier(0.25, 0.1, 0.25, 1)'
      const proxy = { pos: panRight ? 0 : 100 }
      gsap.to(proxy, {
        pos: panRight ? 100 : 0,
        duration: SLIDE_INTERVAL / 1000,
        ease: panEase,
        onUpdate: () => {
          activeImg.style.objectPosition = `${proxy.pos}% center`
        },
      })
      gsap.fromTo(activeImg,
        { scale: 1.04 },
        { scale: 1.08, duration: SLIDE_INTERVAL / 1000, ease: panEase },
      )
    } else {
      // Portrait: zoom in/out only (existing behavior)
      const zoomIn = activeIndex % 2 === 0
      gsap.fromTo(activeImg,
        { scale: zoomIn ? 1 : 1.08 },
        {
          scale: zoomIn ? 1.08 : 1,
          duration: SLIDE_INTERVAL / 1000,
          ease: 'power1.out',
        }
      )
    }

    return () => {
      gsap.killTweensOf(images)
    }
  }, [activeIndex])

  const activePhoto = photos[activeIndex]

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-paper">
      <div ref={mediaRef} className="hero-media absolute inset-0" data-parallax data-parallax-speed="30">
        {photos.map((photo, index) => (
          <img
            key={photo.src}
            src={photo.src}
            alt={index === activeIndex ? photo.alt : ''}
            className={[
              'hero-slide absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
              index === activeIndex ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
            style={{ objectPosition: photo.objectPosition ?? 'center' }}
            loading={index < 2 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            decoding="async"
            draggable={false}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,8,0.2),rgba(9,9,8,0.18)_35%,rgba(9,9,8,0.82))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,8,0.34),transparent_62%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1440px] flex-col justify-between px-5 pb-8 pt-5 sm:px-8 sm:pb-10 sm:pt-8 lg:px-12">
        <header className="flex items-center justify-between text-paper">
          <div className="text-sm font-semibold tracking-[0.18em] sm:text-base">2307</div>
          <div className="text-xs uppercase tracking-[0.24em] text-paper/70">Graduation 2026</div>
        </header>

        <div className="max-w-[980px] pb-5 sm:pb-10">
          <p className="hero-intro mb-4 text-xs uppercase tracking-[0.28em] text-paper/72">
            Class 2307
          </p>
          <h1 className="hero-intro text-[clamp(4.4rem,29vw,14rem)] font-black leading-[0.78] tracking-[-0.06em] [animation-delay:120ms]">
            {studentName}
          </h1>
          <div className="hero-intro mt-4 text-[clamp(1.4rem,6vw,4.2rem)] font-mono tracking-[0.18em] text-paper/60 [animation-delay:300ms]">
            <StudentIdRoller studentId={studentId} />
          </div>
          <p className="hero-intro mt-7 max-w-[12em] text-[clamp(2.1rem,10.5vw,6.8rem)] font-black leading-[0.95] tracking-[-0.055em] text-paper/94 [animation-delay:220ms]">
            这一程，
            <span className="block">我们并肩走过</span>
          </p>
        </div>

        <div className="grid gap-5 border-t border-paper/22 pt-5 sm:grid-cols-[minmax(0,34rem)_auto] sm:items-end sm:justify-between">
          <p className="max-w-xl text-sm leading-[1.85] text-paper/76 sm:text-base">
            {siteConfig.hero.quote}
            {siteConfig.hero.author && (
              <span className="mt-2 block text-xs uppercase tracking-[0.22em] text-paper/48">
                {siteConfig.hero.author}
              </span>
            )}
          </p>
          <div
            className="flex items-center gap-2"
            aria-label={`当前照片：${activePhoto?.alt ?? ''}`}
          >
            {photos.slice(0, 12).map((photo, index) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={[
                  'h-1.5 rounded-full transition-all duration-500',
                  index === activeIndex ? 'w-8 bg-paper' : 'w-1.5 bg-paper/35',
                ].join(' ')}
                aria-label={`切换到第 ${index + 1} 张照片`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FullColorStatement({ photo }: { photo: PhotoConfig }) {
  return (
    <section data-color-section className="bg-olive px-5 py-20 text-paper sm:px-8 sm:py-28 lg:px-12 lg:py-36">
      <div className="mx-auto grid max-w-[1360px] items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <ScrollReveal className="lg:col-span-7" parallaxSpeed={-8}>
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.28em] text-paper/50">
            To 2307
          </p>
          <h2 className="max-w-[10em] text-balance text-[clamp(3.3rem,13vw,9.4rem)] font-black leading-[1.05] tracking-[-0.065em]">
            带着这里的温度，去见更远的山海。
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-[1.85] text-paper/68 sm:text-xl">
            那些一起熬过的夜、刷过的题、流过的汗，都会在很多年后，变成你想起青春时最亮的证据。
          </p>
        </ScrollReveal>

        <ScrollReveal
          as="figure"
          className="image-reveal overflow-hidden rounded-[1.45rem] bg-stone shadow-[0_34px_100px_rgba(5,7,5,0.28)] lg:col-span-5"
          parallaxSpeed={28}
        >
          <div data-image-card className="overflow-hidden">
            <img
              src={photo.src}
              alt={photo.alt}
              className="aspect-[4/5] w-full object-cover"
              style={{ objectPosition: photo.objectPosition ?? 'center' }}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function MessageBlock({
  message,
  photo,
  index,
}: {
  message: MessageConfig
  photo: PhotoConfig
  index: number
}) {
  const reverse = index % 2 === 1
  const sectionTone =
    index === 1 ? 'bg-paper-soft text-ink' : 'bg-clay text-ink'
  const labelTone = 'text-muted'
  const paragraphTone = 'text-ink/68'
  const authorTone = 'text-ink/42'

  return (
    <section
      data-color-section
      className={`${sectionTone} px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36`}
    >
      <div className="mx-auto grid max-w-[1360px] items-center gap-9 lg:grid-cols-12 lg:gap-12">
        <ScrollReveal
          as="figure"
          className={[
            'image-reveal overflow-hidden rounded-[1.45rem] bg-stone shadow-[0_34px_100px_rgba(34,29,24,0.14)] lg:col-span-6',
            reverse ? 'lg:order-2 lg:col-start-7' : '',
          ].join(' ')}
          parallaxSpeed={reverse ? 26 : 18}
        >
          <div data-image-card className="overflow-hidden">
            <img
              src={photo.src}
              alt={photo.alt}
              className="aspect-[4/5] w-full object-cover"
              style={{ objectPosition: photo.objectPosition ?? 'center' }}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
        </ScrollReveal>

        <ScrollReveal
          className={[
            'flex min-h-[360px] flex-col justify-center lg:col-span-5',
            reverse ? 'lg:col-start-2 lg:row-start-1' : 'lg:col-start-8',
          ].join(' ')}
          parallaxSpeed={reverse ? -12 : 10}
        >
          <p className={`mb-7 text-xs font-medium uppercase tracking-[0.28em] ${labelTone}`}>
            2307 Memory
          </p>
          <h2 className="max-w-[9em] text-balance text-[clamp(3rem,11.5vw,8.4rem)] font-black leading-[1.05] tracking-[-0.062em]">
            {message.title}
          </h2>
          <p className={`mt-8 max-w-[34rem] text-lg leading-[1.9] sm:text-xl ${paragraphTone}`}>
            {message.body}
          </p>
          {message.author && (
            <p className={`mt-10 text-sm tracking-[0.2em] ${authorTone}`}>{message.author}</p>
          )}
        </ScrollReveal>
      </div>
    </section>
  )
}

function ImageGridSection({ photos }: { photos: PhotoConfig[] }) {
  const gridPhotos = photos.slice(0, 12)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const lightboxOverlayRef = useRef<HTMLDivElement>(null)
  const lightboxImgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (lightboxSrc && lightboxOverlayRef.current && lightboxImgRef.current) {
      gsap.fromTo(
        lightboxOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' },
      )
      gsap.fromTo(
        lightboxImgRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' },
      )
    }
  }, [lightboxSrc])

  const closeLightbox = () => {
    if (!lightboxOverlayRef.current || !lightboxImgRef.current) return
    gsap.to(lightboxImgRef.current, {
      opacity: 0,
      scale: 0.92,
      duration: 0.2,
      ease: 'power2.in',
    })
    gsap.to(lightboxOverlayRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => setLightboxSrc(null),
    })
  }

  return (
    <section className="bg-honey px-5 py-20 text-ink sm:px-8 sm:py-28 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[1360px]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <ScrollReveal className="lg:col-span-7" parallaxSpeed={-8}>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-muted">
              Photo Essay
            </p>
            <h2 className="text-balance text-[clamp(3.2rem,13vw,9rem)] font-black leading-[1.05] tracking-[-0.065em]">
              同窗影像
            </h2>
          </ScrollReveal>
          <ScrollReveal className="max-w-xl text-lg leading-[1.85] text-ink/62 sm:text-xl lg:col-span-4 lg:col-start-9">
            有些话来不及一一说出口，就交给这些照片替我们记住。
          </ScrollReveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {gridPhotos.map((photo, index) => (
            <ScrollReveal
              key={photo.src}
              as="figure"
              className="image-reveal overflow-hidden rounded-[1.35rem] bg-stone shadow-[0_24px_80px_rgba(34,29,24,0.1)]"
              parallaxSpeed={index % 2 === 0 ? 18 : 8}
            >
              <div data-image-card className="overflow-hidden">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="aspect-[4/5] w-full cursor-pointer object-cover"
                  style={{ objectPosition: photo.objectPosition ?? 'center' }}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                  onClick={() => setLightboxSrc(photo.src)}
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {lightboxSrc && (
        <div
          ref={lightboxOverlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
          style={{ opacity: 0 }}
        >
          <img
            ref={lightboxImgRef}
            src={lightboxSrc}
            alt=""
            className="max-h-[100svh] max-w-[100vw] object-contain p-4"
            style={{ opacity: 0 }}
            draggable={false}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}

function ClosingSection({ studentName }: { studentName: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const creditsTrackRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const poemLines = siteConfig.closing.lines
  const allLines = [
    siteConfig.closing.greetingLine,
    studentName,
    siteConfig.closing.closingLine,
    ...poemLines,
  ]

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const lines = lineRefs.current.filter(Boolean) as HTMLDivElement[]
    if (lines.length === 0) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      gsap.set(lines, { opacity: 1, y: 0, filter: 'blur(0px)' })
      return
    }

    // Initial state: all lines hidden, ready for sequential fade-in
    gsap.set(lines, { opacity: 0, y: 25, filter: 'blur(8px)', scale: 1 })

    let isPinned = false
    const sectionHeight = section.offsetHeight
    const spacer = spacerRef.current

    // Pin the section: fixed positioning so animation plays while user sees it
    const pin = () => {
      if (isPinned) return
      isPinned = true
      section.style.position = 'fixed'
      section.style.top = '0'
      section.style.left = '0'
      section.style.right = '0'
      section.style.width = '100%'
      section.style.zIndex = '50'
      if (spacer) {
        spacer.style.height = `${sectionHeight}px`
      }
    }

    // Unpin: release so user can scroll freely
    const unpin = () => {
      if (!isPinned) return
      isPinned = false
      section.style.position = ''
      section.style.top = ''
      section.style.left = ''
      section.style.right = ''
      section.style.width = ''
      section.style.zIndex = ''
      if (spacer) {
        spacer.style.height = '0'
      }
    }

    const playAnimation = () => {
      // Kill previous timeline if any
      tlRef.current?.kill()

      const track = creditsTrackRef.current
      if (!track) return

      const viewportH = window.innerHeight

      // Measure BEFORE pinning — layout is stable in normal document flow
      gsap.set(track, { y: 0 })
      gsap.set(lines, { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 })

      const parent = track.parentElement!
      const parentRect = parent.getBoundingClientRect()
      const lastLineRect = lines[lines.length - 1].getBoundingClientRect()
      const lastLineCenterFromParent = lastLineRect.top - parentRect.top + lastLineRect.height / 2
      const targetTrackY = parentRect.height / 2 - lastLineCenterFromParent

      // Now pin and set initial animation state
      pin()

      const startY = viewportH * 0.65
      gsap.set(track, { y: startY })
      gsap.set(lines, { opacity: 0, y: 40, filter: 'blur(8px)', scale: 1 })
      const tl = gsap.timeline({
        onComplete: () => {
          unpin()
        },
      })
      tlRef.current = tl

      // Breathing pause
      tl.to({}, { duration: 1.5 })

      // === Continuous upward scroll (gentle sine curve, not robotic constant speed) ===
      const scrollDuration = 15.0
      tl.to(track, {
        y: targetTrackY,
        duration: scrollDuration,
        ease: 'sine.inOut',
      }, 0)

      // === Lines fade in one by one (power4.out: dramatic deceleration, "settles") ===
      tl.to(lines[0], {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 2.5, ease: 'power4.out',
      }, 0)

      const fadeInGap = 2.0
      for (let i = 1; i <= lines.length - 1; i++) {
        tl.to(lines[i], {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 2.2, ease: 'power4.out',
        }, fadeInGap * i)
      }

      // === Lines 0-5 fade out (gentle dissolve) ===
      for (let i = 0; i <= lines.length - 2; i++) {
        tl.to(lines[i], {
          opacity: 0, filter: 'blur(6px)',
          duration: 1.8, ease: 'power3.in',
        }, fadeInGap * (i + 2) + 1.5)
      }

      // Final pause before unpin
      tl.to({}, { duration: 2.5 })
    }

    // Use IntersectionObserver to detect when section enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            playAnimation()
          }
        }
      },
      { threshold: 0.4, rootMargin: '0px 0px -15% 0px' }
    )
    observer.observe(section)

    return () => {
      observer.disconnect()
      tlRef.current?.kill()
      unpin()
      gsap.set(lines, { clearProps: 'all' })
    }
  }, [studentName, allLines])

  return (
    <>
      {/* Spacer to maintain layout when section is pinned */}
      <div ref={spacerRef} style={{ height: 0 }} />
      <section
        ref={sectionRef}
        className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6"
        style={{ background: '#1a2e1a' }}
      >
      {/* Subtle vignette overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
        }}
      />

      {/* Clip container — masks text outside viewport, full-screen height */}
      <div className="relative z-10 h-dvh w-full overflow-hidden">
        {/* Credits track — positioned via GSAP transform */}
        <div
          ref={creditsTrackRef}
          className="absolute inset-x-0 top-0 flex flex-col items-center gap-y-8 px-4 text-paper"
        >
          {allLines.map((text, i) => {
            const isLast = i === allLines.length - 1
            return (
              <div
                key={i}
                ref={(el) => { lineRefs.current[i] = el }}
                className={`font-bold tracking-[0.12em] ${isLast ? 'text-[clamp(4rem,14vw,10.5rem)]' : 'text-[clamp(3rem,11.5vw,8.4rem)]'}`}
              >
                {text}
              </div>
            )
          })}
        </div>
      </div>
    </section>
    </>
  )
}

export function StudentPage() {
  const { slug } = useParams<{ slug: string }>()
  const student = slug ? lookupStudent(slug) : undefined
  const pageRef = useRef<HTMLElement | null>(null)

  useEditorialScrollMotion(pageRef)

  if (!student) {
    return <ErrorPage />
  }

  return (
    <main ref={pageRef} className="min-h-[100dvh] overflow-hidden bg-paper">
      <PhotoHero photos={siteConfig.photos.slice(0, 12)} studentName={student.name} studentId={student.studentId ?? ''} />
      <MessageBlock
        message={siteConfig.messages[0]}
        photo={siteConfig.photos[siteConfig.messages[0].photoIndex] ?? siteConfig.photos[0]}
        index={0}
      />
      <FullColorStatement photo={siteConfig.photos[6]} />
      <MessageBlock
        message={siteConfig.messages[1]}
        photo={siteConfig.photos[siteConfig.messages[1].photoIndex] ?? siteConfig.photos[1]}
        index={1}
      />
      <ImageGridSection photos={siteConfig.photos} />
      <MessageBlock
        message={siteConfig.messages[2]}
        photo={siteConfig.photos[siteConfig.messages[2].photoIndex] ?? siteConfig.photos[2]}
        index={2}
      />
      <ClosingSection studentName={student.name} />
    </main>
  )
}
