import { HashRouter, Routes, Route } from 'react-router-dom'
import { StudentPage } from './pages/StudentPage'
import { ErrorPage } from './components/ErrorPage'
import studentsData from './data/students.json'
import type { Student } from './data/config'

const studentsMap = new Map<string, Student>(
  (studentsData as Student[]).map((s) => [s.slug, s])
)

export function lookupStudent(slug: string): Student | undefined {
  return studentsMap.get(slug)
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/s/:slug" element={<StudentPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </HashRouter>
  )
}
