'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { AnchorLogo } from '@/components/ui/AnchorLogo'
import { LayoutDashboard, TrendingUp, TrendingDown, Shield, Target, FileText, Calculator, BookOpen, User, LogOut, ChevronLeft, ChevronRight, Bell } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Lagebericht' },
  { href: '/dashboard/einnahmen', icon: TrendingUp, label: 'Einnahmen' },
  { href: '/dashboard/ausgaben', icon: TrendingDown, label: 'Ausgaben' },
  { href: '/dashboard/versicherungen', icon: Shield, label: 'Versicherungen' },
  { href: '/dashboard/sparziele', icon: Target, label: 'Sparziele' },
  { href: '/dashboard/notizen', icon: FileText, label: 'Notizen' },
  { href: '/dashboard/rechner', icon: Calculator, label: 'Rechner' },
  { href: '/dashboard/lexikon', icon: BookOpen, label: 'Lexikon' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('full_name, onboarding_completed').eq('id', session.user.id).single()
      if (data && !data.onboarding_completed) { router.push('/onboarding'); return }
      setUserName(data?.full_name?.split(' ')[0] || 'Kapitän')
      setLoading(false)
    })
  }, [router])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
      <div className="flex items-center gap-3 text-white animate-pulse">
        <AnchorLogo size={32} white />
        <span className="font-bebas text-xl tracking-wider">LADEN...</span>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-[#F4F2EE] overflow-hidden">
      <aside className={`${collapsed ? 'w-16' : 'w-60'} bg-[#0D1B2A] flex flex-col transition-all duration-300 relative flex-shrink-0 border-r border-[#C8392B]`}>
        <div className={`h-16 flex items-center border-b border-white/10 ${collapsed ? 'justify-center px-4' : 'px-5 gap-3'}`}>
          <AnchorLogo size={26} white />
          {!collapsed && <span className="font-bebas text-xl tracking-[0.12em] text-white">ANKERPUNKT</span>}
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <a key={item.href} href={item.href}
                className={`flex items-center ${collapsed ? 'justify-center px-4' : 'px-4 gap-3'} py-3 mx-2 rounded-lg transition-all ${active ? 'bg-[#C8392B] text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                <item.icon size={18} className="flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </a>
            )
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#C8392B] flex items-center justify-center text-white font-bebas text-sm">{userName[0]?.toUpperCase()}</div>
              <div className="text-white text-xs font-medium truncate">{userName}</div>
            </div>
          )}
          <a href="/dashboard/profil" className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-2'} py-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5`}>
            <User size={16} />
            {!collapsed && <span className="text-xs">Profil</span>}
          </a>
          <button onClick={handleLogout} className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-2'} py-2 text-white/40 hover:text-[#C8392B] transition-colors rounded-lg hover:bg-white/5`}>
            <LogOut size={16} />
            {!collapsed && <span className="text-xs">Abmelden</span>}
          </button>
        </div>
        <button onClick={() => setCollapsed(c => !c)} className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#C8392B] text-white rounded-full flex items-center justify-center shadow-lg z-10">
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="h-14 bg-white border-b border-[#E8DFD0] flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="text-xs font-mono-ak text-[#C8392B] tracking-[0.2em] uppercase">
            // {navItems.find(n => n.href === pathname)?.label || 'Dashboard'}
          </div>
          <div className="text-sm text-[#9AA0A6] font-mono-ak">{new Date().toLocaleDateString('de-DE', { day:'2-digit', month:'short', year:'numeric' })}</div>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
