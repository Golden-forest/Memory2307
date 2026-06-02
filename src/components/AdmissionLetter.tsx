import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { AdmissionLetterConfig } from '../data/config'
import { useSectionInView } from '../hooks/useSectionInView'

interface Props {
  studentName: string
  config: AdmissionLetterConfig
}

/** 信封各阶段时间（毫秒） */
const TIMELINE = {
  envelopeIn: 800,
  breathing: 700,
  flapOpen: 700,
  letterSlide: 1500,
  envelopeOut: 500,
  letterCenter: 300,
  contentFade: 2500,
}

function getDynamicLines(name: string, config: AdmissionLetterConfig): string[] {
  return [
    `亲爱的 ${name} 同学：`,
    '',
    config.body,
    '',
    `录取专业：${config.major}`,
    `报到地点：${config.location}`,
    '',
    config.date,
  ]
}

export function AdmissionLetter({ studentName, config }: Props) {
  const { ref, hasEnteredView } = useSectionInView()
  const [stage, setStage] = useState<'envelope' | 'opening' | 'letter' | 'content' | 'done'>('envelope')
  const dynamicLines = getDynamicLines(studentName, config)

  useEffect(() => {
    if (!hasEnteredView) return

    if (stage === 'envelope') {
      const t = setTimeout(() => setStage('opening'), TIMELINE.envelopeIn + TIMELINE.breathing)
      return () => clearTimeout(t)
    }
    if (stage === 'opening') {
      const t = setTimeout(() => setStage('letter'), TIMELINE.flapOpen + TIMELINE.letterSlide)
      return () => clearTimeout(t)
    }
    if (stage === 'letter') {
      const t = setTimeout(() => setStage('content'), TIMELINE.envelopeOut + TIMELINE.letterCenter)
      return () => clearTimeout(t)
    }
    if (stage === 'content') {
      const t = setTimeout(() => setStage('done'), TIMELINE.contentFade)
      return () => clearTimeout(t)
    }
  }, [stage, hasEnteredView])

  return (
    <div
      ref={ref}
      className="flex h-full w-full items-center justify-center bg-milk"
    >
      {/* 信封阶段 */}
      {(stage === 'envelope' || stage === 'opening') && (
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: stage === 'opening' ? 0 : 1,
            scale: 1,
            y: stage === 'envelope' ? [0, -6, 0, -6, 0] : [0, 30],
          }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 0.8, ease: 'easeOut' },
            y: { duration: 1.5, ease: 'easeInOut' },
          }}
        >
          {/* 信封主体 */}
          <div
            className="relative h-[200px] w-[320px] rounded-lg shadow-lg"
            style={{ backgroundColor: '#D4C5B2' }}
          >
            {/* 信封内部阴影（模拟深度） */}
            <div
              className="absolute inset-x-0 top-0 h-1/2 rounded-t-lg"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.08), transparent)' }}
            />

            {/* 封蜡印章 */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <div
                className="h-12 w-12 rounded-full shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #D4A84B, #C4A265, #B8956A)',
                }}
              />
            </div>
          </div>

          {/* 封口三角形 */}
          {stage === 'opening' && (
            <motion.div
              className="absolute -top-px left-0 right-0 overflow-hidden"
              style={{ perspective: '600px' }}
            >
              <motion.div
                className="mx-auto h-0 w-0"
                style={{
                  borderLeft: '160px solid transparent',
                  borderRight: '160px solid transparent',
                  borderTop: '80px solid #C9B8A4',
                  transformOrigin: 'top center',
                }}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -180 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
              />
            </motion.div>
          )}
        </motion.div>
      )}

      {/* 通知书纸张阶段 */}
      {(stage === 'letter' || stage === 'content' || stage === 'done') && (
        <motion.div
          className="relative w-[85vw] max-w-[340px]"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1, scale: stage === 'letter' ? 0.9 : 1 }}
          transition={{
            y: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.6 },
            scale: { duration: 0.5 },
          }}
        >
          {/* 纸张 */}
          <div
            className="relative rounded-sm px-6 py-8"
            style={{
              background: 'linear-gradient(180deg, #FAF6F2, #F5F0EB)',
              border: '3px double #C4A265',
              boxShadow: '0 4px 24px rgba(60, 50, 46, 0.12)',
            }}
          >
            {/* 标题：录取通知书 */}
            <motion.h2
              className="mb-6 text-center text-xl font-bold tracking-[0.3em]"
              style={{
                background: 'linear-gradient(135deg, #C4A265, #D4A84B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              initial={{ opacity: 0 }}
              animate={stage !== 'letter' ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              录取通知书
            </motion.h2>

            {/* 正文内容逐行浮现 */}
            <div className="space-y-2 text-center text-sm leading-relaxed text-brown">
              {dynamicLines.map((line, i) => (
                <motion.p
                  key={i}
                  className={i === 0 ? 'text-base font-semibold' : ''}
                  initial={{ opacity: 0, y: 8 }}
                  animate={
                    stage === 'content' || stage === 'done'
                      ? { opacity: line === '' ? 0 : 1, y: 0 }
                      : { opacity: 0 }
                  }
                  transition={{
                    duration: 0.4,
                    delay: stage === 'content' ? 0.3 + i * 0.2 : 0,
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* 底部盖章样式 */}
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0 }}
              animate={stage === 'done' ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div
                className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-4 py-1.5"
                style={{ backgroundColor: 'rgba(196, 162, 101, 0.08)' }}
              >
                <div className="h-2 w-2 rounded-full bg-gold/60" />
                <span className="text-xs tracking-wider text-gold/80">{config.date}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
