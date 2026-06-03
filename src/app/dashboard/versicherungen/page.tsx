'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Trash2 } from 'lucide-react'

export default function VersicherungenPage() {
  const [items, setItems] = useState<any[]>([])
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ name: '', provider: '', amount: '', recurrence: 'monthly', category: 'Haftpflicht' })

  async function load() {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return
    const { data } = await sb.from('insurances').select('*').eq('user_id', user.id)
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  async function save() {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user || !form.name || !form.amount) return
    await sb.from('insurances').insert({ user_id: user.id, name: form.name, provider: form.provider, amount: parseFloat(form.amount), recurrence: form.recurrence, category: form.category })
    setShow(false)
    setForm({ name: '', provider: '', amount: '', recurrence: 'monthly', category: 'Haftpflicht' })
    load()
  }

  async function del(id: string) {
    const sb = createClient()
    await sb.from('insurances').delete().eq('id', id)
    load()
  }

  const totalMonthly = items.reduce((s, i) => s + (i.recurrence === 'monthly' ? i.amount : i.amount / 12), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs font-mono-ak text-[#C8392B] tracking-widest uppercase mb-1">// Absicherung</div>
          <h1 className="font-bebas text-4xl tracking-wider text-[#0D1B2A]">VERSICHERUNGEN</h1>
          <div className="text-2xl font-bebas text-[#0D1B2A] mt-1">{totalMonthly.toFixed(2)} € <span className="text-sm font-normal text-[#9AA0A6]">/ Monat</span></div>
        </div>
        <button onClick={() => setShow(true)} className="flex items-center gap-2 bg-[#C8392B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#a82e22]"><Plus size={16}/> Hinzufügen</button>
      </div>
      <div className="flex flex-col gap-3">
        {items.length === 0 && <div className="bg-white rounded-lg p-8 text-center text-[#9AA0A6]">Noch keine Versicherungen eingetragen.</div>}
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-lg p-4 flex items-center justify-between border border-[#E8DFD0] border-l-4 border-l-[#9AA0A6]">
            <div>
              <div className="font-semibold text-[#0D1B2A]">{item.name}</div>
              <div className="text-xs text-[#9AA0A6]">{item.provider} · {item.category} · {item.recurrence === 'monthly' ? 'monatlich' : 'jährlich'}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-bebas text-xl text-[#0D1B2A]">{item.amount.toFixed(2)} €</div>
                <div className="text-xs text-[#9AA0A6]">{(item.recurrence === 'yearly' ? item.amount / 12 : item.amount).toFixed(2)} €/Mo</div>
              </div>
              <button onClick={() => del(item.id)} className="text-[#9AA0A6] hover:text-[#C8392B]"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
      {show && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal-box p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-bebas text-2xl tracking-wider mb-4">VERSICHERUNG HINZUFÜGEN</h2>
            <div className="flex flex-col gap-3">
              <input className="ak-input" placeholder="Name (z.B. Haftpflicht)" value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
              <input className="ak-input" placeholder="Anbieter" value={form.provider} onChange={e => setForm({...form, provider: e.target.value})}/>
              <input className="ak-input" placeholder="Betrag (€)" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}/>
              <select className="ak-input" value={form.recurrence} onChange={e => setForm({...form, recurrence: e.target.value})}>
                <option value="monthly">Monatlich</option>
                <option value="yearly">Jährlich</option>
              </select>
              <select className="ak-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {['Haftpflicht','Hausrat','KFZ','Kranken','Leben','Berufsunfähigkeit','Rechtsschutz','Unfall','Sonstiges'].map(c => <option key={c}>{c}</option>)}
              </select>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setShow(false)} className="flex-1 py-2 border border-[#E8DFD0] rounded-lg text-[#9AA0A6]">Abbrechen</button>
                <button onClick={save} className="flex-1 py-2 bg-[#C8392B] text-white rounded-lg font-medium">Speichern</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
