import { useState, useCallback } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { StudentPage } from './pages/StudentPage'
import { ErrorPage } from './components/ErrorPage'
import { LoadingScreen } from './components/LoadingScreen'

export default function App() {
  const [ready, setReady] = useState(false)

  const handleLoadComplete = useCallback(() => setReady(true), [])

  return (
    <>
      {!ready && <LoadingScreen onComplete={handleLoadComplete} />}
      <div
        className={`transition-opacity duration-700 ease-out ${ready ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <HashRouter>
          <Routes>
            <Route path="/s/:slug" element={<StudentPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </HashRouter>
      </div>
    </>
  )
}
