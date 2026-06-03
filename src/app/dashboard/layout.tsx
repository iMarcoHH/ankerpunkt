'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const nav = [
  { href: '/dashboard', icon: '⚓', label: 'Lagebericht' },
  { href: '/dashboard/einnahmen', icon: '↑', label: 'Einnahmen' },
  { href: '/dashboard/ausgaben', icon: '↓', label: 'Ausgaben' },
  { href: '/dashboard/versicherungen', icon: '🛡', label: 'Versicherungen' },
  { href: '/dashboard/sparziele', icon: '🎯', label: 'Sparziele' },
  { href: '/dashboard/notizen', icon: '📝', label: 'Notizen' },
  { href: '/dashboard/rechner', icon: '🧮', label: 'Rechner' },
  { href: '/dashboard/lexikon', icon: '📖', label: 'Lexikon' },
]

function AnchorIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="10" r="5" stroke="#C8392B" strokeWidth="2.5" fill="none"/>
      <circle cx="26" cy="10" r="2" fill="#C8392B"/>
      <line x1="26" y1="15" x2="26" y2="44" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="12" y1="24" x2="40" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M12 24 Q8 32 12 36 Q17 40 26 42 Q35 40 40 36 Q44 32 40 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="12" cy="36" r="3" fill="#C8392B"/>
      <circle cx="40" cy="36" r="3" fill="#C8392B"/>
    </svg>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      const { data } = await sb.from('profiles').select('full_name,onboarding_completed').eq('id', session.user.id).single()
      if (data && !data.onboarding_completed) { router.push('/onboarding'); return }
      setUserName(data?.full_name?.split(' ')[0] || 'Kapitän')
      setLoading(false)
    })
  }, [router])

  async function logout() {
    const sb = createClient()
    await sb.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#0D1B2A',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{color:'white',fontFamily:'Bebas Neue,sans-serif',fontSize:'24px',letterSpacing:'0.1em'}}>ANKERPUNKT LÄDT...</div>
    </div>
  )

  return (
    <div style={{display:'flex',height:'100vh',background:'#F4F2EE',overflow:'hidden'}}>
      <aside style={{width: collapsed ? '64px' : '220px', background:'#0D1B2A', display:'flex', flexDirection:'column', borderRight:'3px solid #C8392B', transition:'width 0.2s', flexShrink:0, position:'relative'}}>
        <div style={{height:'64px',display:'flex',alignItems:'center',padding: collapsed ? '0 18px' : '0 20px',borderBottom:'1px solid rgba(255,255,255,0.08)',gap:'10px'}}>
          <AnchorIcon />
          {!collapsed && <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'18px',letterSpacing:'0.12em',color:'white'}}>ANKERPUNKT</span>}
        </div>
        <nav style={{flex:1,padding:'12px 8px',overflowY:'auto'}}>
          {nav.map(item => {
            const active = pathname === item.href
            return (
              <a key={item.href} href={item.href} style={{
                display:'flex', alignItems:'center', gap:'10px',
                padding: collapsed ? '10px 18px' : '10px 12px',
                borderRadius:'8px', marginBottom:'2px',
                background: active ? '#C8392B' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.45)',
                textDecoration:'none', fontSize:'13px', fontWeight: active ? '600' : '400',
                transition:'all 0.15s',
                justifyContent: collapsed ? 'center' : 'flex-start'
              }}>
                <span style={{fontSize:'16px',flexShrink:0}}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </a>
            )
          })}
        </nav>
        <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',padding:'12px 8px'}}>
          {!collapsed && (
            <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 12px',marginBottom:'4px'}}>
              <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#C8392B',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:'700',fontSize:'14px',flexShrink:0}}>{userName[0]?.toUpperCase()}</div>
              <span style={{color:'rgba(255,255,255,0.7)',fontSize:'13px',fontWeight:'500'}}>{userName}</span>
            </div>
          )}
          <a href="/dashboard/profil" style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 12px',borderRadius:'6px',color:'rgba(255,255,255,0.35)',textDecoration:'none',fontSize:'12px',justifyContent: collapsed ? 'center' : 'flex-start'}}>
            <span>👤</span>{!collapsed && 'Profil'}
          </a>
          <button onClick={logout} style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'8px 12px',borderRadius:'6px',color:'rgba(255,255,255,0.35)',background:'none',border:'none',cursor:'pointer',fontSize:'12px',justifyContent: collapsed ? 'center' : 'flex-start'}}>
            <span>↩</span>{!collapsed && 'Abmelden'}
          </button>
        </div>
        <button onClick={() => setCollapsed(c => !c)} style={{position:'absolute',right:'-12px',top:'50%',transform:'translateY(-50%)',width:'24px',height:'24px',borderRadius:'50%',background:'#C8392B',border:'none',color:'white',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',zIndex:10}}>
          {collapsed ? '›' : '‹'}
        </button>
      </aside>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{height:'56px',background:'white',borderBottom:'1px solid #E8DFD0',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',flexShrink:0}}>
          <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:'11px',color:'#C8392B',letterSpacing:'0.2em',textTransform:'uppercase'}}>
            // {nav.find(n => n.href === pathname)?.label || 'Dashboard'}
          </div>
          <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:'11px',color:'#9AA0A6'}}>
            {new Date().toLocaleDateString('de-DE',{day:'2-digit',month:'short',year:'numeric'})}
          </div>
        </div>
        <main style={{flex:1,overflowY:'auto',padding:'32px 28px'}}>
          {children}
        </main>
      </div>
    </div>
  )
}
