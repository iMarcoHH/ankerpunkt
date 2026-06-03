'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ProfilPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [form, setForm] = useState({ full_name: '', monthly_budget: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await sb.from('profiles').select('*').eq('id', user.id).single()
      if (data) { setProfile(data); setForm({ full_name: data.full_name || '', monthly_budget: data.monthly_budget || '' }) }
    })
  }, [])

  async function save() {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return
    await sb.from('profiles').update({ full_name: form.full_name, monthly_budget: parseFloat(form.monthly_budget) || 0 }).eq('id', user.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function logout() {
    const sb = createClient()
    await sb.auth.signOut()
    router.push('/')
  }

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-mono-ak text-[#C8392B] tracking-widest uppercase mb-1">// Einstellungen</div>
        <h1 className="font-bebas text-4xl tracking-wider text-[#0D1B2A]">PROFIL</h1>
      </div>
      <div className="bg-white rounded-lg p-6 border border-[#E8DFD0] max-w-md flex flex-col gap-4">
        <div>
          <label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Name</label>
          <input className="ak-input" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})}/>
        </div>
        <div>
          <label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Monatliches Einkommen (€)</label>
          <input className="ak-input" type="number" value={form.monthly_budget} onChange={e => setForm({...form, monthly_budget: e.target.value})}/>
        </div>
        <button onClick={save} className="py-3 bg-[#C8392B] text-white rounded-lg font-medium hover:bg-[#a82e22]">
          {saved ? '✓ Gespeichert!' : 'Speichern'}
        </button>
        <hr className="border-[#E8DFD0]"/>
        <button onClick={logout} className="py-3 border border-[#E8DFD0] text-[#9AA0A6] rounded-lg hover:bg-[#F4F2EE]">Abmelden</button>
      </div>
    </div>
  )
}
