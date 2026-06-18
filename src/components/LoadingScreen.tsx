import { useState, useEffect, useCallback } from 'react'
import { siteConfig } from '../data/config'

interface LoadingScreenProps {
  onComplete: () => void
}

const TIMEOUT_MS = 15_000
const ALL_IMAGES = siteConfig.photos.map((p) => p.src)

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [timedOut, setTimedOut] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const finish = useCallback(() => {
    setLeaving(true)
    setTimeout(() => onComplete(), 800)
  }, [onComplete])

  // Remove the HTML inline loader once React takes over
  useEffect(() => {
    const el = document.getElementById('initial-loader')
    if (el) el.remove()
  }, [])

  useEffect(() => {
    let cancelled = false
    let done = 0
    const total = ALL_IMAGES.length

    const onOne = () => {
      if (cancelled) return
      done++
      setLoaded(done)
      setProgress(Math.round((done / total) * 100))
      if (done === total) finish()
    }

    ALL_IMAGES.forEach((src) => {
      const img = new Image()
      img.onload = onOne
      img.onerror = onOne // count failures so we don't hang forever
      img.src = src
    })

    // Timeout fallback
    const timer = setTimeout(() => {
      if (!cancelled) {
        setTimedOut(true)
      }
    }, TIMEOUT_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [finish])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-[opacity,visibility] duration-[800ms] ease-out ${leaving ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
      style={{ background: '#f5f0eb' }}
    >
      {/* Three animated dots */}
      <div className="flex gap-2 mb-6">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block h-[6px] w-[6px] rounded-full bg-ink animate-[loaderDot_1.4s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="relative h-[2px] w-40 rounded-full bg-stone/40 mb-4">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-ink transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status text */}
      <p className="text-[13px] tracking-[2px] text-muted">
        {timedOut
          ? `加载较慢，已就绪 ${loaded}/${ALL_IMAGES.length}`
          : progress < 100
            ? `正在准备回忆 ${progress}%`
            : '准备就绪'}
      </p>

      {/* Skip button after timeout */}
      {timedOut && !leaving && (
        <button
          onClick={finish}
          className="mt-6 text-xs tracking-widest text-muted/70 border border-muted/20 rounded-full px-5 py-2 transition-colors hover:text-ink hover:border-ink/40"
        >
          直接进入
        </button>
      )}
    </div>
  )
}
