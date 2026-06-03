import studentsData from './students.json'
import type { Student } from './config'

const studentsMap = new Map<string, Student>(
  (studentsData as Student[]).map((student) => [student.slug, student])
)

export function lookupStudent(slug: string): Student | undefined {
  return studentsMap.get(slug)
}
