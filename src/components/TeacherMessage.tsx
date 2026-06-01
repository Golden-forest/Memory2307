import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Props {
  quote: string
  author: string
  onDone: () => void
}

/** 每个字出现间隔（毫秒） */
const CHAR_INTERVAL = 80
/** 全部文字显示后到触发 onDone 的等待时间 */
const DONE_DELAY = 1500

export function TeacherMessage({ quote, author, onDone }: Props) {
  const [displayedCount, setDisplayedCount] = useState(0)
  const doneCalled = useRef(false)

  // 逐字显示
  useEffect(() => {
    if (displayedCount < quote.length) {
      const timer = setTimeout(() => {
        setDisplayedCount((c) => c + 1)
      }, CHAR_INTERVAL)
      return () => clearTimeout(timer)
    } else if (!doneCalled.current) {
      doneCalled.current = true
      const timer = setTimeout(onDone, DONE_DELAY)
      return () => clearTimeout(timer)
    }
  }, [displayedCount, quote.length, onDone])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-milk px-10">
      {/* 金色引号装饰 */}
      <motion.span
        className="mb-8 text-6xl leading-none text-gold"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
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

      {/* 教师签名 */}
      <motion.p
        className="mt-8 text-sm tracking-widest text-warm-gray"
        initial={{ opacity: 0 }}
        animate={displayedCount >= quote.length ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        —— {author}
      </motion.p>
    </div>
  )
}
