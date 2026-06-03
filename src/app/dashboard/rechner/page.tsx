'use client'
import { useState } from 'react'

export default function RechnerPage() {
  const [tab, setTab] = useState('kredit')
  const [kredit, setKredit] = useState({ betrag: '10000', zins: '5', laufzeit: '5' })
  const [waehrung, setWaehrung] = useState({ betrag: '100', von: 'EUR', nach: 'USD', kurs: '1.08' })
  const [zins, setZins] = useState({ kapital: '1000', zins: '5', jahre: '10' })

  const kreditRate = () => {
    const p = parseFloat(kredit.betrag), r = parseFloat(kredit.zins) / 100 / 12, n = parseFloat(kredit.laufzeit) * 12
    if (!p || !r || !n) return 0
    return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  }

  const waehrungResult = () => parseFloat(waehrung.betrag) * parseFloat(waehrung.kurs)
  const zinsResult = () => parseFloat(zins.kapital) * Math.pow(1 + parseFloat(zins.zins) / 100, parseFloat(zins.jahre))

  const tabs = [{ id: 'kredit', label: 'Kredit' }, { id: 'waehrung', label: 'Währung' }, { id: 'zins', label: 'Zinseszins' }]

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-mono-ak text-[#C8392B] tracking-widest uppercase mb-1">// Werkzeug</div>
        <h1 className="font-bebas text-4xl tracking-wider text-[#0D1B2A]">RECHNER</h1>
      </div>
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-[#0D1B2A] text-white' : 'bg-white border border-[#E8DFD0] text-[#3D5166] hover:bg-[#F4F2EE]'}`}>{t.label}</button>
        ))}
      </div>
      <div className="bg-white rounded-lg p-6 border border-[#E8DFD0] max-w-md">
        {tab === 'kredit' && (
          <div className="flex flex-col gap-4">
            <h2 className="font-bebas text-xl tracking-wider text-[#0D1B2A]">KREDITRECHNER</h2>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Betrag (€)</label><input className="ak-input" type="number" value={kredit.betrag} onChange={e => setKredit({...kredit, betrag: e.target.value})}/></div>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Zinssatz (%)</label><input className="ak-input" type="number" value={kredit.zins} onChange={e => setKredit({...kredit, zins: e.target.value})}/></div>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Laufzeit (Jahre)</label><input className="ak-input" type="number" value={kredit.laufzeit} onChange={e => setKredit({...kredit, laufzeit: e.target.value})}/></div>
            <div className="bg-[#0D1B2A] rounded-lg p-4 text-center">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Monatliche Rate</div>
              <div className="font-bebas text-3xl text-white">{kreditRate().toFixed(2)} €</div>
            </div>
          </div>
        )}
        {tab === 'waehrung' && (
          <div className="flex flex-col gap-4">
            <h2 className="font-bebas text-xl tracking-wider text-[#0D1B2A]">WÄHRUNGSRECHNER</h2>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Betrag</label><input className="ak-input" type="number" value={waehrung.betrag} onChange={e => setWaehrung({...waehrung, betrag: e.target.value})}/></div>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Kurs (1 {waehrung.von} = ? {waehrung.nach})</label><input className="ak-input" type="number" value={waehrung.kurs} onChange={e => setWaehrung({...waehrung, kurs: e.target.value})}/></div>
            <div className="bg-[#0D1B2A] rounded-lg p-4 text-center">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Ergebnis</div>
              <div className="font-bebas text-3xl text-white">{waehrungResult().toFixed(2)} {waehrung.nach}</div>
            </div>
          </div>
        )}
        {tab === 'zins' && (
          <div className="flex flex-col gap-4">
            <h2 className="font-bebas text-xl tracking-wider text-[#0D1B2A]">ZINSESZINSRECHNER</h2>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Startkapital (€)</label><input className="ak-input" type="number" value={zins.kapital} onChange={e => setZins({...zins, kapital: e.target.value})}/></div>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Zinssatz (%)</label><input className="ak-input" type="number" value={zins.zins} onChange={e => setZins({...zins, zins: e.target.value})}/></div>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Jahre</label><input className="ak-input" type="number" value={zins.jahre} onChange={e => setZins({...zins, jahre: e.target.value})}/></div>
            <div className="bg-[#0D1B2A] rounded-lg p-4 text-center">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Endkapital</div>
              <div className="font-bebas text-3xl text-white">{zinsResult().toFixed(2)} €</div>
              <div className="text-xs text-white/40 mt-1">Gewinn: +{(zinsResult() - parseFloat(zins.kapital)).toFixed(2)} €</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
