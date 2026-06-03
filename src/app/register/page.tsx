'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

function SideRays() {
  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
      <div style={{position:'absolute',left:'-100px',top:'50%',transform:'translateY(-50%)',width:'600px',height:'600px',background:'radial-gradient(ellipse at left, rgba(200,57,43,0.15) 0%, transparent 70%)',filter:'blur(40px)'}}/>
      <div style={{position:'absolute',right:'-100px',top:'30%',width:'500px',height:'500px',background:'radial-gradient(ellipse at right, rgba(200,57,43,0.1) 0%, transparent 70%)',filter:'blur(60px)'}}/>
      <div style={{position:'absolute',bottom:'-50px',left:'50%',transform:'translateX(-50%)',width:'800px',height:'300px',background:'radial-gradient(ellipse at bottom, rgba(200,57,43,0.08) 0%, transparent 70%)',filter:'blur(40px)'}}/>
    </div>
  )
}

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
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (signUpError) { setError(signUpError.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, full_name: name, onboarding_completed: false })
      router.push('/onboarding')
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#0D1B2A',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',position:'relative'}}>
      <SideRays />
      <div style={{width:'100%',maxWidth:'420px',position:'relative',zIndex:1}}>
        <a href="/" style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'40px',justifyContent:'center',textDecoration:'none'}}>
          <svg width="36" height="36" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="10" r="5" stroke="#C8392B" strokeWidth="2.5" fill="none"/>
            <circle cx="26" cy="10" r="2" fill="#C8392B"/>
            <line x1="26" y1="15" x2="26" y2="44" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="12" y1="24" x2="40" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M12 24 Q8 32 12 36 Q17 40 26 42 Q35 40 40 36 Q44 32 40 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="12" cy="36" r="3" fill="#C8392B"/>
            <circle cx="40" cy="36" r="3" fill="#C8392B"/>
          </svg>
          <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'26px',letterSpacing:'0.12em',color:'white'}}>ANKERPUNKT</span>
        </a>
        <div style={{
          background:'rgba(255,255,255,0.04)',borderRadius:'16px',padding:'36px',
          border:'1px solid rgba(255,255,255,0.08)',backdropFilter:'blur(12px)',
          boxShadow:'0 0 0 1px rgba(200,57,43,0.2), 0 20px 60px rgba(0,0,0,0.4), 0 0 80px rgba(200,57,43,0.06)',
          position:'relative',overflow:'hidden'
        }}>
          <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:'200px',height:'1px',background:'linear-gradient(90deg,transparent,rgba(200,57,43,0.6),transparent)'}}/>
          <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:'10px',color:'#C8392B',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'8px'}}>// Konto erstellen</div>
          <h1 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'2.2rem',letterSpacing:'0.08em',color:'white',marginBottom:'28px'}}>REGISTRIEREN</h1>
          {error && <div style={{background:'rgba(200,57,43,0.1)',border:'1px solid rgba(200,57,43,0.3)',borderRadius:'8px',padding:'10px 14px',color:'#ff6b6b',fontSize:'13px',marginBottom:'16px'}}>{error}</div>}
          <form onSubmit={handleRegister} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            {[
              { label:'Name', type:'text', value:name, onChange:(v:string)=>setName(v), placeholder:'Dein Name' },
              { label:'E-Mail', type:'email', value:email, onChange:(v:string)=>setEmail(v), placeholder:'du@beispiel.de' },
              { label:'Passwort', type:'password', value:password, onChange:(v:string)=>setPassword(v), placeholder:'Min. 6 Zeichen' },
            ].map(field => (
              <div key={field.label}>
                <label style={{fontSize:'11px',fontWeight:'500',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.4)',display:'block',marginBottom:'6px'}}>{field.label}</label>
                <input
                  type={field.type} value={field.value} onChange={e => field.onChange(e.target.value)} required
                  placeholder={field.placeholder}
                  style={{width:'100%',padding:'12px 14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',color:'white',fontSize:'14px',outline:'none',fontFamily:'IBM Plex Sans,sans-serif'}}
                  onFocus={e => e.target.style.borderColor='#C8392B'}
                  onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
                />
              </div>
            ))}
            <button type="submit" disabled={loading} style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'16px',letterSpacing:'0.12em',color:'white',background:'#C8392B',border:'none',padding:'14px',borderRadius:'8px',cursor:'pointer',marginTop:'4px',opacity:loading?0.7:1,boxShadow:'0 4px 20px rgba(200,57,43,0.3)'}}>
              {loading ? 'REGISTRIERUNG...' : 'KONTO ERSTELLEN'}
            </button>
          </form>
          <div style={{marginTop:'20px',textAlign:'center',fontSize:'13px',color:'rgba(255,255,255,0.3)'}}>
            Schon ein Konto?{' '}<a href="/login" style={{color:'#C8392B',textDecoration:'none',fontWeight:'500'}}>Anmelden</a>
          </div>
        </div>
      </div>
    </div>
  )
}
