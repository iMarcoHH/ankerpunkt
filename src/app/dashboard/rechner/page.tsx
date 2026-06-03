'use client'
import { useState } from 'react'

export default function RechnerPage() {
  const [tab, setTab] = useState('kredit')
  const [kredit, setKredit] = useState({ betrag: '10000', zins: '5', laufzeit: '5' })
  const [waehrung, setWaehrung] = useState({ betrag: '100', kurs: '1.08' })
  const [zins, setZins] = useState({ kapital: '1000', zins: '5', jahre: '10' })
  const [alg, setAlg] = useState({ gehalt: '3000', monate: '12' })

  const kreditRate = () => {
    const p = parseFloat(kredit.betrag), r = parseFloat(kredit.zins)/100/12, n = parseFloat(kredit.laufzeit)*12
    if (!p||!r||!n) return 0
    return (p*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1)
  }
  const zinsResult = () => parseFloat(zins.kapital)*Math.pow(1+parseFloat(zins.zins)/100, parseFloat(zins.jahre))
  const algResult = () => parseFloat(alg.gehalt)*0.6
  const tabs = ['kredit','waehrung','zins','alg']
  const tabLabels: any = { kredit:'Kredit', waehrung:'Währung', zins:'Zinseszins', alg:'ALG I' }

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-mono-ak text-[#C8392B] tracking-widest uppercase mb-1">// Werkzeug</div>
        <h1 className="font-bebas text-4xl tracking-wider text-[#0D1B2A]">RECHNER</h1>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab===t ? 'bg-[#0D1B2A] text-white' : 'bg-white border border-[#E8DFD0] text-[#3D5166] hover:bg-[#F4F2EE]'}`}>{tabLabels[t]}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6 border border-[#E8DFD0] max-w-md shadow-sm">
        {tab === 'kredit' && (
          <div className="flex flex-col gap-4">
            <h2 className="font-bebas text-xl tracking-wider text-[#0D1B2A]">KREDITRECHNER</h2>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Betrag (€)</label><input className="ak-input" type="number" value={kredit.betrag} onChange={e => setKredit({...kredit, betrag: e.target.value})}/></div>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Zinssatz (%)</label><input className="ak-input" type="number" value={kredit.zins} onChange={e => setKredit({...kredit, zins: e.target.value})}/></div>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Laufzeit (Jahre)</label><input className="ak-input" type="number" value={kredit.laufzeit} onChange={e => setKredit({...kredit, laufzeit: e.target.value})}/></div>
            <div className="bg-[#0D1B2A] rounded-xl p-4 text-center mt-2">
              <div className="text-xs text-white uppercase tracking-wider mb-2 opacity-60">Monatliche Rate</div>
              <div className="font-bebas text-4xl text-white tracking-wider">{kreditRate().toFixed(2)} €</div>
              <div className="text-xs text-white opacity-40 mt-1">Gesamt: {(kreditRate()*parseFloat(kredit.laufzeit)*12).toFixed(2)} €</div>
            </div>
          </div>
        )}
        {tab === 'waehrung' && (
          <div className="flex flex-col gap-4">
            <h2 className="font-bebas text-xl tracking-wider text-[#0D1B2A]">WÄHRUNGSRECHNER</h2>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Betrag (€)</label><input className="ak-input" type="number" value={waehrung.betrag} onChange={e => setWaehrung({...waehrung, betrag: e.target.value})}/></div>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Wechselkurs (1 EUR = ?)</label><input className="ak-input" type="number" value={waehrung.kurs} onChange={e => setWaehrung({...waehrung, kurs: e.target.value})}/></div>
            <div className="bg-[#0D1B2A] rounded-xl p-4 text-center mt-2">
              <div className="text-xs text-white uppercase tracking-wider mb-2 opacity-60">Ergebnis</div>
              <div className="font-bebas text-4xl text-white tracking-wider">{(parseFloat(waehrung.betrag)*parseFloat(waehrung.kurs)).toFixed(2)}</div>
            </div>
          </div>
        )}
        {tab === 'zins' && (
          <div className="flex flex-col gap-4">
            <h2 className="font-bebas text-xl tracking-wider text-[#0D1B2A]">ZINSESZINS</h2>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Startkapital (€)</label><input className="ak-input" type="number" value={zins.kapital} onChange={e => setZins({...zins, kapital: e.target.value})}/></div>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Zinssatz (%)</label><input className="ak-input" type="number" value={zins.zins} onChange={e => setZins({...zins, zins: e.target.value})}/></div>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Jahre</label><input className="ak-input" type="number" value={zins.jahre} onChange={e => setZins({...zins, jahre: e.target.value})}/></div>
            <div className="bg-[#0D1B2A] rounded-xl p-4 text-center mt-2">
              <div className="text-xs text-white uppercase tracking-wider mb-2 opacity-60">Endkapital</div>
              <div className="font-bebas text-4xl text-white tracking-wider">{zinsResult().toFixed(2)} €</div>
              <div className="text-xs text-white opacity-40 mt-1">Gewinn: +{(zinsResult()-parseFloat(zins.kapital)).toFixed(2)} €</div>
            </div>
          </div>
        )}
        {tab === 'alg' && (
          <div className="flex flex-col gap-4">
            <h2 className="font-bebas text-xl tracking-wider text-[#0D1B2A]">ALG I RECHNER</h2>
            <p className="text-xs text-[#9AA0A6]">Arbeitslosengeld I beträgt ca. 60% des letzten Nettolohns.</p>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Letztes Nettoeinkommen (€)</label><input className="ak-input" type="number" value={alg.gehalt} onChange={e => setAlg({...alg, gehalt: e.target.value})}/></div>
            <div><label className="text-xs text-[#9AA0A6] uppercase tracking-wider block mb-1">Anspruchsdauer (Monate)</label><input className="ak-input" type="number" value={alg.monate} onChange={e => setAlg({...alg, monate: e.target.value})}/></div>
            <div className="bg-[#0D1B2A] rounded-xl p-4 text-center mt-2">
              <div className="text-xs text-white uppercase tracking-wider mb-2 opacity-60">Monatliches ALG I</div>
              <div className="font-bebas text-4xl text-white tracking-wider">{algResult().toFixed(2)} €</div>
              <div className="text-xs text-white opacity-40 mt-1">Gesamt: {(algResult()*parseFloat(alg.monate)).toFixed(2)} €</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
