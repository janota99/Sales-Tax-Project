'use client'
import { Button } from '@/components/ui/button'

export default function VendorManager({ rule, onClose, onSave }: any) {
  if (!rule) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg text-black">
        <h3 className="text-lg font-semibold mb-4">Manage Vendors for “{rule.title}”</h3>
        <p className="text-sm mb-4">Stub UI — replace with your real vendor manager later.</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onSave?.(); onClose?.(); }}>Save</Button>
        </div>
      </div>
    </div>
  )
}
