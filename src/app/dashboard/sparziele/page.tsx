'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Trash2 } from 'lucide-react'

export default function SparziелePage() {
  const [items, setItems] = useState<any[]>([])
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ name: '', target_amount: '', current_amount: '0', deadline: '' })

  async function load() {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return
    const { data } = await sb.from('savings_goals').select('*').eq('user_id', user.id)
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  async function save() {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user || !form.name || !form.target_amount) return
    await sb.from('savings_goals').insert({ user_id: user.id, name: form.name, target_amount: parseFloat(form.target_amount), current_amount: parseFloat(form.current_amount) || 0, deadline: form.deadline || null, color: '#C8392B', icon: '🎯' })
    setShow(false)
    setForm({ name: '', target_amount: '', current_amount: '0', deadline: '' })
    load()
  }

  async function addAmount(id: string, current: number, add: number) {
    const sb = createClient()
    await sb.from('savings_goals').update({ current_amount: current + add }).eq('id', id)
    load()
  }

  async function del(id: string) {
    const sb = createClient()
    await sb.from('savings_goals').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs font-mono-ak text-[#C8392B] tracking-widest uppercase mb-1">// Kurs setzen</div>
          <h1 className="font-bebas text-4xl tracking-wider text-[#0D1B2A]">SPARZIELE</h1>
        </div>
        <button onClick={() => setShow(true)} className="flex items-center gap-2 bg-[#C8392B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#a82e22]"><Plus size={16}/> Neues Ziel</button>
      </div>
      <div className="flex flex-col gap-4">
        {items.length === 0 && <div className="bg-white rounded-lg p-8 text-center text-[#9AA0A6]">Noch keine Sparziele definiert.</div>}
        {items.map(item => {
          const pct = Math.min(100, (item.current_amount / item.target_amount) * 100)
          return (
            <div key={item.id} className="bg-white rounded-lg p-5 border border-[#E8DFD0]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-[#0D1B2A]">{item.name}</div>
                  {item.deadline && <div className="text-xs text-[#9AA0A6]">Bis {item.deadline}</div>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bebas text-xl text-[#0D1B2A]">{item.current_amount.toFixed(0)} € <span className="text-[#9AA0A6] text-sm">/ {item.target_amount.toFixed(0)} €</span></div>
                    <div className="text-xs text-[#9AA0A6]">{pct.toFixed(0)}% erreicht</div>
                  </div>
                  <button onClick={() => del(item.id)} className="text-[#9AA0A6] hover:text-[#C8392B]"><Trash2 size={16}/></button>
                </div>
              </div>
              <div className="h-2 bg-[#E8DFD0] rounded-full mb-3">
                <div className="h-full bg-[#C8392B] rounded-full transition-all" style={{width: pct + '%'}}/>
              </div>
              <div className="flex gap-2">
                {[50, 100, 500].map(amt => (
                  <button key={amt} onClick={() => addAmount(item.id, item.current_amount, amt)} className="text-xs border border-[#E8DFD0] px-3 py-1 rounded text-[#3D5166] hover:bg-[#F4F2EE]">+{amt} €</button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      {show && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal-box p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-bebas text-2xl tracking-wider mb-4">SPARZIEL ERSTELLEN</h2>
            <div className="flex flex-col gap-3">
              <input className="ak-input" placeholder="Name (z.B. Urlaub)" value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
              <input className="ak-input" placeholder="Zielbetrag (€)" type="number" value={form.target_amount} onChange={e => setForm({...form, target_amount: e.target.value})}/>
              <input className="ak-input" placeholder="Bereits gespart (€)" type="number" value={form.current_amount} onChange={e => setForm({...form, current_amount: e.target.value})}/>
              <input className="ak-input" type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})}/>
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
