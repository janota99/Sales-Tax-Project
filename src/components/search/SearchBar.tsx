'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'

export default function SearchBar({
  onSearch, placeholder,
}: { onSearch: (q: string) => void; placeholder?: string }) {
  const [q, setQ] = useState('')
  return (
    <div className="flex gap-2">
      <Input
        value={q}
        onChange={(e) => { const v = e.target.value; setQ(v); onSearch(v) }}
        placeholder={placeholder}
      />
    </div>
  )
}
