import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { lookupStudent } from '../App'
import { siteConfig } from '../data/config'
import { PhotoIntro } from '../components/PhotoIntro'
import { TeacherMessage } from '../components/TeacherMessage'
import { AdmissionLetter } from '../components/AdmissionLetter'
import { EndingQuote } from '../components/EndingQuote'
import { ErrorPage } from '../components/ErrorPage'
import { MusicControl } from '../components/MusicControl'

export function StudentPage() {
  const { slug } = useParams<{ slug: string }>()
  const student = slug ? lookupStudent(slug) : undefined

  // blackout overlay state
  const [showBlackout, setShowBlackout] = useState(true)

  // Phase 0: blackout → reveal content
  useEffect(() => {
    const timer = setTimeout(() => setShowBlackout(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!student) {
    return <ErrorPage />
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-milk">
      <MusicControl />

      {/* Blackout overlay */}
      {showBlackout && (
        <motion.div
          className="absolute inset-0 z-50 bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Vertical scroll-snap container */}
      <div className="h-[100dvh] overflow-y-auto snap-y snap-mandatory">
        {/* Section 1: Photos */}
        <section className="h-[100dvh] snap-start snap-always">
          <PhotoIntro photos={siteConfig.photos} />
        </section>

        {/* Section 2: Teacher Message */}
        <section className="h-[100dvh] snap-start snap-always">
          <TeacherMessage
            quote={siteConfig.teacherMessage.quote}
          />
        </section>

        {/* Section 3: Admission Letter */}
        <section className="h-[100dvh] snap-start snap-always">
          <AdmissionLetter
            studentName={student.name}
            config={siteConfig.admissionLetter}
          />
        </section>

        {/* Section 4: Ending */}
        <section className="h-[100dvh] snap-start snap-always">
          <EndingQuote className={siteConfig.className} />
        </section>
      </div>
    </div>
  )
}
