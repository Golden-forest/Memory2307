import { motion, useReducedMotion } from 'framer-motion'

interface MemoryMarqueeProps {
  items: string[]
  className?: string
}

export function MemoryMarquee({ items, className = '' }: MemoryMarqueeProps) {
  const shouldReduceMotion = useReducedMotion()
  const loopItems = [...items, ...items]

  return (
    <div
      className={`pointer-events-none overflow-hidden border-y border-white/14 bg-[#17120f]/72 text-white shadow-[0_-18px_50px_rgba(12,8,6,0.34)] backdrop-blur-md ${className}`}
      aria-hidden="true"
    >
      <motion.div
        className="flex min-w-max items-center"
        animate={shouldReduceMotion ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {loopItems.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex h-11 items-center gap-4 px-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/76 sm:h-[3.25rem] sm:px-6 sm:text-xs"
          >
            <span>{item}</span>
            <span className="h-px w-8 bg-gold/70" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}
