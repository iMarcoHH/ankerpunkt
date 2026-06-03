'use client'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react'
import { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react'

function DockItem({ children, className='', onClick, mouseX, spring, distance, magnification, baseItemSize }: any) {
  const ref = useRef<HTMLDivElement>(null)
  const isHovered = useMotionValue(0)
  const mouseDistance = useTransform(mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize }
    return val - rect.x - baseItemSize / 2
  })
  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize])
  const size = useSpring(targetSize, spring)
  const isActive = className.includes('active-nav')
  return (
    <motion.div ref={ref} style={{ width: size, height: size, position:'relative', display:'inline-flex', alignItems:'center', justifyContent:'center', borderRadius:'12px', background: isActive ? '#C8392B' : 'rgba(255,255,255,0.08)', border: isActive ? '1px solid #C8392B' : '1px solid rgba(255,255,255,0.1)', cursor:'pointer', outline:'none', boxShadow: isActive ? '0 4px 16px rgba(200,57,43,0.3)' : '0 2px 8px rgba(0,0,0,0.2)' }}
      onHoverStart={() => isHovered.set(1)} onHoverEnd={() => isHovered.set(0)}
      onClick={onClick} tabIndex={0} role="button">
      {Children.map(children, (child: any) => cloneElement(child, { isHovered }))}
    </motion.div>
  )
}

function DockLabel({ children, ...rest }: any) {
  const { isHovered } = rest
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const unsub = isHovered.on('change', (v: number) => setIsVisible(v === 1))
    return () => unsub()
  }, [isHovered])
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div initial={{opacity:0,y:0}} animate={{opacity:1,y:-10}} exit={{opacity:0,y:0}}
          transition={{duration:0.15}}
          style={{position:'absolute',top:'-2rem',left:'50%',transform:'translateX(-50%)',whiteSpace:'nowrap',borderRadius:'6px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(13,27,42,0.95)',padding:'3px 8px',fontSize:'11px',color:'#fff',backdropFilter:'blur(8px)',zIndex:999}}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DockIcon({ children }: any) {
  return <div style={{display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.9)'}}>{children}</div>
}

export default function Dock({ items, className='', spring={mass:0.1,stiffness:150,damping:12}, magnification=70, distance=150, panelHeight=64, dockHeight=200, baseItemSize=48 }: any) {
  const mouseX = useMotionValue(Infinity)
  const isHovered = useMotionValue(0)
  const maxHeight = useMemo(() => Math.max(dockHeight, magnification + magnification/2 + 4), [magnification, dockHeight])
  const heightRow = useTransform(isHovered, [0,1], [panelHeight, maxHeight])
  const height = useSpring(heightRow, spring)
  return (
    <motion.div style={{height, display:'flex', alignItems:'center', margin:'0 0.5rem'}}>
      <motion.div
        onMouseMove={({pageX}) => { isHovered.set(1); mouseX.set(pageX) }}
        onMouseLeave={() => { isHovered.set(0); mouseX.set(Infinity) }}
        style={{position:'absolute',bottom:'0.5rem',left:'50%',transform:'translateX(-50%)',display:'flex',alignItems:'flex-end',gap:'10px',borderRadius:'20px',background:'rgba(13,27,42,0.88)',border:'1px solid rgba(255,255,255,0.1)',padding:'0 12px 10px',backdropFilter:'blur(24px)',boxShadow:'0 8px 40px rgba(0,0,0,0.4)',height:panelHeight}}>
        {items.map((item: any, i: number) => (
          <DockItem key={i} onClick={item.onClick} className={item.className} mouseX={mouseX}
            spring={spring} distance={distance} magnification={magnification} baseItemSize={baseItemSize}>
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  )
}
