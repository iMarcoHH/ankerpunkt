'use client'
import { useEffect, useState } from 'react'

const FEEDS = [
  { name: 'Tagesschau', url: 'https://www.tagesschau.de/xml/rss2/' },
  { name: 'Spiegel Wirtschaft', url: 'https://www.spiegel.de/wirtschaft/index.rss' },
  { name: 'Handelsblatt', url: 'https://www.handelsblatt.com/contentexport/feed/schlagzeilen' },
]

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => { loadFeed(0) }, [])

  async function loadFeed(idx: number) {
    setLoading(true)
    setError('')
    setActive(idx)
    setNews([])
    try {
      // Use rss2json API - free, no CORS issues
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FEEDS[idx].url)}&api_key=&count=25&order_by=pubDate`
      const res = await fetch(apiUrl)
      const data = await res.json()
      if (data.status === 'ok' && data.items?.length > 0) {
        setNews(data.items)
      } else {
        // Fallback: try allorigins proxy
        const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(FEEDS[idx].url)}`
        const res2 = await fetch(proxy)
        const raw = await res2.json()
        // Parse XML
        const parser = new DOMParser()
        const xml = parser.parseFromString(raw.contents, 'text/xml')
        const items = Array.from(xml.querySelectorAll('item')).slice(0, 20).map(item => ({
          title: item.querySelector('title')?.textContent || '',
          link: item.querySelector('link')?.textContent || '',
          pubDate: item.querySelector('pubDate')?.textContent || '',
          description: item.querySelector('description')?.textContent || '',
        }))
        setNews(items)
      }
    } catch (e) {
      setError('News konnten nicht geladen werden.')
    }
    setLoading(false)
  }

  return (
    <div style={{maxWidth:'800px'}}>
      <div style={{marginBottom:'24px'}}>
        <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:'11px',color:'#C8392B',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'4px'}}>// Live</div>
        <h1 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'2.5rem',letterSpacing:'0.08em',color:'#0D1B2A'}}>WIRTSCHAFTS-NEWS</h1>
      </div>
      <div style={{display:'flex',gap:'8px',marginBottom:'24px',flexWrap:'wrap'}}>
        {FEEDS.map((f, i) => (
          <button key={f.name} onClick={() => loadFeed(i)} style={{
            padding:'8px 18px',borderRadius:'100px',fontSize:'13px',fontWeight:'500',cursor:'pointer',
            background: active===i ? '#0D1B2A' : 'white',
            color: active===i ? 'white' : '#3D5166',
            border: active===i ? '1px solid transparent' : '1px solid #E8DFD0',
            transition:'all 0.15s'
          }}>{f.name}</button>
        ))}
      </div>
      {loading && (
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{background:'white',borderRadius:'10px',padding:'16px 20px',border:'1px solid #E8DFD0',borderLeft:'4px solid #E8DFD0'}}>
              <div style={{height:'14px',background:'#E8DFD0',borderRadius:'4px',marginBottom:'8px',width:'80%'}}/>
              <div style={{height:'10px',background:'#F4F2EE',borderRadius:'4px',width:'40%'}}/>
            </div>
          ))}
        </div>
      )}
      {error && <div style={{color:'#C8392B',fontFamily:'IBM Plex Mono,monospace',fontSize:'12px',padding:'16px',background:'rgba(200,57,43,0.05)',borderRadius:'8px'}}>{error}</div>}
      {!loading && news.length > 0 && (
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          {news.map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" style={{
              background:'white',borderRadius:'10px',padding:'16px 20px',
              border:'1px solid #E8DFD0',borderLeft:'4px solid #C8392B',
              textDecoration:'none',display:'block',
              transition:'box-shadow 0.15s, transform 0.15s'
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow='0 4px 16px rgba(13,27,42,0.1)'; (e.currentTarget as HTMLElement).style.transform='translateY(-1px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow='none'; (e.currentTarget as HTMLElement).style.transform='none' }}
            >
              <div style={{fontSize:'14px',fontWeight:'600',color:'#0D1B2A',marginBottom:'6px',lineHeight:'1.4'}}>{item.title}</div>
              <div style={{fontSize:'11px',color:'#9AA0A6',fontFamily:'IBM Plex Mono,monospace',display:'flex',gap:'12px',alignItems:'center'}}>
                <span>{item.pubDate ? new Date(item.pubDate).toLocaleString('de-DE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : ''}</span>
                <span style={{color:'#E8DFD0'}}>·</span>
                <span>{FEEDS[active].name}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
