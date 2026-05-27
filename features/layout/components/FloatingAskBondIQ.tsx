"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Bot } from "lucide-react"
import { useRouter } from "next/navigation"

export function FloatingAskBondIQ() {
  const router = useRouter()
  const constraintsRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  return (
    <>
      <div 
        ref={constraintsRef} 
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 9999 }} 
      />
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => {
          isDragging.current = true
        }}
        onDragEnd={() => {
          setTimeout(() => {
            isDragging.current = false
          }, 150)
        }}
        whileHover={{ scale: 1.1, boxShadow: '4px 4px 0px #CCFF00' }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          if (isDragging.current) {
            e.preventDefault()
            e.stopPropagation()
            return
          }
          router.push("/chat")
        }}
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          width: '56px',
          height: '56px',
          background: '#000000',
          border: '3px solid #CCFF00',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          pointerEvents: 'auto',
          zIndex: 10000,
          boxShadow: '0px 0px 0px #CCFF00', // for animate transition
        }}
      >
        <Bot size={24} color="#CCFF00" />
      </motion.div>
    </>
  )
}
