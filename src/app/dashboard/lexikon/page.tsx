'use client'
import { useState } from 'react'

const terms = [
  { term: 'ETF', def: 'Exchange Traded Fund — ein börsengehandelter Fonds, der einen Index wie den DAX oder S&P 500 nachbildet. Günstig, breit diversifiziert.' },
  { term: 'Inflation', def: 'Allgemeiner Preisanstieg über Zeit. Bei 3% Inflation verliert Geld auf dem Konto jährlich 3% seiner Kaufkraft.' },
  { term: 'Nettoeinkommen', def: 'Dein Gehalt nach Abzug von Steuern und Sozialabgaben — das, was tatsächlich auf deinem Konto landet.' },
  { term: 'Bruttoeinkommen', def: 'Dein Gehalt vor Abzügen. Der Betrag im Arbeitsvertrag.' },
  { term: 'Zinseszins', def: 'Zinsen auf bereits verdiente Zinsen. Der stärkste Effekt beim langfristigen Sparen und Investieren.' },
  { term: 'Diversifikation', def: 'Risikoverteilung durch Investitionen in verschiedene Anlageklassen, Branchen oder Regionen.' },
  { term: 'Liquidität', def: 'Wie schnell ein Vermögenswert in Bargeld umgewandelt werden kann. Tagesgeld = hoch liquide, Immobilien = wenig liquide.' },
  { term: 'Eigenkapitalrendite', def: 'Verhältnis von Gewinn zu eingesetztem Eigenkapital. Zeigt wie effizient Kapital eingesetzt wird.' },
  { term: 'Tagesgeld', def: 'Flexibles Sparkonto mit variablem Zinssatz. Geld ist täglich verfügbar — ideal als Notgroschen.' },
  { term: 'Festgeld', def: 'Sparkonto mit festem Zinssatz und fester Laufzeit. Höhere Zinsen als Tagesgeld, aber weniger flexibel.' },
  { term: 'Notgroschen', def: '3-6 Monatsgehälter als liquide Reserve für unvorhergesehene Ausgaben. Auf dem Tagesgeldkonto parken.' },
  { term: 'Depot', def: 'Konto für Wertpapiere wie Aktien, ETFs oder Anleihen. Wird bei einer Bank oder einem Online-Broker geführt.' },
]

export default function LexikonPage() {
  const [search, setSearch] = useState('')
  const filtered = terms.filter(t => t.term.toLowerCase().includes(search.toLowerCase()) || t.def.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-mono-ak text-[#C8392B] tracking-widest uppercase mb-1">// Wissen</div>
        <h1 className="font-bebas text-4xl tracking-wider text-[#0D1B2A]">FINANZ-LEXIKON</h1>
      </div>
      <input className="ak-input mb-6 max-w-md" placeholder="Begriff suchen..." value={search} onChange={e => setSearch(e.target.value)}/>
      <div className="flex flex-col gap-3">
        {filtered.map(item => (
          <div key={item.term} className="bg-white rounded-lg p-5 border border-[#E8DFD0] border-l-4 border-l-[#C8392B]">
            <div className="font-bebas text-xl tracking-wider text-[#0D1B2A] mb-1">{item.term}</div>
            <p className="text-sm text-[#3D5166] leading-relaxed">{item.def}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
