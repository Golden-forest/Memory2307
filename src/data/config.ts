export interface Student {
  slug: string
  name: string
  studentId: string
}

export interface PhotoConfig {
  src: string
  alt: string
  /** focal point for object-position, e.g. "center 30%" */
  objectPosition?: string
}

export interface HeroCopyConfig {
  quote: string
  author: string
}

export interface MessageConfig {
  title: string
  body: string
  author: string
  photoIndex: number
}

export interface ClosingConfig {
  lines: string[]
  greetingLine: string
  closingLine: string
}

export interface SiteConfig {
  className: string
  photos: PhotoConfig[]
  hero: HeroCopyConfig
  messages: MessageConfig[]
  closing: ClosingConfig
}

export const siteConfig: SiteConfig = {
  className: '2307',
  photos: Array.from({ length: 12 }, (_, i) => ({
    src: `/photos/${String(i + 1).padStart(2, '0')}.webp`,
    alt: `班级合照${i + 1}`,
    objectPosition: 'center',
  })),
  hero: {
    quote: '愿你们带着这里的温度，走向更远的山海。',
    author: '',
  },
  messages: [
    {
      title: '把青春装进行囊',
      body: '毕业不是把过去合上，而是终于可以带着这些光，去见更大的世界。',
      author: '',
      photoIndex: 2,
    },
    {
      title: '谢谢每一次并肩',
      body: '同一间教室、同一条走廊、同一张合照，会在很久以后提醒我们，曾经这样认真地相遇过。',
      author: '',
      photoIndex: 7,
    },
    {
      title: '向明天出发',
      body: '愿你们有敢赴山海的勇气，也有在平凡日子里发光的能力。',
      author: '写给未来的你们',
      photoIndex: 8,
    },
  ],
  closing: {
    lines: ['此去', '繁花似锦', '2307的战友们', '再会'],
    greetingLine: '祝',
    closingLine: '毕业快乐',
  },
}
