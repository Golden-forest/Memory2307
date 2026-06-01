import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { lookupStudent } from '../App'
import { siteConfig } from '../data/config'
import { PhotoIntro } from '../components/PhotoIntro'
import { TeacherMessage } from '../components/TeacherMessage'
import { AdmissionLetter } from '../components/AdmissionLetter'
import { EndingQuote } from '../components/EndingQuote'
import { ErrorPage } from '../components/ErrorPage'
import { MusicControl } from '../components/MusicControl'

type Phase = 'blackout' | 'photos' | 'message' | 'letter' | 'ending'

export function StudentPage() {
  const { slug } = useParams<{ slug: string }>()
  const student = slug ? lookupStudent(slug) : undefined

  const [phase, setPhase] = useState<Phase>('blackout')

  // Phase 0: blackout → photos
  useEffect(() => {
    const timer = setTimeout(() => setPhase('photos'), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!student) {
    return <ErrorPage />
  }

  const handlePhotosDone = () => setPhase('message')
  const handleMessageDone = () => setPhase('letter')
  const handleLetterDone = () => setPhase('ending')

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-milk">
      <MusicControl />
      <AnimatePresence mode="wait">
        {phase === 'blackout' && (
          <motion.div
            key="blackout"
            className="absolute inset-0 z-50 bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
        {phase === 'photos' && (
          <motion.div
            key="photos"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8 }}
          >
            <PhotoIntro photos={siteConfig.photos} onDone={handlePhotosDone} />
          </motion.div>
        )}
        {phase === 'message' && (
          <motion.div
            key="message"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TeacherMessage
              quote={siteConfig.teacherMessage.quote}
              author={siteConfig.teacherMessage.author}
              onDone={handleMessageDone}
            />
          </motion.div>
        )}
        {phase === 'letter' && (
          <motion.div
            key="letter"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AdmissionLetter
              studentName={student.name}
              config={siteConfig.admissionLetter}
              onDone={handleLetterDone}
            />
          </motion.div>
        )}
        {phase === 'ending' && (
          <motion.div
            key="ending"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <EndingQuote className={siteConfig.className} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
