export type SectionStatus = 'active' | 'pending' | 'completed' | 'blocked'

export interface SectionLink {
  label: string
  url: string
  external?: boolean
}

export interface Deadline {
  date: string    // ISO: '2026-04-15'
  label: string
  urgent?: boolean
}

export interface Section {
  id: string
  slug: string
  icon: string
  title: string
  titleCN: string
  description: string
  folderName: string
  gradient: string
  cardGradient: string
  glowColor: string
  deadline: number           // fallback 0–1 static urgency
  deadlineDate?: string      // primary next deadline (ISO) — overrides static score
  deadlines?: Deadline[]     // all deadlines for this section
  impact: number
  visa: number
  cost: number
  tasks: string[]
  completedTasks?: string[]
  status: SectionStatus
  progress: number
  links: SectionLink[]
  liveUrl?: string
  subFolders?: string[]
}

export const sections: Section[] = [
  // ── 00 Personal Brand ──────────────────────────────────────────────
  {
    id: 'personal-brand',
    slug: 'personal-brand',
    icon: '🌐',
    title: 'Personal Brand',
    titleCN: '个人品牌',
    description: '个人网站 · 英文简历 · 作品集',
    folderName: 'personal-resume-website',
    gradient: 'from-purple-500 to-pink-500',
    cardGradient: 'from-purple-500/[0.08] to-pink-500/[0.08]',
    glowColor: 'group-hover:shadow-purple-500/20',
    deadline: 0.7,
    deadlineDate: '2026-04-30',
    deadlines: [
      { date: '2026-04-30', label: '网站加入 UNESCO 经历（UNESCO 申请前完成）' },
      { date: '2026-05-15', label: '简历关键词优化' },
    ],
    impact: 0.9,
    visa: 0.4,
    cost: 0.8,
    tasks: [
      '更新网站 UNESCO/UN 项目经历',
      '添加 Silora Orient 创业经历',
      '优化简历关键词 (GIS · AI · Data)',
    ],
    status: 'active',
    progress: 75,
    links: [{ label: '编辑网站', url: '/brand' }],
  },

  // ── 01 International ───────────────────────────────────────────────
  {
    id: 'international',
    slug: 'international',
    icon: '🇺🇳',
    title: 'International Affairs',
    titleCN: '国际事务',
    description: 'UNESCO JPO · UN Map · ICA Paper',
    folderName: 'UNESCO-JPO-application',
    gradient: 'from-blue-500 to-cyan-500',
    cardGradient: 'from-blue-500/[0.08] to-cyan-500/[0.08]',
    glowColor: 'group-hover:shadow-blue-500/20',
    deadline: 0.95,
    deadlineDate: '2026-04-15',
    deadlines: [
      { date: '2026-04-15', label: 'UNESCO JPO 申请跟进截止', urgent: true },
      { date: '2026-05-01', label: 'UN Map Research ICA 投稿确认' },
    ],
    impact: 0.95,
    visa: 0.7,
    cost: 0.9,
    tasks: [
      'UNESCO JPO 申请跟进 — 截止 4/15 ⚠️',
      'UN Map Research ICA Abstract 跟进',
      '整理 UN 项目文档',
    ],
    completedTasks: [
      'ICA Abstract (Human-AI Co-Review) 完成',
      'UNOCC 地图实习完成',
    ],
    subFolders: ['UN_Map_Research_Project', 'UN AI System', 'UN Map Requirements'],
    status: 'active',
    progress: 65,
    links: [],
  },

  // ── 02 Academic ────────────────────────────────────────────────────
  {
    id: 'academic',
    slug: 'academic',
    icon: '📚',
    title: 'Academic Research',
    titleCN: '学术研究',
    description: 'MIT 暑研 · 研究计划',
    folderName: 'MIT-summer research',
    gradient: 'from-emerald-500 to-teal-500',
    cardGradient: 'from-emerald-500/[0.08] to-teal-500/[0.08]',
    glowColor: 'group-hover:shadow-emerald-500/20',
    deadline: 0.8,
    deadlineDate: '2026-05-01',
    deadlines: [
      { date: '2026-05-01', label: 'MIT 暑研 PI 联系邮件发出' },
      { date: '2026-05-15', label: 'Research Proposal 初稿' },
    ],
    impact: 0.85,
    visa: 0.5,
    cost: 0.75,
    tasks: [
      'MIT 暑研 PI 联系邮件 (本周发出)',
      '整理 GIS + AI 研究 Proposal',
      '更新学术 CV — 加入 ICA 论文',
    ],
    status: 'active',
    progress: 20,
    links: [],
  },

  // ── 03 Startup ─────────────────────────────────────────────────────
  {
    id: 'startup',
    slug: 'startup',
    icon: '🚀',
    title: 'Startup & Portfolio',
    titleCN: 'Silora Orient 创业',
    description: '手工丝花珠宝品牌 · NYC',
    folderName: 'silora-orient',
    gradient: 'from-orange-500 to-amber-500',
    cardGradient: 'from-orange-500/[0.08] to-amber-500/[0.08]',
    glowColor: 'group-hover:shadow-orange-500/20',
    deadline: 0.55,
    deadlineDate: '2026-04-19',
    deadlines: [
      { date: '2026-04-19', label: 'B2C: 本周联系 10 个新 leads', urgent: true },
      { date: '2026-04-19', label: 'Stripe 账号创建 + 15 付款链接' },
      { date: '2026-04-26', label: 'B2B: 50 个目标进入 Airtable' },
      { date: '2026-04-30', label: 'Cal.com 日历链接上线' },
    ],
    impact: 0.8,
    visa: 0.3,
    cost: 0.75,
    tasks: [
      'B2C: 联系 10 个新 leads（本周）',
      'B2C: 发出 3 份报价单',
      'B2C: 跟进 5 个沉默 leads (>3天)',
      'B2B: 研究 10 个 NYC 目标',
      'B2B: 建立 Airtable B2B Partners 数据库',
      '创建 Stripe 账号 + 15 付款链接',
      '创建 Cal.com 日历链接',
      '上传 3 张新产品图',
      '激活 Mailchimp 3 封欢迎邮件序列',
    ],
    completedTasks: [
      'Vercel 部署流水线修复 (Apr 6)',
      'GA4 追踪脚本添加到全部 9 个页面 (Apr 7)',
      'Mailchimp 订阅 API 集成 (Apr 7)',
      '品牌运营 Dashboard 规格文档 6 份 (Apr 10)',
    ],
    status: 'active',
    progress: 30,
    liveUrl: 'https://silora-orient.vercel.app',
    links: [
      { label: '线上网站', url: 'https://silora-orient.vercel.app', external: true },
    ],
  },

  // ── 04 Visa/Legal ──────────────────────────────────────────────────
  {
    id: 'visa-legal',
    slug: 'visa-legal',
    icon: '🛂',
    title: 'Visa & Legal',
    titleCN: '签证法务',
    description: '加拿大签证 · 爸妈签证 · G4',
    folderName: '加拿大签证申请',
    gradient: 'from-red-500 to-rose-500',
    cardGradient: 'from-red-500/[0.08] to-rose-500/[0.08]',
    glowColor: 'group-hover:shadow-red-500/20',
    deadline: 0.85,
    deadlineDate: '2026-05-01',
    deadlines: [
      { date: '2026-05-01', label: '加拿大签证材料提交' },
      { date: '2026-06-01', label: '爸妈签证跟进状态' },
    ],
    impact: 0.7,
    visa: 1.0,
    cost: 0.9,
    tasks: [
      '加拿大签证材料核对 (US Visa + Passport OK)',
      '爸妈签证：跟进状态 / 准备担保材料',
      'G4 签证续签确认',
    ],
    subFolders: ['爸妈签证'],
    status: 'pending',
    progress: 40,
    links: [],
  },

  // ── 05 Job Hunting ─────────────────────────────────────────────────
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
    deadline: 0.88,
    deadlineDate: '2026-04-15',
    deadlines: [
      { date: '2026-04-15', label: 'UNESCO JPO 申请跟进截止', urgent: true },
      { date: '2026-04-20', label: 'UNOCC 面试安排确认' },
      { date: '2026-04-20', label: 'London Spatial Research 跟进' },
    ],
    impact: 0.9,
    visa: 0.85,
    cost: 0.85,
    tasks: [
      'UNESCO JPO 申请跟进 — 截止 4/15 ⚠️',
      'UNOCC 面试安排确认 — 4/20',
      'London Spatial Research Assistant 跟进',
    ],
    completedTasks: [
      'IPO Specialist 深圳 — 已投递 (已拒绝)',
      'London Spatial Research — 已投递',
    ],
    status: 'active',
    progress: 55,
    links: [{ label: '投递管理台', url: '/job' }],
  },

  // ── 06 Personal ────────────────────────────────────────────────────
  {
    id: 'personal',
    slug: 'personal',
    icon: '🩰',
    title: 'Personal Life',
    titleCN: '个人生活',
    description: '芭蕾 · 健康 · 自我',
    folderName: 'Ballet',
    gradient: 'from-pink-500 to-fuchsia-500',
    cardGradient: 'from-pink-500/[0.08] to-fuchsia-500/[0.08]',
    glowColor: 'group-hover:shadow-pink-500/20',
    deadline: 0.3,
    impact: 0.6,
    visa: 0.1,
    cost: 0.5,
    tasks: [
      '芭蕾 — 本周练习 3 次',
      '整理个人照片存档',
      '联系老朋友 (月2位)',
    ],
    status: 'active',
    progress: 70,
    links: [],
  },

  // ── 07 Memories ────────────────────────────────────────────────────
  {
    id: 'memories',
    slug: 'memories',
    icon: '📸',
    title: 'Memories',
    titleCN: '摄影回忆',
    description: '摄影 · 旅行 · 珍贵时刻',
    folderName: 'personal-resume-website/website',
    gradient: 'from-sky-500 to-blue-500',
    cardGradient: 'from-sky-500/[0.08] to-blue-500/[0.08]',
    glowColor: 'group-hover:shadow-sky-500/20',
    deadline: 0.2,
    impact: 0.5,
    visa: 0.0,
    cost: 0.3,
    tasks: [
      '整理旅行照片存档 (维也纳 · 斯德哥尔摩)',
      '个人照片更新到网站',
      '创建 2025–2026 旅行合集',
    ],
    status: 'active',
    progress: 35,
    links: [{ label: '回忆相册', url: '/memories' }],
  },

  // ── 08 Life Admin ──────────────────────────────────────────────────
  {
    id: 'life-admin',
    slug: 'life-admin',
    icon: '⚙️',
    title: 'Life Admin',
    titleCN: '系统管理',
    description: 'Life OS · 文件整理 · 备份',
    folderName: '00-lifeos-yuetong',
    gradient: 'from-slate-400 to-gray-500',
    cardGradient: 'from-slate-500/[0.08] to-gray-500/[0.08]',
    glowColor: 'group-hover:shadow-slate-500/20',
    deadline: 0.35,
    impact: 0.45,
    visa: 0.15,
    cost: 0.35,
    tasks: [
      '每周五更新各板块进度',
      '备份重要文档到云端',
      '文件夹整理',
    ],
    status: 'active',
    progress: 60,
    links: [],
  },
]

export function getSectionBySlug(slug: string): Section | undefined {
  return sections.find((s) => s.slug === slug)
}
