'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { AnchorLogo } from '@/components/ui/AnchorLogo'

const steps = [
  { title: 'AHOI!', desc: 'Ankerpunkt gibt dir den vollständigen Überblick über deine Finanzen. Lass uns kurz einrichten.', icon: '⚓' },
  { title: 'DEIN BUDGET', desc: 'Was ist dein monatliches Netto-Einkommen? Das hilft uns, deinen Lagebericht zu berechnen.', icon: '💶' },
  { title: 'BEREIT?', desc: 'Dein Ankerpunkt ist gesetzt. Du kannst jetzt mit dem Tracken beginnen.', icon: '🎯' }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [budget, setBudget] = useState('')
  const [loading, setLoading] = useState(false)

  async function finish() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ monthly_budget: parseFloat(budget) || 0, onboarding_completed: true }).eq('id', user.id)
    }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-12 justify-center">
          <AnchorLogo size={32} white />
          <span className="font-bebas text-xl tracking-[0.12em] text-white">ANKERPUNKT</span>
        </div>
        <div className="flex gap-2 mb-10">
          {steps.map((_, i) => <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-[#C8392B]' : 'bg-white/10'}`}/>)}
        </div>
        <div className="bg-white rounded-xl p-10 shadow-2xl">
          <div className="text-5xl mb-6">{steps[step].icon}</div>
          <div className="text-xs font-mono-ak text-[#C8392B] tracking-[0.2em] uppercase mb-2">Schritt {step + 1} von {steps.length}</div>
          <h1 className="font-bebas text-4xl tracking-wider text-[#0D1B2A] mb-2">{steps[step].title}</h1>
          <p className="text-[#3D5166] font-light text-sm leading-relaxed mb-6">{steps[step].desc}</p>
          {step === 1 && (
            <div className="mb-6">
              <label className="text-xs font-medium uppercase tracking-widest text-[#9AA0A6] block mb-2">Monatliches Einkommen (€)</label>
              <input type="number" value={budget} onChange={e => setBudget(e.target.value)} className="ak-input text-lg" placeholder="z.B. 3500" />
            </div>
          )}
          <div className="flex gap-3">
            {step > 0 && <button onClick={() => setStep(s => s - 1)} className="flex-1 font-bebas text-base tracking-wider text-[#9AA0A6] border border-[#E8DFD0] py-3 rounded-lg hover:bg-[#F4F2EE] transition-colors">ZURÜCK</button>}
            {step < steps.length - 1
              ? <button onClick={() => setStep(s => s + 1)} className="flex-1 font-bebas text-base tracking-wider text-white bg-[#C8392B] py-3 rounded-lg hover:bg-[#a82e22] transition-colors">WEITER</button>
              : <button onClick={finish} disabled={loading} className="flex-1 font-bebas text-base tracking-wider text-white bg-[#C8392B] py-3 rounded-lg hover:bg-[#a82e22] transition-colors disabled:opacity-50">{loading ? 'LADEN...' : 'ANKERPUNKT SETZEN'}</button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
