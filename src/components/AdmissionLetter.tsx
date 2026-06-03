import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
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
  const { ref, isInView } = useSectionInView()
  const [stage, setStage] = useState<'envelope' | 'opening' | 'letter' | 'content' | 'done'>('envelope')
  const dynamicLines = getDynamicLines(studentName, config)
  const prevInView = useRef(false)
  const shouldReduceMotion = Boolean(useReducedMotion())

  // 每次进入视口时重置信封动画
  useEffect(() => {
    if (isInView && !prevInView.current) {
      setStage(shouldReduceMotion ? 'done' : 'envelope')
    }
    prevInView.current = isInView
  }, [isInView, shouldReduceMotion])

  useEffect(() => {
    if (shouldReduceMotion) return
    if (!isInView) return

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
  }, [stage, isInView, shouldReduceMotion])

  return (
    <div
      ref={ref}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-milk px-4 py-8"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 82% 18%, rgba(184,146,82,0.17), transparent 30%), radial-gradient(circle at 15% 78%, rgba(52,40,35,0.08), transparent 32%), linear-gradient(135deg, rgba(246,240,232,0.98), rgba(231,220,202,0.9))',
        }}
      />
      <motion.div
        className="pointer-events-none absolute right-[-22%] top-[12%] h-24 w-[74vw] max-w-[360px] rotate-[-11deg] rounded-lg bg-gold/14"
        initial={{ opacity: 0, x: 32 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 32 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-[14%] left-[-26%] h-28 w-[82vw] max-w-[400px] rotate-6 rounded-lg bg-brown/8"
        initial={{ opacity: 0, x: -32 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -32 }}
        transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* 信封阶段 */}
      {(stage === 'envelope' || stage === 'opening') && (
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: stage === 'opening' ? [1, 1, 0] : 1,
            scale: 1,
            y: stage === 'envelope' ? [0, -7, 0, -5, 0] : [0, -5, 28],
          }}
          transition={{
            opacity: { duration: 1.2, delay: stage === 'opening' ? 0.45 : 0 },
            scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            y: { duration: 1.5, ease: [0.32, 0.72, 0, 1] },
          }}
        >
          <motion.div
            className="absolute -bottom-8 left-1/2 h-7 w-[82%] -translate-x-1/2 rounded-[50%] bg-brown/15 blur-md"
            animate={stage === 'envelope' ? { scaleX: [1, 0.92, 1] } : { scaleX: 0.78 }}
            transition={{ duration: 1.5, repeat: stage === 'envelope' ? Infinity : 0, ease: [0.32, 0.72, 0, 1] }}
          />

          {/* 信封主体 */}
          <div
            className="relative h-[210px] w-[86vw] max-w-[360px] overflow-hidden rounded-lg border border-white/55 shadow-[0_28px_80px_rgba(60,50,46,0.2)]"
            style={{
              background:
                'linear-gradient(145deg, #E4D6C3 0%, #CDBBA5 54%, #BDA489 100%)',
              boxShadow:
                '0 28px 80px rgba(60, 50, 46, 0.2), inset 0 1px 0 rgba(255,255,255,0.65)',
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-white/70" />
            <div
              className="absolute inset-x-0 top-0 h-[58%]"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.28), rgba(171,145,119,0.5))',
              }}
            />
            <div
              className="absolute bottom-0 left-0 h-[62%] w-[58%]"
              style={{
                clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
                background: 'linear-gradient(135deg, rgba(164,134,106,0.26), rgba(255,255,255,0.16))',
              }}
            />
            <div
              className="absolute bottom-0 right-0 h-[62%] w-[58%]"
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                background: 'linear-gradient(225deg, rgba(139,108,86,0.24), rgba(255,255,255,0.12))',
              }}
            />
            <div className="absolute left-5 top-5 rounded-md border border-brown/10 bg-white/28 px-3 py-1.5 text-[10px] font-semibold tracking-[0.22em] text-brown/60 backdrop-blur-sm">
              2307
            </div>
            <div className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-md border border-white/55 bg-white/20 text-[9px] font-semibold tracking-[0.12em] text-brown/45">
              FUTURE
            </div>

            {/* 封蜡印章 */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <div
                className="grid h-14 w-14 place-items-center rounded-full border border-white/35 text-[10px] font-semibold tracking-[0.18em] text-white shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #9C443A, #7E352F 60%, #B89252)',
                  boxShadow: '0 12px 26px rgba(126, 53, 47, 0.23), inset 0 1px 0 rgba(255,255,255,0.34)',
                }}
              >
                录取
              </div>
            </div>
          </div>

          {/* 封口三角形 */}
          {stage === 'opening' && (
            <motion.div
              className="absolute -top-px left-0 right-0 z-20 overflow-visible"
              style={{ perspective: '760px' }}
            >
              <motion.div
                className="mx-auto h-[105px] w-[86vw] max-w-[360px] rounded-t-lg border-t border-white/55"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  background: 'linear-gradient(180deg, #D8C6B2, #BCA38A)',
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                }}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -180 }}
                transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              />
            </motion.div>
          )}
        </motion.div>
      )}

      {/* 通知书纸张阶段 */}
      {(stage === 'letter' || stage === 'content' || stage === 'done') && (
        <motion.div
          className="relative z-10 w-full max-w-[390px] px-2"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1, scale: stage === 'letter' ? 0.9 : 1 }}
          whileHover={shouldReduceMotion ? undefined : { y: -4 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
          transition={{
            y: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.6 },
            scale: { duration: 0.5 },
          }}
        >
          <motion.div
            className="absolute -inset-3 rounded-lg border border-white/35 bg-white/18 backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={stage !== 'letter' ? { opacity: 1, scale: 1 } : { opacity: 0.55, scale: 0.97 }}
            transition={{ duration: 0.6 }}
          />

          {/* Double-Bezel 外壳 */}
          <div className="p-1.5 rounded-[1.25rem] bg-brown/[0.06] ring-1 ring-brown/[0.08]">
            {/* Double-Bezel 内核（纸张） */}
            <div
              className="relative overflow-hidden rounded-[calc(1.25rem-0.375rem)] border border-gold/48 bg-cream px-5 py-7 sm:px-7 sm:py-8"
              style={{
                background:
                  'linear-gradient(180deg, rgba(250,246,242,0.98), rgba(245,240,235,0.96)), linear-gradient(90deg, rgba(196,162,101,0.14), transparent 22%)',
                boxShadow: '0 24px 80px rgba(52, 40, 35, 0.17), inset 0 1px 0 rgba(255,255,255,0.76)',
              }}
            >
              <div className="absolute inset-[10px] rounded-md border border-gold/25" />
              <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-[#8E3B35] via-gold to-brown/50" />
              <div
                className="absolute right-0 top-0 h-24 w-24 bg-gold/20"
                style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
              />
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl font-bold tracking-[0.08em] text-gold/10">
                2307
              </div>

              <div className="relative mb-5 flex items-center justify-between font-display text-[9px] font-semibold tracking-[0.22em] text-warm-gray">
                <span>MEMORY 2307</span>
                <span>JUNE</span>
              </div>

              {/* 标题：录取通知书 */}
              <motion.h2
                className="relative mb-4 text-center font-display text-[clamp(1.15rem,5vw,1.45rem)] font-bold tracking-[0.26em]"
                style={{
                  background: 'linear-gradient(135deg, #8E3B35, #B89252 72%)',
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

              <motion.div
                className="relative mx-auto mb-6 h-px w-28 bg-gradient-to-r from-transparent via-gold to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={stage !== 'letter' ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
              />

              {/* 正文内容逐行浮现 */}
              <div className="relative space-y-1.5 text-center text-sm leading-relaxed text-brown">
                {dynamicLines.map((line, i) => (
                  <motion.p
                    key={i}
                    className={`font-display ${i === 0 ? 'text-base font-semibold' : ''} ${line === '' ? 'h-2' : ''}`}
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
                className="relative mt-8 flex items-end justify-between gap-4"
                initial={{ opacity: 0 }}
                animate={stage === 'done' ? { opacity: 1 } : {}}
                transition={{ duration: 0.8 }}
              >
                <div className="font-display text-left text-[10px] font-medium leading-relaxed tracking-[0.18em] text-warm-gray">
                  <p>未来通行证</p>
                  <p className="text-brown/45">已签发</p>
                </div>
                <div
                  className="grid h-16 w-16 rotate-[-10deg] place-items-center rounded-full border-2 border-[#8E3B35]/58 text-center text-[10px] font-semibold leading-tight tracking-[0.14em] text-[#8E3B35]/78"
                  style={{ backgroundColor: 'rgba(142, 59, 53, 0.045)' }}
                >
                  <span>
                    正式
                    <br />
                    录取
                  </span>
                </div>
              </motion.div>

              {/* Section number "03" 水印 */}
              <span className="pointer-events-none absolute bottom-1 right-3 font-display text-[8rem] font-bold leading-none text-brown/[0.04]">
                03
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
