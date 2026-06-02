import { useState, useEffect, useRef } from 'react'

/**
 * 检测元素是否在 scroll-snap 容器中可见。
 *
 * Framer Motion 的 onViewportEnter 使用 root:null（文档视口），
 * 在 overflow:auto 的 scroll 容器中不可靠（挂载时就误触发）。
 * 此 hook 监听 scroll 容器的 scroll 事件，
 * 用 getBoundingClientRect 检测元素可见性。
 */
export function useSectionInView<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [hasEnteredView, setHasEnteredView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // 向上查找最近的 scroll 容器（snap-y snap-mandatory）
    const container = element.closest('[class*="snap-y"]') as HTMLElement | null
    if (!container) return

    const check = () => {
      const rect = element.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      // 元素与容器可视区域有交集
      if (rect.top < containerRect.bottom && rect.bottom > containerRect.top) {
        setHasEnteredView(true)
        // 一旦触发，移除监听（只触发一次）
        container.removeEventListener('scroll', check)
      }
    }

    container.addEventListener('scroll', check, { passive: true })
    // 立即检查一次（处理首次加载时段落已在视口内的情况）
    check()

    return () => container.removeEventListener('scroll', check)
  }, []) // 仅挂载时运行一次

  return { ref, hasEnteredView }
}
