import { useEffect, useRef, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"

import { Footer } from "./Components/Footer"
import { NavBar } from "./Components/NavBar"
import { useAuth } from "./Context/AuthContext"

const BUBBLE_COUNT = 12
let bubbleIdCounter = 0

function createBubble() {
  bubbleIdCounter += 1
  return {
    id: bubbleIdCounter,
    left: Math.random() * 95,
    size: 20 + Math.random() * 70,
    duration: 10 + Math.random() * 12,
    delay: Math.random() * 5,
    drift: -20 + Math.random() * 40,
    popping: false,
  }
}

export default function App() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const showBubbles = ["/", "/register", "/login"].includes(location.pathname)
  const [bubbles, setBubbles] = useState(() =>
    Array.from({ length: BUBBLE_COUNT }, createBubble)
  )
  const bubbleRefs = useRef({})

  useEffect(() => {
    const handleMouseMove = (e) => {
      setBubbles((prev) =>
        prev.map((bubble) => {
          if (bubble.popping) return bubble
          const el = bubbleRefs.current[bubble.id]
          if (!el) return bubble
          const rect = el.getBoundingClientRect()
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          const dx = e.clientX - cx
          const dy = e.clientY - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < rect.width / 2 + 15) {
            return { ...bubble, popping: true }
          }
          return bubble
        })
      )
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const poppingBubbles = bubbles.filter((b) => b.popping)
    if (poppingBubbles.length === 0) return
    const timers = poppingBubbles.map((b) =>
      setTimeout(() => {
        setBubbles((prev) =>
          prev.map((bubble) => (bubble.id === b.id ? createBubble() : bubble))
        )
        delete bubbleRefs.current[b.id]
      }, 1050)
    )
    return () => timers.forEach(clearTimeout)
  }, [bubbles])

  if (loading) return null;

  return (
    <div className={`app${showBubbles ? "" : " app--inner"}`}>
     {showBubbles && (
       <div className="bubbles-wrapper">
        {bubbles.map((bubble) => (
          <span
            key={bubble.id}
            ref={(el) => { bubbleRefs.current[bubble.id] = el }}
            className={`bubble${bubble.popping ? " bubble-pop" : ""}`}
            style={{
              left: `${bubble.left}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              "--dur": `${bubble.duration}s`,
              "--delay": `${bubble.delay}s`,
              "--drift": `${bubble.drift}px`,
            }}
          ></span>
        ))}
       </div>
     )}
     {user && <NavBar />}
     <main className="content">
      <Outlet >

      </Outlet>
     </main>
     <Footer>
      
     </Footer>
    </div>
  )
}