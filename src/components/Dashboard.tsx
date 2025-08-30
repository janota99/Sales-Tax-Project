'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

import SearchBar from '@/components/search/SearchBar'
import TaxRuleCard from '@/components/tax/TaxRuleCard'
import CategoryHeader from '@/components/tax/CategoryHeader'
import VendorManager from '@/components/vendor/VendorManager'

import { TaxRule } from '@/entities/TaxRule'
import { User } from '@/entities/User'

export default function DashboardView() {
  const [rules, setRules] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [searchMode, setSearchMode] = useState<'rule' | 'vendor'>('rule')
  const [taxabilityFilter, setTaxabilityFilter] =
    useState<'all' | 'taxable' | 'exempt' | 'conditional'>('all')
  const [editingVendorsForRule, setEditingVendorsForRule] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => { loadRules(); loadUser() }, [])

  const loadRules = async () => {
    setIsLoading(true)
    try { setRules(await TaxRule.list()) }
    catch (e) { console.error('Error loading tax rules:', e) }
    finally { setIsLoading(false) }
  }

  const loadUser = async () => {
    try { setCurrentUser(await User.me()) }
    catch (e) { console.error('Error loading user:', e) }
  }

  const filteredRules = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    const filtered = rules.filter((r: any) => {
      const taxabilityMatch = taxabilityFilter === 'all' || r.taxability === taxabilityFilter
      if (!taxabilityMatch) return false
      if (!q) return true
      if (searchMode === 'rule') {
        return (
          r.title?.toLowerCase().includes(q) ||
          r.notes?.toLowerCase().includes(q) ||
          r.conditions?.toLowerCase().includes(q) ||
          r.subcategory?.toLowerCase().includes(q) ||
          r.tax_exceptions?.toLowerCase().includes(q) ||
          r.keywords?.some((k: string) => k.toLowerCase().includes(q))
        )
      } else {
        return r.vendors?.some((v: any) =>
          v.name.toLowerCase().includes(q) || v.id_number.toLowerCase().includes(q)
        )
      }
    })
    if (!q || searchMode !== 'rule') return filtered
    const t = (s?: string) => s?.toLowerCase().includes(q)
    const k = (arr?: string[]) => arr?.some(x => x.toLowerCase().includes(q))
    return filtered.sort((a: any, b: any) => {
      const aT = t(a.title), bT = t(b.title)
      const aK = k(a.keywords), bK = k(b.keywords)
      if (aT && !bT) return -1
      if (!aT && bT) return 1
      if (aK && !bK) return -1
      if (!aK && bK) return 1
      return 0
    })
  }, [rules, searchQuery, searchMode, taxabilityFilter])

  const stats = useMemo(() => {
    const total = rules.length
    const exempt = rules.filter((r: any) => r.taxability === 'exempt').length
    const taxable = rules.filter((r: any) => r.taxability === 'taxable').length
    const conditional = rules.filter((r: any) => r.taxability === 'conditional').length
    return { total, exempt, taxable, conditional }
  }, [rules])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <CategoryHeader title="Search Tax Rules" description="Find taxability information across all categories" icon={Search} />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-slate-200 rounded-xl" />
              <div className="grid gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-32 bg-slate-200 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleManageVendors = (rule: any) => setEditingVendorsForRule(rule)
  const handleVendorSave = () => { setEditingVendorsForRule(null); loadRules() }
  const handleRefreshComplete = () => { loadRules() }

  return (
    <div className="min-h-screen bg-slate-50">
      <CategoryHeader
        title="Search Tax Rules"
        description="Find taxability information across all categories"
        icon={Search}
        stats={stats}
      />

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 space-y-6">
            <Tabs value={searchMode} onValueChange={(v: any) => setSearchMode(v)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="rule">Search by Rule</TabsTrigger>
                <TabsTrigger value="vendor">Search by Vendor</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="max-w-2xl mx-auto">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder={searchMode === 'rule'
                  ? 'Search for any transaction type, item, service, or keyword...'
                  : 'Search by vendor name or ID...'}
              />
              {searchMode === 'rule' && (
                <div className="text-xs text-slate-500 mt-2 text-center">
                  <p>Search includes rule titles, descriptions, conditions, subcategories, and keywords for comprehensive results.</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Filter className="w-4 h-4" />
                <span>Filter by:</span>
              </div>
              <div className="flex gap-2">
                <Button variant={taxabilityFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setTaxabilityFilter('all')}>All</Button>
                <Button variant={taxabilityFilter === 'taxable' ? 'default' : 'outline'} size="sm" onClick={() => setTaxabilityFilter('taxable')} className={taxabilityFilter === 'taxable' ? 'bg-rose-600 hover:bg-rose-700' : 'text-rose-600 hover:bg-rose-50'}>Taxable</Button>
                <Button variant={taxabilityFilter === 'exempt' ? 'default' : 'outline'} size="sm" onClick={() => setTaxabilityFilter('exempt')} className={taxabilityFilter === 'exempt' ? 'bg-emerald-600 hover:bg-emerald-700' : 'text-emerald-600 hover:bg-emerald-50'}>Exempt</Button>
                <Button variant={taxabilityFilter === 'conditional' ? 'default' : 'outline'} size="sm" onClick={() => setTaxabilityFilter('conditional')} className={taxabilityFilter === 'conditional' ? 'bg-amber-600 hover:bg-amber-700' : 'text-amber-600 hover:bg-amber-50'}>Conditional</Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Results</h2>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
              {filteredRules.length} {filteredRules.length === 1 ? 'rule' : 'rules'} found
            </span>
          </div>

          <div className="grid gap-4">
            {filteredRules.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No results found</h3>
                <p className="text-slate-500">Try a different search term or adjust your filters.</p>
              </div>
            ) : (
              filteredRules.map((rule: any) => (
                <TaxRuleCard
                  key={rule.id}
                  rule={rule}
                  searchQuery={searchQuery}
                  onManageVendors={handleManageVendors}
                  onRefreshComplete={handleRefreshComplete}
                  currentUser={currentUser}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {editingVendorsForRule && (
        <VendorManager rule={editingVendorsForRule} onClose={() => setEditingVendorsForRule(null)} onSave={handleVendorSave} />
      )}
    </div>
  )
}
