'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import dynamic from 'next/dynamic'

const Dock = dynamic(() => import('@/components/ui/Dock'), { ssr: false })

const navItems = [
  { href: '/dashboard', emoji: '⚓', label: 'Start' },
  { href: '/dashboard/einnahmen', emoji: '↑', label: 'Einnahmen' },
  { href: '/dashboard/ausgaben', emoji: '↓', label: 'Ausgaben' },
  { href: '/dashboard/sparziele', emoji: '🎯', label: 'Sparziele' },
  { href: '/dashboard/versicherungen', emoji: '🛡', label: 'Versicherung' },
  { href: '/dashboard/notizen', emoji: '📝', label: 'Notizen' },
  { href: '/dashboard/rechner', emoji: '🧮', label: 'Rechner' },
  { href: '/dashboard/news', emoji: '📰', label: 'News' },
  { href: '/dashboard/profil', emoji: '👤', label: 'Profil' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)

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

  const dockItems = navItems.map(item => ({
    icon: <span style={{fontSize:'20px'}}>{item.emoji}</span>,
    label: item.label,
    className: pathname === item.href ? 'active-nav' : '',
    onClick: () => router.push(item.href)
  }))

  return (
    <div style={{minHeight:'100vh',background:'#F0F4F8',fontFamily:'IBM Plex Sans,sans-serif'}}>
      {/* Top Bar */}
      <div style={{position:'fixed',top:0,left:0,right:0,zIndex:100,height:'60px',background:'white',borderBottom:'1px solid rgba(13,27,42,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',boxShadow:'0 1px 8px rgba(13,27,42,0.04)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <svg width="26" height="26" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="10" r="5" stroke="#C8392B" strokeWidth="2.5" fill="none"/>
            <circle cx="26" cy="10" r="2" fill="#C8392B"/>
            <line x1="26" y1="15" x2="26" y2="44" stroke="#0D1B2A" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="12" y1="24" x2="40" y2="24" stroke="#0D1B2A" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M12 24 Q8 32 12 36 Q17 40 26 42 Q35 40 40 36 Q44 32 40 24" fill="none" stroke="#0D1B2A" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="12" cy="36" r="3" fill="#C8392B"/>
            <circle cx="40" cy="36" r="3" fill="#C8392B"/>
          </svg>
          <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'18px',letterSpacing:'0.12em',color:'#0D1B2A'}}>ANKERPUNKT</span>
        </div>
        <a href="/dashboard/profil" style={{width:'36px',height:'36px',borderRadius:'50%',background:'#C8392B',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:'700',fontSize:'14px',textDecoration:'none'}}>
          {userName[0]?.toUpperCase()}
        </a>
      </div>

      {/* Content */}
      <main style={{paddingTop:'76px',paddingBottom:'120px',minHeight:'100vh',padding:'76px 24px 120px'}}>
        {children}
      </main>

      {/* Dock Navigation */}
      <div style={{position:'fixed',bottom:'20px',left:0,right:0,display:'flex',justifyContent:'center',zIndex:200}}>
        <Dock
          items={dockItems}
          panelHeight={64}
          baseItemSize={48}
          magnification={68}
          distance={150}
        />
      </div>
    </div>
  )
}
