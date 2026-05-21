// ── Life OS Category Architecture ──────────────────────────────────────
// Four domains: 对外 · 艺术 · 科学/科技 · 日常

export interface CategoryBusiness {
  label: string
  sectionIds: string[]
}

export interface CategoryLearning {
  label: string
  path: string
  description: string
}

export interface Category {
  id: string
  icon: string
  label: string           // Chinese
  labelEN: string         // English subtitle
  description: string
  gradient: string        // Tailwind gradient classes
  borderColor: string     // for accent lines
  textAccent: string      // for headings in theme
  business: CategoryBusiness
  learning?: CategoryLearning
  quickLinks?: { label: string; url: string; external?: boolean }[]
}

export const CATEGORIES: Category[] = [

  // ── 🌏 对外 ────────────────────────────────────────────────────────
  {
    id: 'external',
    icon: '🌏',
    label: '对外',
    labelEN: 'External & Brand',
    description: '公开形象管理 · 个人网站 · 简历 · 求职',
    gradient: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-500/20',
    textAccent: 'text-violet-400',
    business: {
      label: '事业',
      sectionIds: ['personal-website'],
    },
    quickLinks: [
      { label: '个人网站', url: 'https://mayuetong.github.io', external: true },
      { label: '英文简历', url: '/brand' },
      { label: '求职追踪', url: '/job' },
    ],
  },

  // ── 🎨 艺术 ────────────────────────────────────────────────────────
  {
    id: 'arts',
    icon: '🎨',
    label: '艺术',
    labelEN: 'Arts & Craft',
    description: '珠宝创业 · 大都会导览 · 博物馆 Library · 摄影',
    gradient: 'from-rose-500 to-pink-500',
    borderColor: 'border-rose-500/20',
    textAccent: 'text-rose-400',
    business: {
      label: '事业',
      sectionIds: ['silora-orient', 'met-tour', 'fuye'],
    },
    learning: {
      label: '博物馆 Library',
      path: '/arts/library',
      description: '作品记录 · 观展笔记 · 手机上传',
    },
    quickLinks: [
      { label: 'Silora 网站', url: 'https://silora-orient.vercel.app', external: true },
      { label: 'Be My Model', url: 'https://silora-orient.vercel.app/model.html', external: true },
      { label: 'Instagram', url: 'https://instagram.com', external: true },
      { label: 'Met Tour 系统', url: 'https://met-tour-business-system.vercel.app', external: true },
      { label: '摄影回忆', url: '/memories' },
    ],
  },

  // ── 🔬 科学/科技 ───────────────────────────────────────────────────
  {
    id: 'science',
    icon: '🔬',
    label: '科学/科技',
    labelEN: 'Science & Technology',
    description: 'GIS · AI · UN 研究 · 数据可视化 · 签证身份',
    gradient: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/20',
    textAccent: 'text-emerald-400',
    business: {
      label: '事业 & 研究',
      sectionIds: ['research', 'unocc-basemap', 'zodiac', 'o1-visa'],
    },
    learning: {
      label: '学习追踪',
      path: '/science/learning',
      description: 'GIS · AI/ML · 软件开发 · 课程笔记',
    },
    quickLinks: [
      { label: 'ZODIAC 平台', url: 'https://mayuetong.github.io/APH-IAEA-GIS-Platform', external: true },
      { label: 'UNOCC ArcGIS', url: 'https://experience.arcgis.com/experience/b01db399b3f74eefaeb5e3b8e85aea66', external: true },
    ],
  },

  // ── 🏠 日常 ────────────────────────────────────────────────────────
  {
    id: 'daily',
    icon: '🏠',
    label: '日常',
    labelEN: 'Daily Life',
    description: '签证 · 家人 · 生活管理 · 副业收入',
    gradient: 'from-amber-500 to-orange-400',
    borderColor: 'border-amber-500/20',
    textAccent: 'text-amber-400',
    business: {
      label: '管理',
      sectionIds: ['admin'],
    },
    quickLinks: [
      { label: '截止日历', url: '/deadlines' },
    ],
  },
]

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id)
}

// Return which category a section belongs to
export function getCategoryForSection(sectionId: string): Category | undefined {
  return CATEGORIES.find(
    c => c.business.sectionIds.includes(sectionId)
  )
}
