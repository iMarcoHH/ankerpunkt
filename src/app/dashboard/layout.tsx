'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const nav = [
  { href: '/dashboard', icon: '⊞', label: 'Start' },
  { href: '/dashboard/einnahmen', icon: '↑', label: 'Einnahmen' },
  { href: '/dashboard/ausgaben', icon: '↓', label: 'Ausgaben' },
  { href: '/dashboard/sparziele', icon: '◎', label: 'Sparziele' },
  { href: '/dashboard/more', icon: '⋯', label: 'Mehr' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const [showMore, setShowMore] = useState(false)

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

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#0D1B2A',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{color:'white',fontFamily:'Bebas Neue,sans-serif',fontSize:'24px',letterSpacing:'0.1em'}}>⚓ ANKERPUNKT</div>
    </div>
  )

  const moreItems = [
    { href: '/dashboard/versicherungen', icon: '🛡', label: 'Versicherungen' },
    { href: '/dashboard/notizen', icon: '📝', label: 'Notizen' },
    { href: '/dashboard/rechner', icon: '🧮', label: 'Rechner' },
    { href: '/dashboard/lexikon', icon: '📖', label: 'Lexikon' },
    { href: '/dashboard/news', icon: '📰', label: 'News' },
    { href: '/dashboard/profil', icon: '👤', label: 'Profil' },
  ]

  return (
    <div style={{minHeight:'100vh',background:'#0D1B2A',color:'white',fontFamily:'IBM Plex Sans,sans-serif'}}>
      
      {/* Top Bar */}
      <div style={{position:'fixed',top:0,left:0,right:0,zIndex:100,padding:'16px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'linear-gradient(to bottom, #0D1B2A 60%, transparent)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <svg width="24" height="24" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="10" r="5" stroke="#C8392B" strokeWidth="2.5" fill="none"/>
            <circle cx="26" cy="10" r="2" fill="#C8392B"/>
            <line x1="26" y1="15" x2="26" y2="44" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="12" y1="24" x2="40" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M12 24 Q8 32 12 36 Q17 40 26 42 Q35 40 40 36 Q44 32 40 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="12" cy="36" r="3" fill="#C8392B"/>
            <circle cx="40" cy="36" r="3" fill="#C8392B"/>
          </svg>
          <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'16px',letterSpacing:'0.12em'}}>ANKERPUNKT</span>
        </div>
        <a href="/dashboard/profil" style={{width:'36px',height:'36px',borderRadius:'50%',background:'#C8392B',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:'700',fontSize:'14px',textDecoration:'none'}}>
          {userName[0]?.toUpperCase()}
        </a>
      </div>

      {/* Main Content */}
      <main style={{paddingTop:'72px',paddingBottom:'100px',minHeight:'100vh'}}>
        {children}
      </main>

      {/* More Overlay */}
      {showMore && (
        <>
          <div onClick={() => setShowMore(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:200,backdropFilter:'blur(8px)'}}/>
          <div style={{position:'fixed',bottom:'90px',left:'16px',right:'16px',background:'#1a2d42',borderRadius:'24px',padding:'20px',zIndex:201,border:'1px solid rgba(255,255,255,0.08)'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
              {moreItems.map(item => (
                <a key={item.href} href={item.href} onClick={() => setShowMore(false)} style={{
                  display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',
                  padding:'16px 8px',borderRadius:'16px',textDecoration:'none',
                  background: pathname === item.href ? 'rgba(200,57,43,0.2)' : 'rgba(255,255,255,0.04)',
                  border: pathname === item.href ? '1px solid rgba(200,57,43,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  transition:'all 0.15s'
                }}>
                  <span style={{fontSize:'24px'}}>{item.icon}</span>
                  <span style={{fontSize:'11px',color:'rgba(255,255,255,0.7)',textAlign:'center'}}>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Bottom Nav */}
      <div style={{position:'fixed',bottom:'16px',left:'16px',right:'16px',zIndex:150}}>
        <div style={{
          background:'rgba(26,45,66,0.95)',
          backdropFilter:'blur(20px)',
          borderRadius:'100px',
          padding:'8px',
          display:'flex',
          alignItems:'center',
          justifyContent:'space-around',
          border:'1px solid rgba(255,255,255,0.08)',
          boxShadow:'0 8px 32px rgba(0,0,0,0.4)'
        }}>
          {nav.map(item => {
            const active = item.href === '/dashboard/more' ? showMore : pathname === item.href
            return (
              <button key={item.href} onClick={() => {
                if (item.href === '/dashboard/more') { setShowMore(s => !s) }
                else { setShowMore(false); router.push(item.href) }
              }} style={{
                display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',
                padding:'8px 20px',borderRadius:'100px',border:'none',cursor:'pointer',
                background: active ? '#C8392B' : 'transparent',
                transition:'all 0.2s',minWidth:'60px'
              }}>
                <span style={{fontSize:'18px',lineHeight:'1'}}>{item.icon}</span>
                <span style={{fontSize:'9px',color: active ? 'white' : 'rgba(255,255,255,0.4)',letterSpacing:'0.05em',fontWeight: active ? '600' : '400'}}>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
