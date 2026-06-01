import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PhotoConfig } from '../data/config'

interface Props {
  photos: PhotoConfig[]
  onDone: () => void
}

/** 每张照片停留时间（毫秒） */
const SLIDE_DURATION = 3500
/** 展示照片数量 */
const SHOW_COUNT = 10

const kenBurnsVariants = [
  // 奇数张：向左上缓慢推
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.05, x: -15, y: -10 } },
  // 偶数张：向右下缓慢推
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.05, x: 15, y: 10 } },
]

function PlaceholderPhoto({ index }: { index: number }) {
  // MVP 阶段：用 CSS 渐变生成不同色调的占位图
  const hue1 = (index * 37) % 360
  const hue2 = (hue1 + 30) % 360
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(${135 + index * 15}deg, hsl(${hue1}, 20%, 75%), hsl(${hue2}, 25%, 85%))`,
      }}
    />
  )
}

function Slide({ index, photo }: { index: number; photo: PhotoConfig }) {
  const variant = kenBurnsVariants[index % 2]

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ ...variant.initial, opacity: 0 }}
      animate={{ ...variant.animate, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        opacity: { duration: 1, ease: 'easeInOut' },
        scale: { duration: SLIDE_DURATION / 1000, ease: 'linear' },
        x: { duration: SLIDE_DURATION / 1000, ease: 'linear' },
        y: { duration: SLIDE_DURATION / 1000, ease: 'linear' },
      }}
    >
      <div
        className="h-full w-full"
        style={{ objectFit: 'cover', objectPosition: photo.objectPosition ?? 'center' }}
      >
        <PlaceholderPhoto index={index} />
      </div>
      {/* 底部渐变遮罩 */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: 'linear-gradient(to bottom, transparent, #F5F0EB)',
        }}
      />
    </motion.div>
  )
}

export function PhotoIntro({ photos, onDone }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const photosToShow = photos.slice(0, SHOW_COUNT)

  const advance = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev + 1
      if (next >= photosToShow.length) {
        setTimeout(onDone, 500)
        return prev
      }
      return next
    })
  }, [photosToShow.length, onDone])

  useEffect(() => {
    const timer = setTimeout(advance, SLIDE_DURATION)
    return () => clearTimeout(timer)
  }, [currentIndex, advance])

  return (
    <div className="relative h-full w-full overflow-hidden bg-milk">
      <AnimatePresence>
        <Slide key={currentIndex} index={currentIndex} photo={photosToShow[currentIndex]} />
      </AnimatePresence>
    </div>
  )
}
