'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [name, setName] = useState('')
  const [recentIncome, setRecentIncome] = useState<any[]>([])
  const [recentExpenses, setRecentExpenses] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (!user) return
      const [profile, income, expenses, insurances, savings, lastIncome, lastExpenses] = await Promise.all([
        sb.from('profiles').select('*').eq('id', user.id).single(),
        sb.from('transactions').select('amount').eq('user_id', user.id).eq('type', 'income'),
        sb.from('transactions').select('amount').eq('user_id', user.id).eq('type', 'expense'),
        sb.from('insurances').select('amount,recurrence').eq('user_id', user.id),
        sb.from('savings_goals').select('*').eq('user_id', user.id),
        sb.from('transactions').select('*').eq('user_id', user.id).eq('type', 'income').order('date', {ascending:false}).limit(3),
        sb.from('transactions').select('*').eq('user_id', user.id).eq('type', 'expense').order('date', {ascending:false}).limit(3),
      ])
      const totalIncome = (income.data || []).reduce((s: number, i: any) => s + i.amount, 0)
      const totalExpenses = (expenses.data || []).reduce((s: number, i: any) => s + i.amount, 0)
      const totalInsurance = (insurances.data || []).reduce((s: number, i: any) => s + (i.recurrence === 'monthly' ? i.amount : i.amount / 12), 0)
      setName(profile.data?.full_name?.split(' ')[0] || 'Kapitän')
      setRecentIncome(lastIncome.data || [])
      setRecentExpenses(lastExpenses.data || [])
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
  const today = new Date().toLocaleDateString('de-DE', {weekday:'long', day:'numeric', month:'long'})

  return (
    <div style={{maxWidth:'680px',margin:'0 auto'}}>
      
      {/* Greeting */}
      <div style={{marginBottom:'24px'}}>
        <div style={{fontSize:'13px',color:'#9AA0A6',marginBottom:'2px'}}>{today}</div>
        <h1 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'2rem',letterSpacing:'0.06em',color:'#0D1B2A',lineHeight:'1'}}>AHOI, {name.toUpperCase()} 👋</h1>
      </div>

      {/* Main Balance Card */}
      <div style={{
        background:'linear-gradient(135deg, #0D1B2A 0%, #1a2d42 100%)',
        borderRadius:'24px',padding:'28px',marginBottom:'16px',
        position:'relative',overflow:'hidden',
        boxShadow:'0 20px 60px rgba(13,27,42,0.3)'
      }}>
        {/* Decorative circles */}
        <div style={{position:'absolute',right:'-30px',top:'-30px',width:'160px',height:'160px',borderRadius:'50%',background:'rgba(200,57,43,0.12)',border:'1px solid rgba(200,57,43,0.15)'}}/>
        <div style={{position:'absolute',right:'20px',top:'20px',width:'80px',height:'80px',borderRadius:'50%',background:'rgba(200,57,43,0.08)'}}/>
        
        <div style={{position:'relative',zIndex:1}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'20px'}}>
            <div>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:'4px',fontFamily:'IBM Plex Mono,monospace'}}>Netto / Monat</div>
              <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(2.5rem,7vw,3.5rem)',color:'white',letterSpacing:'0.04em',lineHeight:'1'}}>
                {data.netto >= 0 ? '+' : ''}{data.netto.toLocaleString('de-DE', {minimumFractionDigits:2,maximumFractionDigits:2})} €
              </div>
            </div>
            <div style={{background:'rgba(200,57,43,0.2)',borderRadius:'12px',padding:'8px 12px',border:'1px solid rgba(200,57,43,0.3)'}}>
              <div style={{fontSize:'10px',color:'rgba(255,255,255,0.5)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'2px'}}>Status</div>
              <div style={{fontSize:'12px',color: data.netto >= 0 ? '#4ade80' : '#C8392B',fontWeight:'600'}}>{data.netto >= 0 ? '✓ Im Plus' : '↓ Minus'}</div>
            </div>
          </div>

          {/* Budget Progress */}
          {data.budget > 0 && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>Budget-Auslastung</div>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.6)',fontFamily:'IBM Plex Mono,monospace'}}>{budgetPct.toFixed(0)}% von {data.budget.toLocaleString('de-DE')} €</div>
              </div>
              <div style={{height:'6px',background:'rgba(255,255,255,0.1)',borderRadius:'3px',overflow:'hidden'}}>
                <div style={{height:'100%',width:`${budgetPct}%`,background: budgetPct > 80 ? '#C8392B' : 'linear-gradient(90deg,#C8392B,#E8A832)',borderRadius:'3px',transition:'width 0.8s ease'}}/>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'20px'}}>
        {[
          { label:'Einnahmen', value:data.totalIncome, color:'#22c55e', bg:'rgba(34,197,94,0.08)', icon:'↑', href:'/dashboard/einnahmen' },
          { label:'Ausgaben', value:data.totalExpenses, color:'#C8392B', bg:'rgba(200,57,43,0.08)', icon:'↓', href:'/dashboard/ausgaben' },
          { label:'Versicherung', value:data.totalInsurance, color:'#9AA0A6', bg:'rgba(154,160,166,0.08)', icon:'🛡', href:'/dashboard/versicherungen' },
        ].map(s => (
          <a key={s.label} href={s.href} style={{background:'white',borderRadius:'16px',padding:'16px',textDecoration:'none',boxShadow:'0 2px 12px rgba(13,27,42,0.06)',border:'1px solid rgba(13,27,42,0.04)'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px'}}>
              <div style={{width:'32px',height:'32px',borderRadius:'10px',background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',color:s.color,fontWeight:'700'}}>{s.icon}</div>
            </div>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'1.3rem',color:'#0D1B2A',letterSpacing:'0.04em',lineHeight:'1',marginBottom:'2px'}}>{s.value.toLocaleString('de-DE',{minimumFractionDigits:0,maximumFractionDigits:0})} €</div>
            <div style={{fontSize:'10px',color:'#9AA0A6',letterSpacing:'0.06em'}}>{s.label}</div>
          </a>
        ))}
      </div>

      {/* Recent Transactions */}
      <div style={{background:'white',borderRadius:'20px',padding:'20px',marginBottom:'16px',boxShadow:'0 2px 12px rgba(13,27,42,0.06)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
          <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'1.1rem',letterSpacing:'0.08em',color:'#0D1B2A'}}>LETZTE TRANSAKTIONEN</div>
          <a href="/dashboard/einnahmen" style={{fontSize:'11px',color:'#C8392B',textDecoration:'none',fontWeight:'500'}}>Alle →</a>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'2px'}}>
          {[...recentIncome.map(i => ({...i, _type:'income'})), ...recentExpenses.map(i => ({...i, _type:'expense'}))].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0,5).map((item:any) => (
            <div key={item.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 8px',borderRadius:'10px',transition:'background 0.1s'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'10px',background: item._type === 'income' ? 'rgba(34,197,94,0.1)' : 'rgba(200,57,43,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>
                {item._type === 'income' ? '↑' : '↓'}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:'13px',fontWeight:'500',color:'#0D1B2A',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.description || item.category}</div>
                <div style={{fontSize:'11px',color:'#9AA0A6'}}>{item.category} · {item.date}</div>
              </div>
              <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'1rem',color: item._type === 'income' ? '#22c55e' : '#C8392B',flexShrink:0}}>
                {item._type === 'income' ? '+' : '-'}{item.amount} €
              </div>
            </div>
          ))}
          {recentIncome.length === 0 && recentExpenses.length === 0 && (
            <div style={{textAlign:'center',padding:'20px',color:'#9AA0A6',fontSize:'13px'}}>Noch keine Transaktionen</div>
          )}
        </div>
      </div>

      {/* Savings Goals */}
      {data.savings.length > 0 && (
        <div style={{background:'white',borderRadius:'20px',padding:'20px',boxShadow:'0 2px 12px rgba(13,27,42,0.06)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
            <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'1.1rem',letterSpacing:'0.08em',color:'#0D1B2A'}}>SPARZIELE</div>
            <a href="/dashboard/sparziele" style={{fontSize:'11px',color:'#C8392B',textDecoration:'none',fontWeight:'500'}}>Alle →</a>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            {data.savings.slice(0,3).map((goal:any) => {
              const pct = Math.min(100, (goal.current_amount / goal.target_amount) * 100)
              return (
                <div key={goal.id}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                    <div style={{fontSize:'13px',fontWeight:'500',color:'#0D1B2A'}}>{goal.name}</div>
                    <div style={{fontSize:'12px',color:'#9AA0A6',fontFamily:'IBM Plex Mono,monospace'}}>{pct.toFixed(0)}%</div>
                  </div>
                  <div style={{height:'6px',background:'#F4F2EE',borderRadius:'3px',overflow:'hidden',marginBottom:'4px'}}>
                    <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#C8392B,#E8A832)',borderRadius:'3px'}}/>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div style={{fontSize:'11px',color:'#9AA0A6'}}>{goal.current_amount.toLocaleString('de-DE')} € gespart</div>
                    <div style={{fontSize:'11px',color:'#9AA0A6'}}>Ziel: {goal.target_amount.toLocaleString('de-DE')} €</div>
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
