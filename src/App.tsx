import { HashRouter, Routes, Route } from 'react-router-dom'
import { StudentPage } from './pages/StudentPage'
import { ErrorPage } from './components/ErrorPage'

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
