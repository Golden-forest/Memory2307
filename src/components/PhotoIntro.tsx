import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { PhotoConfig } from '../data/config'
import { MemoryMarquee } from './MemoryMarquee'

interface Props {
  photos: PhotoConfig[]
}

/** 展示照片数量 */
const SHOW_COUNT = 10

/** 自动轮播间隔（毫秒） */
const AUTO_INTERVAL = 3500

/** Ken Burns 动画持续时间 */
const KEN_BURNS_DURATION = 5

const MEMORY_BADGES = ['山海', '星辰', '热爱', '远方']

const MARQUEE_ITEMS = [
  '2307 MEMORY',
  '毕业快乐',
  '山海有期',
  '星辰作序',
  '未来可期',
  '青春不散场',
]

const kenBurnsVariants = [
  // 奇数张：向左上缓慢推
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.08, x: -20, y: -12 } },
  // 偶数张：向右下缓慢推
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.08, x: 20, y: 12 } },
]

/** Custom cubic-bezier easing curves for editorial feel */
const EASE_OUT_SPRING = [0.22, 1, 0.36, 1] as const
const EASE_INOUT_EDITORIAL = [0.32, 0.72, 0, 1] as const

function getImagePriority(index: number) {
  return {
    loading: index < 3 ? 'eager' : 'lazy',
    fetchPriority: index === 0 ? 'high' : 'auto',
  } as const
}

function PhotoSlide({
  index,
  photo,
  activeIndex,
  shouldReduceMotion,
}: {
  index: number
  photo: PhotoConfig
  activeIndex: number
  shouldReduceMotion: boolean
}) {
  const variant = kenBurnsVariants[index % 2]
  const shouldRenderBackground = Math.abs(index - activeIndex) <= 1
  const imagePriority = getImagePriority(index)

  return (
    <div className="relative h-full w-full flex-shrink-0 snap-center overflow-hidden bg-[#17120f]">
      {/* 背景层：模糊填充，防止 object-contain 留白 */}
      {shouldRenderBackground && (
        <motion.div
          className="absolute inset-0"
          initial={shouldReduceMotion ? false : { ...variant.initial, opacity: 0 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { ...variant.animate, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            opacity: { duration: 0.8, ease: EASE_INOUT_EDITORIAL },
            scale: { duration: KEN_BURNS_DURATION, ease: 'linear' },
            x: { duration: KEN_BURNS_DURATION, ease: 'linear' },
            y: { duration: KEN_BURNS_DURATION, ease: 'linear' },
          }}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            className="h-full w-full scale-[1.26] object-cover brightness-[0.64] saturate-[0.98] blur-[34px]"
            style={{ objectPosition: photo.objectPosition ?? 'center' }}
            loading={imagePriority.loading}
            fetchPriority={imagePriority.fetchPriority}
            decoding="async"
            draggable={false}
          />
        </motion.div>
      )}

      {/* 前景层：完整展示，不裁剪 */}
      <motion.div
        className="absolute inset-0"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: EASE_INOUT_EDITORIAL }}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className="h-full w-full object-contain drop-shadow-[0_30px_96px_rgba(10,7,5,0.58)]"
          style={{ objectPosition: photo.objectPosition ?? 'center' }}
          loading={imagePriority.loading}
          fetchPriority={imagePriority.fetchPriority}
          decoding="async"
          draggable={false}
        />
      </motion.div>

      {/* 底部渐变遮罩 */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(23, 18, 15, 0.92))',
        }}
      />
    </div>
  )
}

export function PhotoIntro({ photos }: Props) {
  const photosToShow = photos.slice(0, SHOW_COUNT)
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const userScrolling = useRef(false)
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const shouldReduceMotion = Boolean(useReducedMotion())

  // 监听滚动事件更新当前照片索引
  const handleScroll = useCallback(() => {
    const container = scrollRef.current
    if (!container) return
    if (photosToShow.length === 0) return

    userScrolling.current = true
    clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(() => {
      userScrolling.current = false
    }, 2000)

    const scrollLeft = container.scrollLeft
    const slideWidth = container.clientWidth
    const newIndex = Math.round(scrollLeft / slideWidth)
    setActiveIndex(Math.min(newIndex, photosToShow.length - 1))
  }, [photosToShow.length])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // 自动轮播
  useEffect(() => {
    if (shouldReduceMotion) return
    if (photosToShow.length === 0) return

    const interval = setInterval(() => {
      if (userScrolling.current) return
      const container = scrollRef.current
      if (!container) return

      const nextIndex = (activeIndex + 1) % photosToShow.length
      const slideWidth = container.clientWidth
      container.scrollTo({ left: slideWidth * nextIndex, behavior: 'smooth' })
      setActiveIndex(nextIndex)
    }, AUTO_INTERVAL)

    return () => clearInterval(interval)
  }, [activeIndex, photosToShow.length, shouldReduceMotion])

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#17120f]">
      {/* Horizontal scroll-snap container */}
      <div
        ref={scrollRef}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photosToShow.map((photo, index) => (
          <PhotoSlide
            key={index}
            index={index}
            photo={photo}
            activeIndex={activeIndex}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </div>

      {/* Overlay gradient with warm editorial tint */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(circle at 18% 18%, rgba(184,146,82,0.2), transparent 28%), linear-gradient(112deg, rgba(23,18,15,0.88) 0%, rgba(51,36,29,0.48) 48%, rgba(14,11,9,0.86) 100%)',
        }}
      />

      {/* Section number watermark "01" */}
      <div
        className="pointer-events-none absolute -top-4 right-2 z-[5] select-none font-display text-[9rem] font-bold leading-none tracking-tighter text-brown/[0.04] sm:right-6 sm:text-[10rem] lg:text-[11rem]"
        aria-hidden="true"
      >
        01
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between px-5 pb-24 pt-6 text-white sm:px-10 sm:pb-28 sm:pt-9 lg:px-14 lg:pb-32 lg:pt-12">
        {/* Top row: tape-style date badge + tagline */}
        <div className="flex items-start justify-between gap-4">
          <motion.div
            className="inline-flex max-w-full items-center gap-2 rounded-sm bg-cream/90 px-3 py-1.5 rotate-[-2deg] text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-brown/80 shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:px-4 sm:py-2 sm:text-[0.65rem]"
            style={{ boxShadow: '2px 2px 0 rgba(184,146,82,0.15)' }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_SPRING }}
          >
            <span className="h-px w-5 bg-gold/80" />
            2026 · JUNE
          </motion.div>

          <motion.div
            className="hidden rounded-sm border border-cream/14 bg-milk-dark/10 px-4 py-2 text-xs font-medium text-cream/68 backdrop-blur-md sm:block"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_SPRING, delay: 0.08 }}
          >
            三年同窗 / 一起奔赴未来
          </motion.div>
        </div>

        {/* Main content area */}
        <div className="max-w-[860px] space-y-4 sm:space-y-5">
          {/* Memory badge chips */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE_OUT_SPRING, delay: 0.12 }}
          >
            {MEMORY_BADGES.map((badge) => (
              <span
                key={badge}
                className="rounded-sm border border-cream/14 bg-milk-dark/12 px-3 py-1 text-xs font-medium text-cream/74 backdrop-blur-md"
              >
                {badge}
              </span>
            ))}
          </motion.div>

          {/* Hero typography block */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE_OUT_SPRING, delay: 0.2 }}
          >
            {/* Editorial italic subtitle */}
            <p className="font-display italic text-xs tracking-[0.24em] text-gold sm:text-sm">
              Class 2307 Presents
            </p>

            {/* Massive display number */}
            <h1 className="font-display text-6xl font-bold leading-[0.88] tracking-tight text-white drop-shadow-[0_18px_55px_rgba(0,0,0,0.45)] sm:text-8xl md:text-9xl lg:text-[9.5rem]">
              2307
            </h1>

            {/* Chinese title + Memory badge */}
            <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
              <span className="font-display text-2xl font-semibold leading-tight text-white sm:text-4xl">
                毕业快乐
              </span>
              <span className="rounded-sm border border-gold/35 bg-gold/14 px-3 py-1 font-display text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Memory
              </span>
            </div>
          </motion.div>

          {/* Bottom quote — body text, no display font */}
          <motion.p
            className="max-w-[34rem] text-sm leading-relaxed text-white/78 sm:text-base"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE_OUT_SPRING, delay: 0.38 }}
          >
            把山海写进同窗，把星辰留给明天。愿每一次回望，都有青春正在发光。
          </motion.p>
        </div>

        {/* Bottom row: tagline + dot pagination */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            className="inline-flex w-fit max-w-full rounded-sm border border-cream/14 bg-milk-dark/10 px-4 py-2 text-xs font-medium text-cream/74 backdrop-blur-md sm:text-sm"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_SPRING, delay: 0.48 }}
          >
            山海相逢，星辰作别
          </motion.div>

          {/* Photo count indicator (dot pagination) */}
          <div className="flex w-fit items-center gap-1.5 rounded-sm border border-cream/14 bg-[#17120f]/40 px-3 py-2 backdrop-blur-md">
            {photosToShow.map((_, index) => (
              <div
                key={index}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: index === activeIndex ? '18px' : '6px',
                  backgroundColor:
                    index === activeIndex
                      ? 'rgba(196, 162, 101, 0.95)'
                      : 'rgba(255, 255, 255, 0.28)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <MemoryMarquee items={MARQUEE_ITEMS} className="absolute inset-x-0 bottom-0 z-30" />
    </div>
  )
}
