export interface Student {
  slug: string
  name: string
}

export interface PhotoConfig {
  src: string
  alt: string
  /** focal point for object-position, e.g. "center 30%" */
  objectPosition?: string
}

export interface TeacherMessageConfig {
  quote: string
  author: string
}

export interface AdmissionLetterConfig {
  body: string
  major: string
  location: string
  date: string
}

export interface StatsConfig {
  label: string
  value: string
  suffix?: string
}

export interface SiteConfig {
  className: string
  photos: PhotoConfig[]
  teacherMessage: TeacherMessageConfig
  admissionLetter: AdmissionLetterConfig
  stats: StatsConfig[]
}

export const siteConfig: SiteConfig = {
  className: '2307',
  photos: Array.from({ length: 12 }, (_, i) => ({
    src: `/photos/${String(i + 1).padStart(2, '0')}.webp`,
    alt: `班级合照${i + 1}`,
    objectPosition: 'center',
  })),
  teacherMessage: {
    quote: '同学们，毕业不是终点，而是一切伟大故事的序章。愿你们带着这里的温度，走向更远的山海。',
    author: '×××老师',
  },
  admissionLetter: {
    body: '经 2307 班共同见证，你已被更广阔的未来正式录取。',
    major: '星辰与山海',
    location: '更辽阔的人生',
    date: '2026年6月',
  },
  stats: [
    { label: '位同窗', value: '46', suffix: '' },
    { label: '天相伴', value: '1095', suffix: '' },
    { label: '张合照', value: '12', suffix: '' },
    { label: '份回忆', value: '∞', suffix: '' },
  ],
}
