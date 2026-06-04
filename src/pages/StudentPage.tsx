import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useParams } from 'react-router-dom'
import { lookupStudent } from '../data/students'
import { siteConfig, type MessageConfig, type PhotoConfig } from '../data/config'
import { ErrorPage } from '../components/ErrorPage'

const SLIDE_INTERVAL = 4200

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

  // Ken Burns zoom: even index zooms in, odd index zooms out
  useEffect(() => {
    const container = mediaRef.current
    if (!container) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) return

    const images = container.querySelectorAll<HTMLImageElement>('.hero-slide')
    const activeImg = images[activeIndex]
    if (!activeImg) return

    const zoomIn = activeIndex % 2 === 0

    gsap.fromTo(activeImg,
      { scale: zoomIn ? 1 : 1.08 },
      {
        scale: zoomIn ? 1.08 : 1,
        duration: SLIDE_INTERVAL / 1000,
        ease: 'power1.out',
      }
    )

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
          <div className="text-xs uppercase tracking-[0.24em] text-paper/70">Graduation</div>
        </header>

        <div className="max-w-[980px] pb-5 sm:pb-10">
          <p className="hero-intro mb-4 text-xs uppercase tracking-[0.28em] text-paper/72">
            Class Memory
          </p>
          <h1 className="hero-intro text-[clamp(4.4rem,29vw,14rem)] font-black leading-[0.78] tracking-[-0.06em] [animation-delay:120ms]">
            {studentName}
          </h1>
          <div className="hero-intro mt-4 text-[clamp(1.4rem,6vw,4.2rem)] font-mono tracking-[0.18em] text-paper/60 [animation-delay:300ms]">
            <StudentIdRoller studentId={studentId} />
          </div>
          <p className="hero-intro mt-7 max-w-[12em] text-[clamp(2.1rem,10.5vw,6.8rem)] font-black leading-[0.95] tracking-[-0.055em] text-paper/94 [animation-delay:220ms]">
            愿每一次回望，
            <span className="block">都有青春正在发光。</span>
          </p>
        </div>

        <div className="grid gap-5 border-t border-paper/22 pt-5 sm:grid-cols-[minmax(0,34rem)_auto] sm:items-end sm:justify-between">
          <p className="max-w-xl text-sm leading-[1.85] text-paper/76 sm:text-base">
            {siteConfig.hero.quote}
            <span className="mt-2 block text-xs uppercase tracking-[0.22em] text-paper/48">
              {siteConfig.hero.author}
            </span>
          </p>
          <div
            className="flex items-center gap-2"
            aria-label={`当前照片：${activePhoto?.alt ?? ''}`}
          >
            {photos.slice(0, 8).map((photo, index) => (
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
            For Tomorrow
          </p>
          <h2 className="max-w-[10em] text-balance text-[clamp(3.3rem,13vw,9.4rem)] font-black leading-[1.05] tracking-[-0.065em]">
            带着这里的温度，去见更远的山海。
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-[1.85] text-paper/68 sm:text-xl">
            不需要把青春说得很满。几张合照，几句祝福，就足够让这个夏天停留得更久一些。
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
          <p className={`mt-10 text-sm tracking-[0.2em] ${authorTone}`}>{message.author}</p>
        </ScrollReveal>
      </div>
    </section>
  )
}

function ImageGridSection({ photos }: { photos: PhotoConfig[] }) {
  const gridPhotos = photos.slice(0, 8)

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
            用统一的节奏展示这些照片，让合照成为页面真正的主角。
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
                  className="aspect-[4/5] w-full object-cover"
                  style={{ objectPosition: photo.objectPosition ?? 'center' }}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ClosingSection({ studentName }: { studentName: string }) {
  return (
    <section data-color-section className="bg-olive px-5 py-20 text-paper sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1360px]">
        <ScrollReveal className="max-w-5xl" parallaxSpeed={-10}>
          <p className="mb-6 text-xs uppercase tracking-[0.28em] text-paper/48">Class 2307</p>
          <h2 className="text-balance text-[clamp(3.4rem,16vw,10rem)] font-black leading-[1.05] tracking-[-0.065em]">
            祝 {studentName} 毕业快乐
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-[1.85] text-paper/68 sm:text-xl">
            愿你们在不同的城市、不同的清晨里，依然记得这一段明亮的同窗时光。
          </p>
        </ScrollReveal>
      </div>
    </section>
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
      <PhotoHero photos={siteConfig.photos.slice(0, 8)} studentName={student.name} studentId={student.studentId ?? ''} />
      <MessageBlock
        message={siteConfig.messages[0]}
        photo={siteConfig.photos[siteConfig.messages[0].photoIndex] ?? siteConfig.photos[0]}
        index={0}
      />
      <FullColorStatement photo={siteConfig.photos[4]} />
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
