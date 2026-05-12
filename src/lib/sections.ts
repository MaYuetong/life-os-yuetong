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
  folderName: string          // relative to LIFEOS_ROOT
  gradient: string
  cardGradient: string
  glowColor: string
  deadline: number            // 0–1 urgency score
  deadlineDate?: string       // next deadline ISO date
  deadlines?: Deadline[]
  impact: number
  visa: number
  cost: number
  tasks: string[]
  completedTasks?: string[]
  status: SectionStatus
  progress: number
  links: SectionLink[]
  liveUrl?: string            // deployed frontend URL
  vaultPath?: string          // relative path to Obsidian vault or docs folder
  readmePath?: string         // relative path to README file
  startDate?: string          // ISO: project start date
  lastUpdated?: string        // ISO: last significant update
  subFolders?: string[]
}

export const sections: Section[] = [

  // ── 00 Silora Orient ───────────────────────────────────────────────
  {
    id: 'silora-orient',
    slug: 'silora-orient',
    icon: '🌸',
    title: 'Silora Orient',
    titleCN: 'Silora Orient 创业',
    description: '手工丝花珠宝品牌 · NYC',
    folderName: 'silora-orient',
    gradient: 'from-orange-500 to-amber-500',
    cardGradient: 'from-orange-500/[0.08] to-amber-500/[0.08]',
    glowColor: 'group-hover:shadow-orange-500/20',
    deadline: 0.6,
    deadlineDate: '2026-05-15',
    deadlines: [
      { date: '2026-05-15', label: 'B2B: 50 个目标进入 Airtable' },
      { date: '2026-05-20', label: 'Cal.com 日历链接上线 + Stripe 付款链接' },
      { date: '2026-05-31', label: 'Mailchimp 欢迎邮件序列激活' },
    ],
    impact: 0.85,
    visa: 0.3,
    cost: 0.8,
    tasks: [
      'B2C: 跟进沉默 leads（>3天未回复）',
      'B2B: 建立 Airtable Partners 数据库 · 50 个目标',
      '创建 Cal.com 预约链接 + Stripe 付款链接',
      '上传新产品图 · 激活 Mailchimp 序列',
    ],
    completedTasks: [
      'Vercel 部署流水线修复',
      'GA4 追踪脚本全站添加',
      'Mailchimp 订阅 API 集成',
      '定价体系 + $6 订阅优惠码上线',
    ],
    status: 'active',
    progress: 40,
    liveUrl: 'https://silora-orient.vercel.app',
    readmePath: 'silora-orient/README.md',
    startDate: '2026-04-04',
    lastUpdated: '2026-05-06',
    links: [{ label: '线上网站', url: 'https://silora-orient.vercel.app', external: true }],
  },

  // ── 01 Research ────────────────────────────────────────────────────
  {
    id: 'research',
    slug: 'research',
    icon: '🔬',
    title: 'Academic Research',
    titleCN: '学术研究',
    description: 'MIT 暑研 · ICA 论文 · UN 地图研究',
    folderName: 'MIT-summer research',
    gradient: 'from-emerald-500 to-teal-500',
    cardGradient: 'from-emerald-500/[0.08] to-teal-500/[0.08]',
    glowColor: 'group-hover:shadow-emerald-500/20',
    deadline: 0.75,
    deadlineDate: '2026-05-15',
    deadlines: [
      { date: '2026-05-15', label: 'MIT 暑研 PI 联系邮件发出' },
      { date: '2026-05-31', label: 'Research Proposal 初稿' },
      { date: '2026-06-15', label: 'ICA 论文跟进 · 修改意见回复' },
    ],
    impact: 0.85,
    visa: 0.5,
    cost: 0.75,
    tasks: [
      'MIT 暑研 PI 联系邮件（本周发出）',
      '整理 GIS + AI Research Proposal',
      '更新学术 CV — 加入 ICA 论文',
      'UN 地图研究：数据整理 + 分析框架',
    ],
    completedTasks: [
      'ICA Abstract (Human-AI Co-Review) 完成提交',
      'UNOCC 地图实习项目完成',
    ],
    status: 'active',
    progress: 25,
    vaultPath: 'UN_Map_Research_Project',
    readmePath: 'UN_Map_Research_Project/README.md',
    startDate: '2026-04-12',
    lastUpdated: '2026-04-12',
    subFolders: ['UN_Map_Research_Project', 'UN AI System', 'UN-Cartography-Research'],
    links: [],
  },

  // ── 02 Met Tour Business System ────────────────────────────────────
  {
    id: 'met-tour',
    slug: 'met-tour',
    icon: '🎨',
    title: 'Met Tour Business System',
    titleCN: '大都会艺术导览系统',
    description: '预约系统 · 问卷 · 管理后台',
    folderName: 'met-tour-business-system',
    gradient: 'from-red-500 to-rose-400',
    cardGradient: 'from-red-500/[0.08] to-rose-400/[0.08]',
    glowColor: 'group-hover:shadow-red-500/20',
    deadline: 0.5,
    deadlineDate: '2026-05-20',
    deadlines: [
      { date: '2026-05-20', label: '公开评语 Marketing 展示页上线' },
      { date: '2026-06-01', label: '英文多语言支持' },
    ],
    impact: 0.75,
    visa: 0.2,
    cost: 0.7,
    tasks: [
      '公开评语 Marketing 展示页',
      '多语言支持（英文界面）',
      '微信支付集成',
    ],
    completedTasks: [
      '预约表单 + 确认邮件',
      '讲解员管理（按日期自动匹配）',
      '参观前/后问卷 + Referral 码',
      '管理员 Formspree 即时通知',
      '前端重设计（Met 官方色 · 无阴影 · 双语）',
      'CSV 全量导出 + 管理后台 surveys 页',
    ],
    status: 'active',
    progress: 75,
    liveUrl: 'https://met-tour-business-system.vercel.app',
    vaultPath: 'met-tour-business-system/vault',
    readmePath: 'met-tour-business-system/README.md',
    startDate: '2026-05-04',
    lastUpdated: '2026-05-06',
    links: [{ label: '线上系统', url: 'https://met-tour-business-system.vercel.app', external: true }],
  },

  // ── 03 Personal Website ────────────────────────────────────────────
  {
    id: 'personal-website',
    slug: 'personal-website',
    icon: '🌐',
    title: 'Personal Website & Resume',
    titleCN: '个人网站 & 简历',
    description: '个人主页 · 英/中简历 · 作品集',
    folderName: '/Users/mayuetong/Desktop/work/2026/personal-resume-website',
    gradient: 'from-purple-500 to-pink-500',
    cardGradient: 'from-purple-500/[0.08] to-pink-500/[0.08]',
    glowColor: 'group-hover:shadow-purple-500/20',
    deadline: 0.65,
    deadlineDate: '2026-05-31',
    deadlines: [
      { date: '2026-05-31', label: '加入 ZODIAC / IAEA 项目经历到简历' },
      { date: '2026-06-15', label: '简历关键词优化 (GIS · AI · Data)' },
    ],
    impact: 0.85,
    visa: 0.35,
    cost: 0.75,
    tasks: [
      '加入 IAEA/FAO ZODIAC 项目经历',
      '更新 Silora Orient 创业经历到简历',
      '简历关键词优化 (GIS · AI · Data)',
      '添加 MIT 暑研 / 新工作经历',
    ],
    completedTasks: [
      '网站部署上线 (mayuetong.github.io)',
      '双语简历（英/中）HTML + Word 版本',
      '个人网站 Places / About / Other 页面',
      'UNESCO/UNOCC 经历更新',
      'Day/Night 模式 + Silora Orient 链接',
    ],
    status: 'active',
    progress: 75,
    liveUrl: 'https://mayuetong.github.io',
    vaultPath: '/Users/mayuetong/Desktop/work/2026/personal-resume-website',
    readmePath: '/Users/mayuetong/Desktop/work/2026/personal-resume-website/resume/master_resume.md',
    startDate: '2026-03-01',
    lastUpdated: '2026-05-06',
    links: [
      { label: '个人网站', url: 'https://mayuetong.github.io', external: true },
      { label: '编辑简历', url: '/brand' },
    ],
  },

  // ── 04 UNOCC Basemap ───────────────────────────────────────────────
  {
    id: 'unocc-basemap',
    slug: 'unocc-basemap',
    icon: '🗺️',
    title: 'UNOCC Basemap',
    titleCN: 'UNOCC 底图系统',
    description: 'ArcGIS 底图前端 · Claude skill · PNG 自动导出',
    folderName: 'UN Map Requirements',
    gradient: 'from-blue-500 to-cyan-500',
    cardGradient: 'from-blue-500/[0.08] to-cyan-500/[0.08]',
    glowColor: 'group-hover:shadow-blue-500/20',
    deadline: 0.45,
    impact: 0.7,
    visa: 0.6,
    cost: 0.6,
    tasks: [
      '维护 unocc-basemap Claude skill',
      '更新 ArcGIS Experience Builder 配置',
      '底图样式优化 · 新国家覆盖',
    ],
    completedTasks: [
      'unocc-basemap skill 创建并部署',
      'ArcGIS Watchroom 底图前端搭建',
      '邮件请求 → PNG 自动导出流程',
    ],
    status: 'active',
    progress: 80,
    liveUrl: 'https://experience.arcgis.com/experience/b01db399b3f74eefaeb5e3b8e85aea66',
    startDate: '2026-03-15',
    lastUpdated: '2026-04-20',
    links: [],
  },

  // ── 05 副业（Met 门票）─────────────────────────────────────────────
  {
    id: 'fuye',
    slug: 'fuye',
    icon: '🎫',
    title: 'Met Museum Side Project',
    titleCN: '大都会博物馆副业',
    description: '门票预约记录 · 志愿讲解 · 副业管理',
    folderName: '副业',
    gradient: 'from-amber-500 to-yellow-400',
    cardGradient: 'from-amber-500/[0.08] to-yellow-400/[0.08]',
    glowColor: 'group-hover:shadow-amber-500/20',
    deadline: 0.4,
    impact: 0.55,
    visa: 0.1,
    cost: 0.45,
    tasks: [
      '更新门票预约记录（每次导游后）',
      '统计月度收入 · 更新大都会.xlsx',
      '招募新志愿讲解员',
    ],
    completedTasks: [
      '4月–5月门票记录整理完成',
      '讲解员排班系统接入 Met Tour 系统',
    ],
    status: 'active',
    progress: 60,
    vaultPath: '副业/大都会博馆',
    startDate: '2026-03-28',
    lastUpdated: '2026-05-05',
    links: [],
  },

  // ── 06 IAEA/FAO ZODIAC ─────────────────────────────────────────────
  {
    id: 'zodiac',
    slug: 'zodiac',
    icon: '☢️',
    title: 'IAEA/FAO ZODIAC GIS Platform',
    titleCN: 'ZODIAC 人畜共患病平台',
    description: 'Zoonotic Epidemiology GIS · IAEA/FAO 联合中心',
    folderName: '/Users/mayuetong/Desktop/life-os/APH-IAEA-GIS-Platform',
    gradient: 'from-lime-500 to-green-500',
    cardGradient: 'from-lime-500/[0.08] to-green-500/[0.08]',
    glowColor: 'group-hover:shadow-lime-500/20',
    deadline: 0.45,
    impact: 0.85,
    visa: 0.7,
    cost: 0.75,
    tasks: [
      '前端 UI 完善：地图查看器交互优化',
      'AI chatbox 帮助系统集成',
      '多国登录系统 OAuth2/SSO 对接',
      '将平台经历更新到简历 & 个人网站',
    ],
    completedTasks: [
      'IAEA/FAO 视觉识别系统全站应用',
      '白天/夜晚模式切换',
      '动态统计数据 + 地球仪背景动画',
      'GitHub Pages 前端部署（docs/）',
      'Request Access 注册表单',
    ],
    status: 'active',
    progress: 55,
    liveUrl: 'https://mayuetong.github.io/APH-IAEA-GIS-Platform',
    vaultPath: '/Users/mayuetong/Desktop/life-os/APH-IAEA-GIS-Platform/03_vault',
    readmePath: '/Users/mayuetong/Desktop/life-os/APH-IAEA-GIS-Platform/01_docs/README.md',
    startDate: '2026-04-28',
    lastUpdated: '2026-04-29',
    links: [
      { label: '前端平台', url: 'https://mayuetong.github.io/APH-IAEA-GIS-Platform', external: true },
      { label: 'GitHub', url: 'https://github.com/MaYuetong/APH-IAEA-GIS-Platform', external: true },
    ],
  },

  // ── 07 其他管理 ────────────────────────────────────────────────────
  {
    id: 'admin',
    slug: 'admin',
    icon: '⚙️',
    title: 'Life Admin',
    titleCN: '其他管理',
    description: '加拿大签证 · 爸妈签证 · G4 续签',
    folderName: '加拿大签证申请',
    gradient: 'from-slate-400 to-gray-500',
    cardGradient: 'from-slate-500/[0.08] to-gray-500/[0.08]',
    glowColor: 'group-hover:shadow-slate-500/20',
    deadline: 0.75,
    deadlineDate: '2026-06-01',
    deadlines: [
      { date: '2026-06-01', label: '加拿大签证材料提交截止' },
      { date: '2026-06-15', label: '爸妈签证跟进状态' },
    ],
    impact: 0.7,
    visa: 1.0,
    cost: 0.9,
    tasks: [
      '加拿大签证材料核对 (US Visa + Passport OK)',
      '爸妈签证：跟进状态 / 准备担保材料',
      'G4 签证续签确认',
      'Life OS 文件夹整理 · 每周备份',
    ],
    completedTasks: [
      '加拿大签证申请初步材料收集',
    ],
    status: 'active',
    progress: 35,
    vaultPath: '加拿大签证申请',
    startDate: '2026-04-20',
    lastUpdated: '2026-05-05',
    subFolders: ['爸妈签证'],
    links: [],
  },
]

export function getSectionBySlug(slug: string): Section | undefined {
  return sections.find((s) => s.slug === slug)
}
