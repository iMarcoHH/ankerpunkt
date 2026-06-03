'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [name, setName] = useState('')

  useEffect(() => {
    async function load() {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (!user) return
      const [profile, income, expenses, insurances, savings] = await Promise.all([
        sb.from('profiles').select('*').eq('id', user.id).single(),
        sb.from('transactions').select('amount').eq('user_id', user.id).eq('type', 'income'),
        sb.from('transactions').select('amount').eq('user_id', user.id).eq('type', 'expense'),
        sb.from('insurances').select('amount,recurrence').eq('user_id', user.id),
        sb.from('savings_goals').select('*').eq('user_id', user.id),
      ])
      const totalIncome = (income.data || []).reduce((s: number, i: any) => s + i.amount, 0)
      const totalExpenses = (expenses.data || []).reduce((s: number, i: any) => s + i.amount, 0)
      const totalInsurance = (insurances.data || []).reduce((s: number, i: any) => s + (i.recurrence === 'monthly' ? i.amount : i.amount / 12), 0)
      setName(profile.data?.full_name?.split(' ')[0] || 'Kapitän')
      setData({ totalIncome, totalExpenses, totalInsurance, netto: totalIncome - totalExpenses - totalInsurance, savings: savings.data || [], budget: profile.data?.monthly_budget || 0 })
    }
    load()
  }, [])

  if (!data) return <div className="text-[#9AA0A6] p-6">Lädt...</div>

  const budgetPct = data.budget > 0 ? Math.min(100, ((data.totalExpenses + data.totalInsurance) / data.budget) * 100) : 0

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-mono-ak text-[#C8392B] tracking-widest uppercase mb-1">// Ahoi {name}</div>
        <h1 className="font-bebas text-4xl tracking-wider text-[#0D1B2A]">LAGEBERICHT</h1>
        <p className="text-sm text-[#9AA0A6] mt-1">Dein Finanz-Überblick auf einen Blick.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Einnahmen', value: data.totalIncome, color: '#0D1B2A', sign: '+' },
          { label: 'Ausgaben', value: data.totalExpenses, color: '#C8392B', sign: '-' },
          { label: 'Versicherungen', value: data.totalInsurance, color: '#9AA0A6', sign: '' },
          { label: 'Netto', value: data.netto, color: data.netto >= 0 ? '#0D1B2A' : '#C8392B', sign: data.netto >= 0 ? '+' : '' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-lg p-4 border border-[#E8DFD0] border-l-4" style={{borderLeftColor: card.color}}>
            <div className="text-xs text-[#9AA0A6] uppercase tracking-wider mb-1">{card.label}</div>
            <div className="font-bebas text-2xl" style={{color: card.color}}>{card.sign}{card.value.toFixed(2)} €</div>
            <div className="text-xs text-[#9AA0A6]">/ Monat</div>
          </div>
        ))}
      </div>
      {data.budget > 0 && (
        <div className="bg-white rounded-lg p-5 border border-[#E8DFD0] mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-[#0D1B2A]">Budget-Auslastung</div>
            <div className="text-sm text-[#9AA0A6]">{budgetPct.toFixed(0)}%</div>
          </div>
          <div className="h-2 bg-[#E8DFD0] rounded-full">
            <div className="h-full bg-[#C8392B] rounded-full transition-all" style={{width: budgetPct + '%'}}/>
          </div>
          <div className="text-xs text-[#9AA0A6] mt-1">{(data.totalExpenses + data.totalInsurance).toFixed(2)} € von {data.budget.toFixed(2)} € Budget</div>
        </div>
      )}
      {data.savings.length > 0 && (
        <div className="bg-white rounded-lg p-5 border border-[#E8DFD0]">
          <div className="font-bebas text-xl tracking-wider text-[#0D1B2A] mb-4">SPARZIELE</div>
          <div className="flex flex-col gap-3">
            {data.savings.map((goal: any) => {
              const pct = Math.min(100, (goal.current_amount / goal.target_amount) * 100)
              return (
                <div key={goal.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#0D1B2A]">{goal.name}</span>
                    <span className="text-[#9AA0A6]">{goal.current_amount.toFixed(0)} / {goal.target_amount.toFixed(0)} €</span>
                  </div>
                  <div className="h-1.5 bg-[#E8DFD0] rounded-full">
                    <div className="h-full bg-[#C8392B] rounded-full" style={{width: pct + '%'}}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
