'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { AnchorLogo } from '@/components/ui/AnchorLogo'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) { setError('Passwort muss mindestens 6 Zeichen haben.'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email, password, options: { data: { full_name: name } }
    })
    if (signUpError) { setError(signUpError.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, full_name: name, onboarding_completed: false })
      router.push('/onboarding')
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <a href="/" className="flex items-center gap-3 mb-10 justify-center">
          <AnchorLogo size={36} white />
          <span className="font-bebas text-2xl tracking-[0.12em] text-white">ANKERPUNKT</span>
        </a>
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <div className="text-xs font-mono-ak text-[#C8392B] tracking-[0.2em] uppercase mb-2">// Konto erstellen</div>
          <h1 className="font-bebas text-3xl tracking-wider text-[#0D1B2A] mb-6">REGISTRIEREN</h1>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-widest text-[#9AA0A6] block mb-1.5">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="ak-input" placeholder="Dein Name" required />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-widest text-[#9AA0A6] block mb-1.5">E-Mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="ak-input" placeholder="du@beispiel.de" required />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-widest text-[#9AA0A6] block mb-1.5">Passwort</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="ak-input" placeholder="Min. 6 Zeichen" required minLength={6} />
            </div>
            <button type="submit" disabled={loading} className="font-bebas text-base tracking-[0.12em] text-white bg-[#C8392B] py-3 rounded-lg hover:bg-[#a82e22] transition-colors mt-2 disabled:opacity-50">
              {loading ? 'REGISTRIERUNG...' : 'KONTO ERSTELLEN'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-[#9AA0A6]">
            Schon ein Konto?{' '}<a href="/login" className="text-[#C8392B] font-medium hover:underline">Anmelden</a>
          </div>
        </div>
      </div>
    </div>
  )
}
