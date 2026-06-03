'use client'
import { useEffect, useState } from 'react'

const FEEDS = [
  { name: 'Tagesschau', url: 'https://www.tagesschau.de/xml/rss2/' },
  { name: 'Handelsblatt', url: 'https://www.handelsblatt.com/contentexport/feed/schlagzeilen' },
  { name: 'Spiegel Wirtschaft', url: 'https://www.spiegel.de/wirtschaft/index.rss' },
]

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(0)

  useEffect(() => { loadFeed(0) }, [])

  async function loadFeed(idx: number) {
    setLoading(true)
    setActive(idx)
    try {
      const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FEEDS[idx].url)}&count=20`)
      const data = await res.json()
      setNews(data.items || [])
    } catch { setNews([]) }
    setLoading(false)
  }

  return (
    <div>
      <div style={{marginBottom:'24px'}}>
        <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:'11px',color:'#C8392B',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'4px'}}>// Live</div>
        <h1 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'2.5rem',letterSpacing:'0.08em',color:'#0D1B2A'}}>WIRTSCHAFTS-NEWS</h1>
      </div>
      <div style={{display:'flex',gap:'8px',marginBottom:'24px',flexWrap:'wrap'}}>
        {FEEDS.map((f, i) => (
          <button key={f.name} onClick={() => loadFeed(i)} style={{
            padding:'8px 16px',borderRadius:'8px',fontSize:'13px',fontWeight:'500',cursor:'pointer',
            background: active===i ? '#0D1B2A' : 'white',
            color: active===i ? 'white' : '#3D5166',
            border: active===i ? '1px solid transparent' : '1px solid #E8DFD0'
          }}>{f.name}</button>
        ))}
      </div>
      {loading ? <div style={{color:'#9AA0A6',fontFamily:'IBM Plex Mono,monospace',fontSize:'12px'}}>Lädt News...</div> : (
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          {news.map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" style={{
              background:'white',borderRadius:'10px',padding:'16px 20px',
              border:'1px solid #E8DFD0',borderLeft:'4px solid #C8392B',
              textDecoration:'none',display:'block'
            }}>
              <div style={{fontSize:'14px',fontWeight:'600',color:'#0D1B2A',marginBottom:'4px',lineHeight:'1.4'}}>{item.title}</div>
              <div style={{fontSize:'11px',color:'#9AA0A6',fontFamily:'IBM Plex Mono,monospace'}}>
                {new Date(item.pubDate).toLocaleString('de-DE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})} · {FEEDS[active].name}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
