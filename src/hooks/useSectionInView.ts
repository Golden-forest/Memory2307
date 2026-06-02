import { useState, useEffect, useRef } from 'react'

/**
 * 检测元素是否在 scroll-snap 容器中可见（持续追踪）。
 *
 * 每次元素进入视口返回 isInView=true，离开返回 isInView=false，
 * 支持动画反复播放。
 */
export function useSectionInView<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // 向上查找最近的 scroll 容器（snap-y snap-mandatory）
    const container = element.closest('[class*="snap-y"]') as HTMLElement | null
    if (!container) return

    const check = () => {
      const rect = element.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      if (rect.top < containerRect.bottom && rect.bottom > containerRect.top) {
        setIsInView(true)
      } else {
        setIsInView(false)
      }
    }

    container.addEventListener('scroll', check, { passive: true })
    // 立即检查一次（处理首次加载时段落已在视口内的情况）
    check()

    return () => container.removeEventListener('scroll', check)
  }, [])

  return { ref, isInView }
}
