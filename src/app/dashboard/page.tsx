'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [name, setName] = useState('')
  const [recentIncome, setRecentIncome] = useState<any[]>([])
  const [recentExpenses, setRecentExpenses] = useState<any[]>([])
  const [recentInsurance, setRecentInsurance] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (!user) return
      const [profile, income, expenses, insurances, savings, lastIncome, lastExpenses, lastInsurance] = await Promise.all([
        sb.from('profiles').select('*').eq('id', user.id).single(),
        sb.from('transactions').select('amount').eq('user_id', user.id).eq('type', 'income'),
        sb.from('transactions').select('amount').eq('user_id', user.id).eq('type', 'expense'),
        sb.from('insurances').select('amount,recurrence').eq('user_id', user.id),
        sb.from('savings_goals').select('*').eq('user_id', user.id),
        sb.from('transactions').select('*').eq('user_id', user.id).eq('type', 'income').order('date', {ascending:false}).limit(3),
        sb.from('transactions').select('*').eq('user_id', user.id).eq('type', 'expense').order('date', {ascending:false}).limit(3),
        sb.from('insurances').select('*').eq('user_id', user.id).order('created_at', {ascending:false}).limit(3),
      ])
      const totalIncome = (income.data || []).reduce((s: number, i: any) => s + i.amount, 0)
      const totalExpenses = (expenses.data || []).reduce((s: number, i: any) => s + i.amount, 0)
      const totalInsurance = (insurances.data || []).reduce((s: number, i: any) => s + (i.recurrence === 'monthly' ? i.amount : i.amount / 12), 0)
      setName(profile.data?.full_name?.split(' ')[0] || 'Kapitän')
      setRecentIncome(lastIncome.data || [])
      setRecentExpenses(lastExpenses.data || [])
      setRecentInsurance(lastInsurance.data || [])
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
    <div style={{maxWidth:'960px'}}>
      {/* Header */}
      <div style={{marginBottom:'28px'}}>
        <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:'11px',color:'#C8392B',letterSpacing:'0.3em',textTransform:'uppercase',marginBottom:'6px'}}>// Ahoi {name}</div>
        <h1 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(2.5rem,5vw,3.5rem)',letterSpacing:'0.06em',color:'#0D1B2A',lineHeight:'1',marginBottom:'4px'}}>LAGEBERICHT</h1>
        <p style={{fontSize:'13px',color:'#9AA0A6',fontWeight:'300'}}>Dein Finanz-Überblick auf einen Blick.</p>
      </div>

      {/* Hero Netto */}
      <div style={{background:'#0D1B2A',borderRadius:'16px',padding:'28px 32px',marginBottom:'14px',borderLeft:'5px solid #C8392B',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',right:'-20px',top:'-20px',width:'160px',height:'160px',borderRadius:'50%',background:'rgba(200,57,43,0.08)'}}/>
        <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:'10px',color:'rgba(255,255,255,0.3)',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'6px'}}>Netto / Monat</div>
        <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(2.8rem,6vw,4.5rem)',color: data.netto >= 0 ? 'white' : '#C8392B',letterSpacing:'0.04em',lineHeight:'1',marginBottom:'4px'}}>
          {data.netto >= 0 ? '+' : ''}{data.netto.toFixed(2)} €
        </div>
        <div style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',fontWeight:'300'}}>
          {data.netto >= 0 ? 'Du bist im Plus. Weiter so.' : 'Achtung — du gibst mehr aus als du einnimmst.'}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'14px'}}>
        {[
          { label:'Einnahmen', value:data.totalIncome, sign:'+', accent:'#E8A832', href:'/dashboard/einnahmen' },
          { label:'Ausgaben', value:data.totalExpenses, sign:'-', accent:'#C8392B', href:'/dashboard/ausgaben' },
          { label:'Versicherungen', value:data.totalInsurance, sign:'', accent:'#9AA0A6', href:'/dashboard/versicherungen' },
        ].map(card => (
          <a key={card.label} href={card.href} style={{
            background:'white',borderRadius:'12px',padding:'18px 20px',
            borderTop:`3px solid ${card.accent}`,
            boxShadow:'0 1px 8px rgba(13,27,42,0.06)',
            textDecoration:'none',display:'block',transition:'transform 0.15s',cursor:'pointer'
          }}>
            <div style={{fontSize:'10px',color:'#9AA0A6',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:'6px',fontFamily:'IBM Plex Mono,monospace'}}>{card.label}</div>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'1.7rem',color:'#0D1B2A',letterSpacing:'0.04em',lineHeight:'1'}}>{card.sign}{card.value.toFixed(2)} €</div>
            <div style={{fontSize:'10px',color:'#9AA0A6',marginTop:'3px'}}>/&nbsp;Monat</div>
          </a>
        ))}
      </div>

      {/* Budget Bar */}
      {data.budget > 0 && (
        <div style={{background:'white',borderRadius:'12px',padding:'18px 22px',marginBottom:'14px',boxShadow:'0 1px 8px rgba(13,27,42,0.06)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
            <div style={{fontSize:'12px',fontWeight:'600',color:'#0D1B2A'}}>Budget-Auslastung</div>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'1.3rem',color: budgetPct > 80 ? '#C8392B' : '#0D1B2A'}}>{budgetPct.toFixed(0)}%</div>
          </div>
          <div style={{height:'5px',background:'#E8DFD0',borderRadius:'3px',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${budgetPct}%`,background: budgetPct > 80 ? '#C8392B' : '#0D1B2A',borderRadius:'3px'}}/>
          </div>
          <div style={{fontSize:'11px',color:'#9AA0A6',marginTop:'5px',fontFamily:'IBM Plex Mono,monospace'}}>
            {(data.totalExpenses + data.totalInsurance).toFixed(2)} € von {data.budget.toFixed(2)} € Budget
          </div>
        </div>
      )}

      {/* Recent Transactions Row */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'14px'}}>
        
        {/* Letzte Einnahmen */}
        <div style={{background:'white',borderRadius:'12px',padding:'18px',boxShadow:'0 1px 8px rgba(13,27,42,0.06)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'1rem',letterSpacing:'0.08em',color:'#0D1B2A'}}>EINNAHMEN</div>
            <a href="/dashboard/einnahmen" style={{fontSize:'10px',color:'#C8392B',textDecoration:'none',fontFamily:'IBM Plex Mono,monospace'}}>alle →</a>
          </div>
          {recentIncome.length === 0 ? (
            <div style={{fontSize:'12px',color:'#9AA0A6',fontStyle:'italic'}}>Keine Einnahmen</div>
          ) : recentIncome.map((item:any) => (
            <div key={item.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid #F4F2EE'}}>
              <div>
                <div style={{fontSize:'12px',fontWeight:'500',color:'#0D1B2A'}}>{item.description || item.category}</div>
                <div style={{fontSize:'10px',color:'#9AA0A6'}}>{item.date}</div>
              </div>
              <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'1rem',color:'#0D1B2A'}}>+{item.amount}€</div>
            </div>
          ))}
        </div>

        {/* Letzte Ausgaben */}
        <div style={{background:'white',borderRadius:'12px',padding:'18px',boxShadow:'0 1px 8px rgba(13,27,42,0.06)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'1rem',letterSpacing:'0.08em',color:'#0D1B2A'}}>AUSGABEN</div>
            <a href="/dashboard/ausgaben" style={{fontSize:'10px',color:'#C8392B',textDecoration:'none',fontFamily:'IBM Plex Mono,monospace'}}>alle →</a>
          </div>
          {recentExpenses.length === 0 ? (
            <div style={{fontSize:'12px',color:'#9AA0A6',fontStyle:'italic'}}>Keine Ausgaben</div>
          ) : recentExpenses.map((item:any) => (
            <div key={item.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid #F4F2EE'}}>
              <div>
                <div style={{fontSize:'12px',fontWeight:'500',color:'#0D1B2A'}}>{item.description || item.category}</div>
                <div style={{fontSize:'10px',color:'#9AA0A6'}}>{item.date}</div>
              </div>
              <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'1rem',color:'#C8392B'}}>-{item.amount}€</div>
            </div>
          ))}
        </div>

        {/* Letzte Versicherungen */}
        <div style={{background:'white',borderRadius:'12px',padding:'18px',boxShadow:'0 1px 8px rgba(13,27,42,0.06)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'1rem',letterSpacing:'0.08em',color:'#0D1B2A'}}>VERSICHERUNGEN</div>
            <a href="/dashboard/versicherungen" style={{fontSize:'10px',color:'#C8392B',textDecoration:'none',fontFamily:'IBM Plex Mono,monospace'}}>alle →</a>
          </div>
          {recentInsurance.length === 0 ? (
            <div style={{fontSize:'12px',color:'#9AA0A6',fontStyle:'italic'}}>Keine Einträge</div>
          ) : recentInsurance.map((item:any) => (
            <div key={item.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid #F4F2EE'}}>
              <div>
                <div style={{fontSize:'12px',fontWeight:'500',color:'#0D1B2A'}}>{item.name}</div>
                <div style={{fontSize:'10px',color:'#9AA0A6'}}>{item.recurrence === 'monthly' ? 'monatlich' : 'jährlich'}</div>
              </div>
              <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'1rem',color:'#9AA0A6'}}>{item.amount}€</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sparziele */}
      {data.savings.length > 0 && (
        <div style={{background:'white',borderRadius:'12px',padding:'18px 22px',boxShadow:'0 1px 8px rgba(13,27,42,0.06)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}}>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'1rem',letterSpacing:'0.08em',color:'#0D1B2A'}}>SPARZIELE</div>
            <a href="/dashboard/sparziele" style={{fontSize:'10px',color:'#C8392B',textDecoration:'none',fontFamily:'IBM Plex Mono,monospace'}}>alle →</a>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {data.savings.map((goal: any) => {
              const pct = Math.min(100, (goal.current_amount / goal.target_amount) * 100)
              return (
                <div key={goal.id}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}>
                    <span style={{fontSize:'13px',fontWeight:'500',color:'#0D1B2A'}}>{goal.name}</span>
                    <span style={{fontSize:'11px',color:'#9AA0A6',fontFamily:'IBM Plex Mono,monospace'}}>{goal.current_amount.toFixed(0)} / {goal.target_amount.toFixed(0)} €</span>
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
