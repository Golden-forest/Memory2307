import { motion, useReducedMotion } from 'framer-motion'
import { useSectionInView } from '../hooks/useSectionInView'
import type { StatsConfig } from '../data/config'

interface Props {
  className: string
  stats: StatsConfig[]
}

const memoryCards = [
  { title: '课堂', text: '认真与笑声都被好好收起', className: 'left-5 top-12 rotate-[-4deg]' },
  { title: '合照', text: '每一次并肩都有光', className: 'right-6 top-24 rotate-3' },
  { title: '明天', text: '把名字写进更远的地方', className: 'bottom-24 left-10 rotate-2' },
]

export function EndingQuote({ className, stats }: Props) {
  const { ref, isInView } = useSectionInView()
  const shouldReduceMotion = Boolean(useReducedMotion())
  const mainText = '敢赴山海，追梦星辰'
  const subText = `${className}，未来可期`

  return (
    <div
      ref={ref}
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#17120f] px-5 py-8 text-cream"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 16%, rgba(184,146,82,0.2), transparent 30%), radial-gradient(circle at 82% 76%, rgba(142,59,53,0.18), transparent 32%), linear-gradient(145deg, #17120f 0%, #28211e 48%, #141210 100%)',
        }}
      />
      <motion.div
        className="pointer-events-none absolute left-[-18%] top-[14%] h-28 w-[70vw] max-w-[360px] -rotate-6 rounded-lg bg-[#8E3B35]/28"
        initial={{ opacity: 0, x: -28 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -28 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-[18%] right-[-22%] h-32 w-[82vw] max-w-[420px] rotate-[-9deg] rounded-lg bg-gold/16"
        initial={{ opacity: 0, x: 32 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 32 }}
        transition={{ duration: 0.9, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

      {/* 浮动记忆卡片 */}
      {memoryCards.map((card, i) => (
        <motion.div
          key={card.title}
          className={`pointer-events-none absolute hidden w-40 rounded-lg border border-white/18 bg-white/10 px-4 py-3 text-left shadow-[0_16px_50px_rgba(0,0,0,0.2)] backdrop-blur-md sm:block ${card.className}`}
          initial={{ opacity: 0, y: 18 }}
          animate={
            isInView
              ? shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -5, 0] }
              : { opacity: 0, y: 18 }
          }
          transition={{
            opacity: { duration: 0.55, delay: 0.35 + i * 0.15 },
            y: { duration: 4.2 + i * 0.5, repeat: shouldReduceMotion ? 0 : Infinity, ease: [0.32, 0.72, 0, 1] },
          }}
        >
          <p className="mb-2 font-display text-[10px] font-semibold tracking-[0.26em] text-gold">
            {card.title}
          </p>
          <p className="text-xs leading-relaxed text-cream/72">{card.text}</p>
        </motion.div>
      ))}

      <motion.div
        className="relative z-10 flex w-full max-w-[960px] flex-col items-center text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* FINAL CHAPTER 标签 */}
        <motion.div
          className="mb-7 border-y border-gold/35 px-4 py-2 font-display italic text-[10px] font-semibold tracking-[0.28em] text-gold"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          FINAL CHAPTER
        </motion.div>

        {/* 主标语逐字淡入 */}
        <div className="mb-8 flex max-w-[920px] flex-wrap justify-center gap-x-1 font-display text-[clamp(2.25rem,8vw,5rem)] font-semibold leading-[1.18] tracking-normal text-cream sm:tracking-[0.05em]">
          {mainText.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 20, filter: 'blur(6px)' }
              }
              transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay: shouldReduceMotion ? 0 : 0.25 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* 副标语 */}
        <motion.p
          className="rounded-lg border border-white/18 bg-white/10 px-5 py-3 text-sm font-medium tracking-[0.22em] text-cream/82 shadow-[0_18px_55px_rgba(0,0,0,0.16)] backdrop-blur-md"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          whileHover={shouldReduceMotion ? undefined : { backgroundColor: 'rgba(255, 255, 255, 0.16)', y: -2 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <span className="font-display">{className}</span>，未来可期
        </motion.p>

        {/* 数据统计网格 */}
        <motion.div
          className="mt-12 grid w-full max-w-[640px] grid-cols-2 gap-3 sm:grid-cols-4"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.55, delay: 1.45 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="rounded-lg bg-white/[0.06] p-1 ring-1 ring-white/[0.08]"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{
                duration: 0.5,
                delay: 1.6 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="rounded-[calc(0.5rem-0.25rem)] bg-white/[0.06] px-3 py-3 text-center">
                <div className="font-display text-2xl font-semibold tracking-tight text-gold sm:text-3xl">
                  {stat.value}{stat.suffix}
                </div>
                <div className="font-display italic text-[10px] text-cream/50">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Section 水印编号 "04" */}
      <div
        className="pointer-events-none absolute bottom-6 right-6 font-display text-[8rem] font-semibold leading-none text-cream/[0.03] select-none"
        aria-hidden="true"
      >
        04
      </div>
    </div>
  )
}
