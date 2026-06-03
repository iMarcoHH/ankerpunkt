'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Trash2 } from 'lucide-react'

export default function AusgabenPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ amount: '', category: 'Wohnen', description: '', date: new Date().toISOString().split('T')[0], is_recurring: false, recurrence: 'monthly' })

  async function load() {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return
    const { data } = await sb.from('transactions').select('*').eq('user_id', user.id).eq('type', 'expense').order('date', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user || !form.amount) return
    await sb.from('transactions').insert({ user_id: user.id, type: 'expense', amount: parseFloat(form.amount), category: form.category, description: form.description, date: form.date, is_recurring: form.is_recurring, recurrence: form.recurrence })
    setShow(false)
    setForm({ amount: '', category: 'Wohnen', description: '', date: new Date().toISOString().split('T')[0], is_recurring: false, recurrence: 'monthly' })
    load()
  }

  async function del(id: string) {
    const sb = createClient()
    await sb.from('transactions').delete().eq('id', id)
    load()
  }

  const total = items.reduce((s, i) => s + i.amount, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs font-mono-ak text-[#C8392B] tracking-widest uppercase mb-1">// Ausgang</div>
          <h1 className="font-bebas text-4xl tracking-wider text-[#0D1B2A]">AUSGABEN</h1>
          <div className="text-2xl font-bebas text-[#0D1B2A] mt-1">{total.toFixed(2)} € <span className="text-sm font-normal text-[#9AA0A6] font-sans">/ Monat</span></div>
        </div>
        <button onClick={() => setShow(true)} className="flex items-center gap-2 bg-[#C8392B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#a82e22]">
          <Plus size={16}/> Hinzufügen
        </button>
      </div>
      {loading ? <div className="text-[#9AA0A6]">Lädt...</div> : (
        <div className="flex flex-col gap-3">
          {items.length === 0 && <div className="bg-white rounded-lg p-8 text-center text-[#9AA0A6]">Noch keine Ausgaben eingetragen.</div>}
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-lg p-4 flex items-center justify-between border border-[#E8DFD0] border-l-4 border-l-[#0D1B2A]">
              <div>
                <div className="font-semibold text-[#0D1B2A]">{item.description || item.category}</div>
                <div className="text-xs text-[#9AA0A6]">{item.category} · {item.date} {item.is_recurring && '· wiederkehrend'}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-bebas text-xl text-[#C8392B]">-{item.amount.toFixed(2)} €</div>
                <button onClick={() => del(item.id)} className="text-[#9AA0A6] hover:text-[#C8392B]"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {show && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal-box p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-bebas text-2xl tracking-wider mb-4">AUSGABE HINZUFÜGEN</h2>
            <div className="flex flex-col gap-3">
              <input className="ak-input" placeholder="Betrag (€)" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}/>
              <select className="ak-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {['Wohnen','Lebensmittel','Transport','Gesundheit','Freizeit','Kleidung','Abos','Bildung','Sonstiges'].map(c => <option key={c}>{c}</option>)}
              </select>
              <input className="ak-input" placeholder="Beschreibung" value={form.description} onChange={e => setForm({...form, description: e.target.value})}/>
              <input className="ak-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}/>
              <label className="flex items-center gap-2 text-sm text-[#3D5166]">
                <input type="checkbox" checked={form.is_recurring} onChange={e => setForm({...form, is_recurring: e.target.checked})}/> Wiederkehrend
              </label>
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
