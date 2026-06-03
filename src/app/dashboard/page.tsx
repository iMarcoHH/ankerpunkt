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

  if (!data) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh'}}>
      <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:'12px',color:'#9AA0A6',letterSpacing:'0.2em'}}>LÄDT...</div>
    </div>
  )

  const budgetPct = data.budget > 0 ? Math.min(100, ((data.totalExpenses + data.totalInsurance) / data.budget) * 100) : 0

  return (
    <div style={{maxWidth:'900px'}}>
      {/* Header */}
      <div style={{marginBottom:'32px'}}>
        <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:'11px',color:'#C8392B',letterSpacing:'0.3em',textTransform:'uppercase',marginBottom:'6px'}}>// Ahoi {name}</div>
        <h1 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(2.5rem,5vw,3.5rem)',letterSpacing:'0.06em',color:'#0D1B2A',lineHeight:'1',marginBottom:'6px'}}>LAGEBERICHT</h1>
        <p style={{fontSize:'14px',color:'#9AA0A6',fontWeight:'300'}}>Dein Finanz-Überblick auf einen Blick.</p>
      </div>

      {/* Hero Netto Card */}
      <div style={{
        background:'#0D1B2A',borderRadius:'16px',padding:'32px 36px',marginBottom:'16px',
        borderLeft:'5px solid #C8392B',position:'relative',overflow:'hidden'
      }}>
        <div style={{position:'absolute',right:'-20px',top:'-20px',width:'160px',height:'160px',borderRadius:'50%',background:'rgba(200,57,43,0.08)'}}/>
        <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,0.3)',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'8px'}}>Netto / Monat</div>
        <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(3rem,7vw,5rem)',color: data.netto >= 0 ? 'white' : '#C8392B',letterSpacing:'0.04em',lineHeight:'1',marginBottom:'4px'}}>
          {data.netto >= 0 ? '+' : ''}{data.netto.toFixed(2)} €
        </div>
        <div style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',fontWeight:'300'}}>
          {data.netto >= 0 ? 'Du bist im Plus. Weiter so.' : 'Achtung — du gibst mehr aus als du einnimmst.'}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'16px'}}>
        {[
          { label: 'Einnahmen', value: data.totalIncome, sign: '+', color: '#0D1B2A', accent: '#E8A832' },
          { label: 'Ausgaben', value: data.totalExpenses, sign: '-', color: '#0D1B2A', accent: '#C8392B' },
          { label: 'Versicherungen', value: data.totalInsurance, sign: '', color: '#0D1B2A', accent: '#9AA0A6' },
        ].map(card => (
          <div key={card.label} style={{
            background:'white',borderRadius:'12px',padding:'20px',
            borderTop:`3px solid ${card.accent}`,
            boxShadow:'0 1px 8px rgba(13,27,42,0.06)'
          }}>
            <div style={{fontSize:'10px',color:'#9AA0A6',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:'8px',fontFamily:'IBM Plex Mono,monospace'}}>{card.label}</div>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'1.8rem',color:card.color,letterSpacing:'0.04em',lineHeight:'1'}}>{card.sign}{card.value.toFixed(2)} €</div>
            <div style={{fontSize:'11px',color:'#9AA0A6',marginTop:'4px'}}>/&nbsp;Monat</div>
          </div>
        ))}
      </div>

      {/* Budget Bar */}
      {data.budget > 0 && (
        <div style={{background:'white',borderRadius:'12px',padding:'20px 24px',marginBottom:'16px',boxShadow:'0 1px 8px rgba(13,27,42,0.06)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
            <div style={{fontSize:'12px',fontWeight:'600',color:'#0D1B2A',letterSpacing:'0.04em'}}>Budget-Auslastung</div>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'1.4rem',color: budgetPct > 80 ? '#C8392B' : '#0D1B2A'}}>{budgetPct.toFixed(0)}%</div>
          </div>
          <div style={{height:'6px',background:'#E8DFD0',borderRadius:'3px',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${budgetPct}%`,background: budgetPct > 80 ? '#C8392B' : '#0D1B2A',borderRadius:'3px',transition:'width 0.6s ease'}}/>
          </div>
          <div style={{fontSize:'11px',color:'#9AA0A6',marginTop:'6px',fontFamily:'IBM Plex Mono,monospace'}}>
            {(data.totalExpenses + data.totalInsurance).toFixed(2)} € von {data.budget.toFixed(2)} € Budget
          </div>
        </div>
      )}

      {/* Sparziele */}
      {data.savings.length > 0 && (
        <div style={{background:'white',borderRadius:'12px',padding:'20px 24px',boxShadow:'0 1px 8px rgba(13,27,42,0.06)'}}>
          <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'1.3rem',letterSpacing:'0.08em',color:'#0D1B2A',marginBottom:'16px'}}>SPARZIELE</div>
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            {data.savings.map((goal: any) => {
              const pct = Math.min(100, (goal.current_amount / goal.target_amount) * 100)
              return (
                <div key={goal.id}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                    <span style={{fontSize:'13px',fontWeight:'500',color:'#0D1B2A'}}>{goal.name}</span>
                    <span style={{fontSize:'12px',color:'#9AA0A6',fontFamily:'IBM Plex Mono,monospace'}}>{goal.current_amount.toFixed(0)} / {goal.target_amount.toFixed(0)} €</span>
                  </div>
                  <div style={{height:'4px',background:'#E8DFD0',borderRadius:'2px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${pct}%`,background:'#C8392B',borderRadius:'2px'}}/>
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
