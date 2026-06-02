import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useSectionInView } from '../hooks/useSectionInView'

interface Props {
  quote: string
}

/** 每个字出现间隔（毫秒） */
const CHAR_INTERVAL = 80

export function TeacherMessage({ quote }: Props) {
  const [displayedCount, setDisplayedCount] = useState(0)
  const { ref, isInView } = useSectionInView()
  const prevInView = useRef(false)

  // 每次进入视口时重置打字进度
  useEffect(() => {
    if (isInView && !prevInView.current) {
      setDisplayedCount(0)
    }
    prevInView.current = isInView
  }, [isInView])

  // 逐字显示 - 只在可见时启动
  useEffect(() => {
    if (!isInView) return
    if (displayedCount < quote.length) {
      const timer = setTimeout(() => {
        setDisplayedCount((c) => c + 1)
      }, CHAR_INTERVAL)
      return () => clearTimeout(timer)
    }
  }, [displayedCount, quote.length, isInView])

  return (
    <div
      ref={ref}
      className="flex h-full w-full flex-col items-center justify-center bg-milk px-10"
    >
      {/* 金色引号装饰 */}
      <motion.span
        className="mb-8 text-6xl leading-none text-gold"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        &ldquo;
      </motion.span>

      {/* 打字机文字 */}
      <div className="relative max-w-[320px] text-center text-lg leading-relaxed text-brown">
        <p>
          {quote.slice(0, displayedCount).split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{
                fontWeight: i === displayedCount - 1 ? 500 : 400,
              }}
            >
              {char}
            </motion.span>
          ))}
          {/* 闪烁光标 */}
          {displayedCount < quote.length && (
            <motion.span
              className="inline-block text-gold"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            >
              |
            </motion.span>
          )}
        </p>
      </div>

    </div>
  )
}
