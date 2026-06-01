import { motion } from 'framer-motion'

export function ErrorPage() {
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center bg-milk px-8 text-center">
      {/* 灯泡图标（CSS 绘制） */}
      <motion.div
        className="mb-8 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* 发光效果 */}
        <div
          className="absolute h-20 w-20 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(196,162,101,0.3), transparent 70%)',
          }}
        />
        {/* 灯泡 */}
        <div
          className="relative h-10 w-10 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #C4A265, #D4A84B)',
          }}
        />
      </motion.div>

      {/* 主文字 */}
      <motion.h1
        className="text-xl text-brown"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        这张记忆卡还没有被点亮。
      </motion.h1>

      {/* 副文字 */}
      <motion.p
        className="mt-4 text-sm text-warm-gray"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        如果你认为这是一个错误，请联系 2307 班同学。
      </motion.p>

      {/* 呼吸动画装饰线 */}
      <motion.div
        className="mt-8 h-px w-16 bg-gold/30"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
