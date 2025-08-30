export type Vendor = { id_number: string; name: string }
export type Rule = {
  id: string
  title: string
  notes?: string
  conditions?: string
  subcategory?: string
  tax_exceptions?: string
  keywords?: string[]
  taxability: 'taxable' | 'exempt' | 'conditional'
  vendors?: Vendor[]
}

export const TaxRule = {
  async list(): Promise<Rule[]> {
    await new Promise(r => setTimeout(r, 250))
    return [
      { id: '1', title: 'Software subscription', notes: 'SaaS typical', taxability: 'taxable', keywords: ['software','subscription'], vendors: [{ id_number:'VN-100', name:'Acme Cloud' }] },
      { id: '2', title: 'Professional services', notes: 'Consulting hours', taxability: 'exempt', keywords: ['service','consulting'], vendors: [{ id_number:'VN-200', name:'ProServe LLC' }] },
      { id: '3', title: 'Maintenance with parts', notes: 'Conditional per labor split', taxability: 'conditional', keywords: ['maintenance'], vendors: [{ id_number:'VN-300', name:'FixIt Inc.' }] },
    ]
  },
}
