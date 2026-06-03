'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const nav = [
  { href: '/dashboard', icon: '⚓', label: 'Start' },
  { href: '/dashboard/einnahmen', icon: '↑', label: 'Einnahmen' },
  { href: '/dashboard/ausgaben', icon: '↓', label: 'Ausgaben' },
  { href: '/dashboard/versicherungen', icon: '🛡', label: 'Versicherung' },
  { href: '/dashboard/sparziele', icon: '🎯', label: 'Sparziele' },
  { href: '/dashboard/notizen', icon: '📝', label: 'Notizen' },
  { href: '/dashboard/rechner', icon: '🧮', label: 'Rechner' },
  { href: '/dashboard/lexikon', icon: '📖', label: 'Lexikon' },
  { href: '/dashboard/news', icon: '📰', label: 'News' },
]

// Bottom nav zeigt nur die 5 wichtigsten
const bottomNav = [
  { href: '/dashboard', icon: '⚓', label: 'Start' },
  { href: '/dashboard/einnahmen', icon: '↑', label: 'Einnahmen' },
  { href: '/dashboard/ausgaben', icon: '↓', label: 'Ausgaben' },
  { href: '/dashboard/sparziele', icon: '🎯', label: 'Sparziele' },
  { href: '/dashboard/news', icon: '📰', label: 'News' },
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
  const [showMore, setShowMore] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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
    <div style={{display:'flex',height:'100vh',background:'#F0F4F8',overflow:'hidden'}}>

      {/* DESKTOP SIDEBAR */}
      {!isMobile && (
        <aside style={{width:'220px',background:'#0D1B2A',display:'flex',flexDirection:'column',borderRight:'3px solid #C8392B',flexShrink:0}}>
          <div style={{height:'64px',display:'flex',alignItems:'center',padding:'0 20px',borderBottom:'1px solid rgba(255,255,255,0.08)',gap:'10px'}}>
            <AnchorIcon />
            <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'18px',letterSpacing:'0.12em',color:'white'}}>ANKERPUNKT</span>
          </div>
          <nav style={{flex:1,padding:'12px 8px',overflowY:'auto'}}>
            {nav.map(item => {
              const active = pathname === item.href
              return (
                <a key={item.href} href={item.href} style={{
                  display:'flex',alignItems:'center',gap:'10px',
                  padding:'10px 12px',borderRadius:'8px',marginBottom:'2px',
                  background: active ? '#C8392B' : 'transparent',
                  color: active ? 'white' : 'rgba(255,255,255,0.45)',
                  textDecoration:'none',fontSize:'13px',fontWeight: active ? '600' : '400',
                  transition:'all 0.15s'
                }}>
                  <span style={{fontSize:'16px'}}>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              )
            })}
          </nav>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',padding:'12px 8px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 12px',marginBottom:'4px'}}>
              <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#C8392B',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:'700',fontSize:'14px'}}>{userName[0]?.toUpperCase()}</div>
              <span style={{color:'rgba(255,255,255,0.7)',fontSize:'13px'}}>{userName}</span>
            </div>
            <a href="/dashboard/profil" style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 12px',borderRadius:'6px',color:'rgba(255,255,255,0.35)',textDecoration:'none',fontSize:'12px'}}>
              <span>👤</span>Profil
            </a>
            <button onClick={logout} style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'8px 12px',borderRadius:'6px',color:'rgba(255,255,255,0.35)',background:'none',border:'none',cursor:'pointer',fontSize:'12px'}}>
              <span>↩</span>Abmelden
            </button>
          </div>
        </aside>
      )}

      {/* MAIN CONTENT */}
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        {/* Topbar */}
        <div style={{height:'56px',background:'white',borderBottom:'1px solid #E8DFD0',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px',flexShrink:0}}>
          {isMobile && (
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <AnchorIcon />
              <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'16px',letterSpacing:'0.1em',color:'#0D1B2A'}}>ANKERPUNKT</span>
            </div>
          )}
          {!isMobile && (
            <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:'11px',color:'#C8392B',letterSpacing:'0.2em',textTransform:'uppercase'}}>
              // {nav.find(n => n.href === pathname)?.label || 'Dashboard'}
            </div>
          )}
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:'11px',color:'#9AA0A6'}}>
              {new Date().toLocaleDateString('de-DE',{day:'2-digit',month:'short',year:'numeric'})}
            </div>
            {isMobile && (
              <a href="/dashboard/profil" style={{width:'32px',height:'32px',borderRadius:'50%',background:'#C8392B',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:'700',fontSize:'14px',textDecoration:'none'}}>{userName[0]?.toUpperCase()}</a>
            )}
          </div>
        </div>

        {/* Content */}
        <main style={{flex:1,overflowY:'auto',padding: isMobile ? '20px 16px 100px' : '32px 28px'}}>
          {children}
        </main>
      </div>

      {/* MOBILE FLOATING PILL NAV */}
      {isMobile && (
        <>
          {/* More Menu Overlay */}
          {showMore && (
            <div onClick={() => setShowMore(false)} style={{position:'fixed',inset:0,background:'rgba(13,27,42,0.5)',zIndex:40,backdropFilter:'blur(4px)'}}/>
          )}
          {showMore && (
            <div style={{position:'fixed',bottom:'90px',left:'50%',transform:'translateX(-50%)',background:'#0D1B2A',borderRadius:'20px',padding:'16px',zIndex:50,minWidth:'280px',boxShadow:'0 20px 60px rgba(0,0,0,0.4)'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
                {[
                  { href: '/dashboard/versicherungen', icon: '🛡', label: 'Versicherungen' },
                  { href: '/dashboard/notizen', icon: '📝', label: 'Notizen' },
                  { href: '/dashboard/rechner', icon: '🧮', label: 'Rechner' },
                  { href: '/dashboard/lexikon', icon: '📖', label: 'Lexikon' },
                  { href: '/dashboard/profil', icon: '👤', label: 'Profil' },
                ].map(item => (
                  <a key={item.href} href={item.href} onClick={() => setShowMore(false)} style={{
                    display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',
                    padding:'12px 8px',borderRadius:'12px',textDecoration:'none',
                    background: pathname === item.href ? '#C8392B' : 'rgba(255,255,255,0.06)',
                    color:'white',fontSize:'11px',transition:'background 0.15s'
                  }}>
                    <span style={{fontSize:'22px'}}>{item.icon}</span>
                    <span style={{textAlign:'center',lineHeight:'1.2'}}>{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Pill Nav */}
          <div style={{
            position:'fixed',bottom:'24px',left:'50%',transform:'translateX(-50%)',
            background:'#0D1B2A',borderRadius:'100px',
            padding:'8px 12px',
            display:'flex',alignItems:'center',gap:'4px',
            boxShadow:'0 8px 32px rgba(13,27,42,0.4)',
            zIndex:30,
            border:'1px solid rgba(255,255,255,0.08)'
          }}>
            {bottomNav.map(item => {
              const active = pathname === item.href
              return (
                <a key={item.href} href={item.href} style={{
                  display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',
                  padding:'8px 14px',borderRadius:'80px',textDecoration:'none',
                  background: active ? '#C8392B' : 'transparent',
                  transition:'background 0.15s',minWidth:'48px'
                }}>
                  <span style={{fontSize:'18px'}}>{item.icon}</span>
                  <span style={{fontSize:'9px',color: active ? 'white' : 'rgba(255,255,255,0.4)',letterSpacing:'0.05em'}}>{item.label}</span>
                </a>
              )
            })}
            {/* More Button */}
            <button onClick={() => setShowMore(s => !s)} style={{
              display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',
              padding:'8px 14px',borderRadius:'80px',background: showMore ? '#C8392B' : 'transparent',
              border:'none',cursor:'pointer',minWidth:'48px'
            }}>
              <span style={{fontSize:'18px'}}>⋯</span>
              <span style={{fontSize:'9px',color: showMore ? 'white' : 'rgba(255,255,255,0.4)'}}>Mehr</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
