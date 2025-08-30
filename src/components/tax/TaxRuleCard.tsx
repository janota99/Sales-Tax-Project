'use client'
import { Button } from '@/components/ui/button'

export default function TaxRuleCard({ rule, onManageVendors }: any) {
  return (
    <div className="rounded-xl border p-4 bg-white flex justify-between">
      <div>
        <div className="font-medium">{rule.title}</div>
        {rule.notes && <div className="text-sm opacity-70">{rule.notes}</div>}
        <div className="text-xs mt-1">Taxability: {rule.taxability}</div>
      </div>
      <Button variant="outline" onClick={() => onManageVendors(rule)}>Manage vendors</Button>
    </div>
  )
}
