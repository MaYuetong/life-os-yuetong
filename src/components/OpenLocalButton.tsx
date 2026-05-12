'use client'

import { FolderOpen, FileText } from 'lucide-react'

interface Props {
  path: string
  label: string
  icon: 'folder' | 'file'
}

export function OpenLocalButton({ path, label, icon }: Props) {
  function open() {
    fetch(`/api/open?path=${encodeURIComponent(path)}`).catch(() => null)
  }

  return (
    <button
      onClick={open}
      className="flex items-center gap-1.5 px-3 py-1.5 border border-[rgb(var(--border))] text-[10px] font-semibold uppercase tracking-[0.08em] text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] hover:border-[rgb(var(--text))] transition-colors"
    >
      {icon === 'folder'
        ? <FolderOpen className="w-3 h-3" />
        : <FileText className="w-3 h-3" />}
      {label}
    </button>
  )
}
