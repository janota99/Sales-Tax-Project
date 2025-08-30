'use client'
import { type LucideIcon } from 'lucide-react'

export default function CategoryHeader({ title, description, icon: Icon, stats }:
  { title: string; description?: string; icon?: LucideIcon; stats?: any }) {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto p-6 flex items-center gap-4">
        {Icon ? <Icon className="w-6 h-6" /> : null}
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && <p className="text-sm opacity-70">{description}</p>}
          {stats && <p className="text-xs opacity-60 mt-1">Total: {stats.total} • Taxable: {stats.taxable} • Exempt: {stats.exempt} • Conditional: {stats.conditional}</p>}
        </div>
      </div>
    </header>
  )
}
