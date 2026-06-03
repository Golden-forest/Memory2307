export function ErrorPage() {
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center bg-milk px-8 text-center">
      {/* 灯泡图标（CSS 绘制） */}
      <div className="mb-8 flex animate-[errorIn_800ms_ease-out_both] flex-col items-center">
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
      </div>

      {/* 主文字 */}
      <h1 className="animate-[errorIn_800ms_180ms_ease-out_both] text-xl text-brown">
        这张记忆卡还没有被点亮。
      </h1>

      {/* 呼吸动画装饰线 */}
      <div className="mt-8 h-px w-16 animate-pulse bg-gold/30" />
    </div>
  )
}
