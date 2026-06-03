'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Trash2 } from 'lucide-react'

export default function NotizenPage() {
  const [items, setItems] = useState<any[]>([])
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', reminder_at: '' })

  async function load() {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return
    const { data } = await sb.from('notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  async function save() {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user || !form.title) return
    await sb.from('notes').insert({ user_id: user.id, title: form.title, content: form.content, reminder_at: form.reminder_at || null })
    setShow(false)
    setForm({ title: '', content: '', reminder_at: '' })
    load()
  }

  async function del(id: string) {
    const sb = createClient()
    await sb.from('notes').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs font-mono-ak text-[#C8392B] tracking-widest uppercase mb-1">// Notizen</div>
          <h1 className="font-bebas text-4xl tracking-wider text-[#0D1B2A]">NOTIZEN</h1>
        </div>
        <button onClick={() => setShow(true)} className="flex items-center gap-2 bg-[#C8392B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#a82e22]"><Plus size={16}/> Neue Notiz</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 && <div className="bg-white rounded-lg p-8 text-center text-[#9AA0A6] col-span-2">Noch keine Notizen.</div>}
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-lg p-5 border border-[#E8DFD0] border-t-4 border-t-[#C8392B]">
            <div className="flex justify-between items-start mb-2">
              <div className="font-semibold text-[#0D1B2A]">{item.title}</div>
              <button onClick={() => del(item.id)} className="text-[#9AA0A6] hover:text-[#C8392B]"><Trash2 size={14}/></button>
            </div>
            {item.content && <p className="text-sm text-[#3D5166] leading-relaxed mb-2">{item.content}</p>}
            {item.reminder_at && <div className="text-xs text-[#C8392B] font-mono-ak">⏰ {new Date(item.reminder_at).toLocaleString('de-DE')}</div>}
          </div>
        ))}
      </div>
      {show && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal-box p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-bebas text-2xl tracking-wider mb-4">NOTIZ ERSTELLEN</h2>
            <div className="flex flex-col gap-3">
              <input className="ak-input" placeholder="Titel" value={form.title} onChange={e => setForm({...form, title: e.target.value})}/>
              <textarea className="ak-input" placeholder="Inhalt" rows={4} value={form.content} onChange={e => setForm({...form, content: e.target.value})}/>
              <label className="text-xs text-[#9AA0A6] uppercase tracking-wider">Erinnerung (optional)</label>
              <input className="ak-input" type="datetime-local" value={form.reminder_at} onChange={e => setForm({...form, reminder_at: e.target.value})}/>
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
