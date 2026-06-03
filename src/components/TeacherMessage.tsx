import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
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
  const shouldReduceMotion = Boolean(useReducedMotion())

  // 每次进入视口时重置打字进度
  useEffect(() => {
    if (isInView && !prevInView.current) {
      setDisplayedCount(shouldReduceMotion ? quote.length : 0)
    }
    prevInView.current = isInView
  }, [isInView, quote.length, shouldReduceMotion])

  // 逐字显示 - 只在可见时启动
  useEffect(() => {
    if (shouldReduceMotion) return
    if (!isInView) return
    if (displayedCount < quote.length) {
      const timer = setTimeout(() => {
        setDisplayedCount((c) => c + 1)
      }, CHAR_INTERVAL)
      return () => clearTimeout(timer)
    }
  }, [displayedCount, quote.length, isInView, shouldReduceMotion])

  return (
    <div
      ref={ref}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-milk px-5 py-8 sm:px-10"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 18% 18%, rgba(184,146,82,0.16), transparent 28%), radial-gradient(circle at 82% 72%, rgba(52,40,35,0.08), transparent 30%), linear-gradient(135deg, rgba(255,249,241,0.98), rgba(231,220,202,0.92))',
        }}
      />

      <motion.div
        className="pointer-events-none absolute left-[-18%] top-[17%] h-28 w-[72vw] max-w-[360px] -rotate-6 rounded-lg bg-gold/14"
        initial={{ opacity: 0, x: -24 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-[13%] right-[-20%] h-24 w-[78vw] max-w-[380px] rotate-[-10deg] rounded-lg bg-brown/8"
        initial={{ opacity: 0, x: 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
        transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="relative z-10 w-full max-w-[410px]"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
        whileHover={shouldReduceMotion ? undefined : { y: -4 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Section number watermark "02" */}
        <span className="pointer-events-none absolute -bottom-4 -right-2 font-display text-[8rem] font-bold leading-none text-brown/[0.04] select-none sm:text-[10rem]">
          02
        </span>

        <motion.div
          className="mx-auto mb-6 flex w-fit items-center border-y border-gold/30 px-4 py-2"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-display text-[10px] font-medium tracking-[0.28em] text-brown/66">
            教师寄语
          </span>
        </motion.div>

        {/* Double-Bezel Card Architecture */}
        {/* Outer Shell */}
        <div className="p-1.5 rounded-[1.25rem] bg-brown/[0.06] ring-1 ring-brown/[0.08]">
          {/* Tape decoration on top-left */}
          <motion.div
            className="pointer-events-none absolute left-8 top-[-6px] z-20 h-5 w-10 rounded-sm bg-cream/80 rotate-[-3deg] shadow-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="flex h-full w-full items-center justify-center text-[7px] tracking-[0.15em] text-brown/[0.18]">
              &middot;
            </span>
          </motion.div>

          {/* Inner Core */}
          <div
            className="relative overflow-hidden rounded-[calc(1.25rem-0.375rem)] border border-white/70 bg-cream/78 px-6 py-8 text-center shadow-[0_24px_70px_rgba(52,40,35,0.13)] backdrop-blur-md sm:px-8 sm:py-10"
            style={{
              boxShadow: '0 26px 80px rgba(52, 40, 35, 0.13), inset 0 1px 0 rgba(255,255,255,0.78)',
            }}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <span
              className="pointer-events-none absolute -left-1 top-1 text-7xl leading-none text-gold/15"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              &ldquo;
            </span>
            <span
              className="pointer-events-none absolute bottom-1 right-3 text-6xl leading-none text-brown/8"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              &rdquo;
            </span>

            {/* 打字机文字 - font-display for literary serif feel */}
            <div className="relative mx-auto min-h-[9.5rem] max-w-[330px] text-center font-display text-[1.05rem] leading-[1.95] text-brown sm:min-h-[8.5rem] sm:text-lg">
              <p>
                {quote.slice(0, displayedCount).split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
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

            <motion.div
              className="mx-auto mt-7 flex w-fit items-center gap-3 border-t border-gold/25 pt-4 text-[10px] tracking-[0.24em] text-warm-gray"
              initial={{ opacity: 0, y: 8 }}
              animate={
                isInView && displayedCount >= quote.length
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 8 }
              }
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="h-px w-6 bg-gold/45" />
              <span className="font-display italic">愿此刻有回声</span>
              <span className="h-px w-6 bg-gold/45" />
            </motion.div>

            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"
              initial={{ width: '0%' }}
              animate={isInView && displayedCount >= quote.length ? { width: '100%' } : { width: '0%' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        <motion.div
          className="mx-auto mt-5 grid w-full max-w-[300px] grid-cols-3 gap-2 text-center text-[10px] tracking-[0.16em] text-brown/50"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {['温度', '序章', '山海'].map((label) => (
            <motion.span
              key={label}
              className="font-display rounded-md border border-gold/16 bg-cream/36 px-2 py-2 backdrop-blur"
              whileHover={shouldReduceMotion ? undefined : { y: -2, backgroundColor: 'rgba(255, 249, 241, 0.56)' }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            >
              {label}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
