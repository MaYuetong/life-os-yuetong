export type SectionStatus = 'active' | 'pending' | 'completed' | 'blocked'

export interface SectionLink {
  label: string
  url: string
  external?: boolean
}

export interface Section {
  id: string
  slug: string
  icon: string
  title: string
  titleCN: string
  description: string
  folderName: string      // actual folder name relative to lifeos-yuetong root
  gradient: string        // Tailwind gradient classes for text/border
  cardGradient: string    // card background gradient classes
  glowColor: string       // for hover glow effect
  deadline: number        // 0–1 urgency (1 = most urgent)
  impact: number          // 0–1 life impact
  visa: number            // 0–1 visa/legal urgency
  cost: number            // 0–1 opportunity cost (1 = expensive to skip)
  tasks: string[]
  status: SectionStatus
  progress: number        // 0–100
  links: SectionLink[]
}

export const sections: Section[] = [
  {
    id: 'personal-brand',
    slug: 'personal-brand',
    icon: '🌐',
    title: 'Personal Brand',
    titleCN: '个人品牌',
    description: '个人网站 · 简历 · 作品集',
    folderName: 'personal-resume-website',
    gradient: 'from-purple-500 to-pink-500',
    cardGradient: 'from-purple-500/[0.08] to-pink-500/[0.08]',
    glowColor: 'group-hover:shadow-purple-500/20',
    deadline: 0.7,
    impact: 0.9,
    visa: 0.4,
    cost: 0.8,
    tasks: ['更新个人网站作品', '优化简历关键词', '添加UN项目经历'],
    status: 'active',
    progress: 75,
    links: [
      { label: '编辑网站', url: '/brand' },
      { label: '查看网站', url: '/brand/preview', external: false },
    ],
  },
  {
    id: 'international',
    slug: 'international',
    icon: '🇺🇳',
    title: 'International Affairs',
    titleCN: '国际事务',
    description: 'UNESCO · JPO · UN项目',
    folderName: 'UNESCO-JPO-application',
    gradient: 'from-blue-500 to-cyan-500',
    cardGradient: 'from-blue-500/[0.08] to-cyan-500/[0.08]',
    glowColor: 'group-hover:shadow-blue-500/20',
    deadline: 0.95,
    impact: 0.95,
    visa: 0.7,
    cost: 0.9,
    tasks: ['UNESCO JPO申请跟进 (4/15)', 'UN AI System文档完善', '地图项目最终报告'],
    status: 'active',
    progress: 70,
    links: [],
  },
  {
    id: 'academic',
    slug: 'academic',
    icon: '📚',
    title: 'Academic Research',
    titleCN: '学术研究',
    description: 'MIT暑研 · 研究计划',
    folderName: 'MIT-summer research',
    gradient: 'from-emerald-500 to-teal-500',
    cardGradient: 'from-emerald-500/[0.08] to-teal-500/[0.08]',
    glowColor: 'group-hover:shadow-emerald-500/20',
    deadline: 0.8,
    impact: 0.85,
    visa: 0.5,
    cost: 0.75,
    tasks: ['MIT暑研材料准备', '联系导师邮件', '研究proposal初稿'],
    status: 'active',
    progress: 45,
    links: [],
  },
  {
    id: 'startup',
    slug: 'startup',
    icon: '🚀',
    title: 'Startup & Portfolio',
    titleCN: '创业与作品',
    description: 'Silora Orient · 可视化项目',
    folderName: 'silora-orient',
    gradient: 'from-orange-500 to-amber-500',
    cardGradient: 'from-orange-500/[0.08] to-amber-500/[0.08]',
    glowColor: 'group-hover:shadow-orange-500/20',
    deadline: 0.5,
    impact: 0.8,
    visa: 0.3,
    cost: 0.7,
    tasks: ['Silora Orient产品迭代', '可视化作品集整合', 'UN地图项目展示'],
    status: 'active',
    progress: 55,
    links: [],
  },
  {
    id: 'visa-legal',
    slug: 'visa-legal',
    icon: '🛂',
    title: 'Visa & Legal',
    titleCN: '签证法务',
    description: 'O-1签证 · 爸妈签证',
    folderName: 'O-1 Master Folder',
    gradient: 'from-red-500 to-rose-500',
    cardGradient: 'from-red-500/[0.08] to-rose-500/[0.08]',
    glowColor: 'group-hover:shadow-red-500/20',
    deadline: 0.9,
    impact: 0.7,
    visa: 1.0,
    cost: 0.9,
    tasks: ['O-1签证材料整理', '律师沟通确认', '爸妈签证状态查询'],
    status: 'pending',
    progress: 30,
    links: [],
  },
  {
    id: 'job-hunting',
    slug: 'job-hunting',
    icon: '💼',
    title: 'Job Hunting',
    titleCN: '求职追踪',
    description: '投递记录 · 面试准备',
    folderName: 'Other job-hunting',
    gradient: 'from-violet-500 to-indigo-500',
    cardGradient: 'from-violet-500/[0.08] to-indigo-500/[0.08]',
    glowColor: 'group-hover:shadow-violet-500/20',
    deadline: 0.85,
    impact: 0.9,
    visa: 0.8,
    cost: 0.85,
    tasks: ['跟进UNESCO JPO状态', '准备面试材料', '寻找GIS分析师职位'],
    status: 'active',
    progress: 60,
    links: [{ label: '投递管理台', url: '/job' }],
  },
  {
    id: 'personal',
    slug: 'personal',
    icon: '🩰',
    title: 'Personal Life',
    titleCN: '个人生活',
    description: '芭蕾 · 兴趣 · 健康',
    folderName: 'Ballet',
    gradient: 'from-pink-500 to-fuchsia-500',
    cardGradient: 'from-pink-500/[0.08] to-fuchsia-500/[0.08]',
    glowColor: 'group-hover:shadow-pink-500/20',
    deadline: 0.3,
    impact: 0.6,
    visa: 0.1,
    cost: 0.5,
    tasks: ['芭蕾周练习3次', '自我关怀时间', '联系老朋友'],
    status: 'active',
    progress: 80,
    links: [],
  },
  {
    id: 'memories',
    slug: 'memories',
    icon: '📸',
    title: 'Memories',
    titleCN: '摄影回忆',
    description: '摄影 · 旅行 · 珍贵时刻',
    folderName: 'photos',
    gradient: 'from-sky-500 to-blue-500',
    cardGradient: 'from-sky-500/[0.08] to-blue-500/[0.08]',
    glowColor: 'group-hover:shadow-sky-500/20',
    deadline: 0.2,
    impact: 0.5,
    visa: 0.0,
    cost: 0.3,
    tasks: ['整理DJI离职照片', '创建旅行相册', '导入硬盘摄影作品'],
    status: 'active',
    progress: 40,
    links: [{ label: '回忆相册', url: '/memories' }],
  },
  {
    id: 'life-admin',
    slug: 'life-admin',
    icon: '⚙️',
    title: 'Life Admin',
    titleCN: '系统管理',
    description: 'Life OS · 文件整理',
    folderName: '00-lifeos-yuetong',
    gradient: 'from-slate-400 to-gray-500',
    cardGradient: 'from-slate-500/[0.08] to-gray-500/[0.08]',
    glowColor: 'group-hover:shadow-slate-500/20',
    deadline: 0.4,
    impact: 0.5,
    visa: 0.2,
    cost: 0.4,
    tasks: ['整理文件系统结构', '更新Life OS版本', '备份重要文档'],
    status: 'active',
    progress: 65,
    links: [],
  },
]

export function getSectionBySlug(slug: string): Section | undefined {
  return sections.find((s) => s.slug === slug)
}
