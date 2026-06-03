'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
    })
  }, [router])

  return (
    <div className="p-6">
      <h1 className="font-bebas text-4xl tracking-wider text-[#0D1B2A]">LAGEBERICHT</h1>
      <p className="text-[#9AA0A6] mt-2">Dashboard lädt...</p>
    </div>
  )
}
