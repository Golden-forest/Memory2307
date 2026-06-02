import { motion } from 'framer-motion'
import type { PhotoConfig } from '../data/config'

interface Props {
  photos: PhotoConfig[]
}

/** 展示照片数量 */
const SHOW_COUNT = 10

/** Ken Burns 动画持续时间 */
const KEN_BURNS_DURATION = 5

const kenBurnsVariants = [
  // 奇数张：向左上缓慢推
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.08, x: -20, y: -12 } },
  // 偶数张：向右下缓慢推
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.08, x: 20, y: 12 } },
]

function PhotoSlide({ index, photo }: { index: number; photo: PhotoConfig }) {
  const variant = kenBurnsVariants[index % 2]

  return (
    <div className="relative h-full w-full flex-shrink-0 snap-center overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ ...variant.initial, opacity: 0 }}
        whileInView={{ ...variant.animate, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{
          opacity: { duration: 0.8, ease: 'easeInOut' },
          scale: { duration: KEN_BURNS_DURATION, ease: 'linear' },
          x: { duration: KEN_BURNS_DURATION, ease: 'linear' },
          y: { duration: KEN_BURNS_DURATION, ease: 'linear' },
        }}
      >
        <img
          src={photo.src}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: photo.objectPosition ?? 'center' }}
          draggable={false}
        />
      </motion.div>

      {/* 底部渐变遮罩 */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #F5F0EB)',
        }}
      />
    </div>
  )
}

export function PhotoIntro({ photos }: Props) {
  const photosToShow = photos.slice(0, SHOW_COUNT)

  return (
    <div className="relative h-full w-full overflow-hidden bg-milk">
      {/* Horizontal scroll-snap container */}
      <div className="flex h-full w-full overflow-x-auto snap-x snap-mandatory">
        {photosToShow.map((photo, index) => (
          <PhotoSlide key={index} index={index} photo={photo} />
        ))}
      </div>

      {/* Photo count indicator (dot pagination) */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {photosToShow.map((_, index) => (
          <div
            key={index}
            className="h-1.5 w-1.5 rounded-full bg-brown/30 transition-colors"
            style={{
              backgroundColor: 'rgba(160, 140, 120, 0.3)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
