import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  className: string
}

export function EndingQuote({ className }: Props) {
  const [hasEnteredView, setHasEnteredView] = useState(false)
  const mainText = '敢赴山海，追梦星辰'
  const subText = `${className}，未来可期`
  const footer = `此纪念卡由 ${className} 班制作`

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center justify-center px-10"
      onViewportEnter={() => {
        if (!hasEnteredView) setHasEnteredView(true)
      }}
    >
      {/* 主标语逐字淡入 */}
      <div className="mb-6 text-2xl font-light tracking-[0.2em] text-brown">
        {mainText.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={hasEnteredView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* 副标语 */}
      <motion.p
        className="mb-12 text-sm tracking-[0.3em] text-warm-gray"
        initial={{ opacity: 0 }}
        animate={hasEnteredView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.5 }}
      >
        {subText}
      </motion.p>

      {/* 底部署名 */}
      <motion.p
        className="text-xs text-warm-gray/50"
        initial={{ opacity: 0 }}
        animate={hasEnteredView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 2.5 }}
      >
        {footer}
      </motion.p>
    </motion.div>
  )
}
