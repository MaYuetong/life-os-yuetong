'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-8 h-8" />

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? '切换亮色模式' : '切换暗色模式'}
      className={cn(
        'relative flex items-center justify-center w-8 h-8 rounded-lg',
        'bg-white/[0.05] hover:bg-white/[0.1]',
        'border border-white/[0.08] hover:border-white/[0.14]',
        'text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))]',
        'transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50',
      )}
    >
      <Sun
        className={cn(
          'absolute w-4 h-4 transition-all duration-300',
          isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100',
        )}
      />
      <Moon
        className={cn(
          'absolute w-4 h-4 transition-all duration-300',
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50',
        )}
      />
    </button>
  )
}
