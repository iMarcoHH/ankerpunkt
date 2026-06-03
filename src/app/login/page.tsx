'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

function SideRays() {
  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
      {/* Left ray */}
      <div style={{
        position:'absolute',left:'-100px',top:'50%',transform:'translateY(-50%)',
        width:'600px',height:'600px',
        background:'radial-gradient(ellipse at left, rgba(200,57,43,0.15) 0%, transparent 70%)',
        filter:'blur(40px)'
      }}/>
      {/* Right ray */}
      <div style={{
        position:'absolute',right:'-100px',top:'30%',
        width:'500px',height:'500px',
        background:'radial-gradient(ellipse at right, rgba(200,57,43,0.1) 0%, transparent 70%)',
        filter:'blur(60px)'
      }}/>
      {/* Bottom glow */}
      <div style={{
        position:'absolute',bottom:'-50px',left:'50%',transform:'translateX(-50%)',
        width:'800px',height:'300px',
        background:'radial-gradient(ellipse at bottom, rgba(200,57,43,0.08) 0%, transparent 70%)',
        filter:'blur(40px)'
      }}/>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('E-Mail oder Passwort falsch.'); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <div style={{minHeight:'100vh',background:'#0D1B2A',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',position:'relative'}}>
      <SideRays />
      
      <div style={{width:'100%',maxWidth:'420px',position:'relative',zIndex:1}}>
        {/* Logo */}
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

        {/* Card mit Border Glow */}
        <div style={{
          background:'rgba(255,255,255,0.04)',
          borderRadius:'16px',
          padding:'36px',
          border:'1px solid rgba(255,255,255,0.08)',
          backdropFilter:'blur(12px)',
          boxShadow:'0 0 0 1px rgba(200,57,43,0.2), 0 20px 60px rgba(0,0,0,0.4), 0 0 80px rgba(200,57,43,0.06)',
          position:'relative',
          overflow:'hidden'
        }}>
          {/* Subtle top glow */}
          <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:'200px',height:'1px',background:'linear-gradient(90deg,transparent,rgba(200,57,43,0.6),transparent)'}}/>
          
          <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:'10px',color:'#C8392B',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'8px'}}>// Willkommen zurück</div>
          <h1 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'2.2rem',letterSpacing:'0.08em',color:'white',marginBottom:'28px'}}>ANMELDEN</h1>
          
          {error && (
            <div style={{background:'rgba(200,57,43,0.1)',border:'1px solid rgba(200,57,43,0.3)',borderRadius:'8px',padding:'10px 14px',color:'#ff6b6b',fontSize:'13px',marginBottom:'16px'}}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div>
              <label style={{fontSize:'11px',fontWeight:'500',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.4)',display:'block',marginBottom:'6px'}}>E-Mail</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="du@beispiel.de"
                style={{width:'100%',padding:'12px 14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',color:'white',fontSize:'14px',outline:'none',fontFamily:'IBM Plex Sans,sans-serif',transition:'border-color 0.15s'}}
                onFocus={e => e.target.style.borderColor = '#C8392B'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            <div>
              <label style={{fontSize:'11px',fontWeight:'500',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.4)',display:'block',marginBottom:'6px'}}>Passwort</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                style={{width:'100%',padding:'12px 14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',color:'white',fontSize:'14px',outline:'none',fontFamily:'IBM Plex Sans,sans-serif',transition:'border-color 0.15s'}}
                onFocus={e => e.target.style.borderColor = '#C8392B'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            <button
              type="submit" disabled={loading}
              style={{
                fontFamily:'Bebas Neue,sans-serif',fontSize:'16px',letterSpacing:'0.12em',
                color:'white',background:'#C8392B',border:'none',padding:'14px',
                borderRadius:'8px',cursor:'pointer',marginTop:'4px',
                transition:'background 0.2s',opacity: loading ? 0.7 : 1,
                boxShadow:'0 4px 20px rgba(200,57,43,0.3)'
              }}
            >
              {loading ? 'LÄDT...' : 'ANMELDEN'}
            </button>
          </form>
          
          <div style={{marginTop:'20px',textAlign:'center',fontSize:'13px',color:'rgba(255,255,255,0.3)'}}>
            Noch kein Konto?{' '}
            <a href="/register" style={{color:'#C8392B',textDecoration:'none',fontWeight:'500'}}>Registrieren</a>
          </div>
        </div>
      </div>
    </div>
  )
}
