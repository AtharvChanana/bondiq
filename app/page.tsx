"use client"

import Link from "next/link"
import { ArrowRight, Star, Clock, Brain, Rocket } from "lucide-react"

// Hardcoded reviews
const REVIEWS = [
  { text: "BondIQ completely changed how I manage my professional network.", author: "Sarah J." },
  { text: "The only CRM that doesn't feel like a spreadsheet.", author: "Michael T." },
  { text: "Never missed a birthday or follow-up since using this.", author: "Elena R." },
  { text: "It's like having a second brain for all my relationships.", author: "David W." },
  { text: "Brutally effective. Straight to the point.", author: "Alex K." },
  { text: "My team thinks I have a perfect memory now.", author: "Priya S." },
]

export default function LandingPage() {
  return (
    <div style={{ background: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation Bar */}
      <header style={{ borderBottom: '4px solid #FFFFFF', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="#000000" strokeWidth="2.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '18px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.1em' }}>BONDIQ</span>
        </div>
        <Link 
          href="/login"
          style={{ 
            fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", 
            fontSize: '12px', 
            fontWeight: 700, 
            background: '#FFFFFF', 
            color: '#000000', 
            padding: '8px 16px', 
            textDecoration: 'none',
            border: '2px solid #FFFFFF',
            textTransform: 'uppercase',
            boxShadow: '4px 4px 0px #CCFF00', // Small touch of green
            transition: 'transform 0.1s, box-shadow 0.1s'
          }}
          className="hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#CCFF00] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#CCFF00]"
        >
          LOG IN
        </Link>
      </header>

      {/* Hero Section */}
      <main style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-block', background: '#CCFF00', color: '#000000', border: '2px solid #000000', padding: '6px 12px', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', transform: 'rotate(-2deg)', marginBottom: '32px' }}>
            PRIVATE BETA ACTIVE
          </div>
        </div>

        <h1 style={{ 
          fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", 
          fontSize: 'clamp(60px, 12vw, 160px)', 
          fontWeight: 900, 
          lineHeight: 0.85, 
          textTransform: 'uppercase', 
          margin: '0 0 24px 0',
          letterSpacing: '-0.02em',
          maxWidth: '1000px'
        }}>
          STOP LOSING TOUCH.
        </h1>

        <p style={{ 
          fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", 
          fontSize: 'clamp(14px, 2vw, 20px)', 
          fontWeight: 700,
          color: '#FFFFFF', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em', 
          maxWidth: '600px', 
          lineHeight: 1.5,
          marginBottom: '48px'
        }}>
          START CONNECTING. THE RELATIONSHIP ENGINE FOR HIGH-OUTPUT BUILDERS.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link 
            href="/signup"
            style={{ 
              fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", 
              fontSize: '14px', 
              fontWeight: 700, 
              background: '#FFFFFF', 
              color: '#000000', 
              padding: '16px 32px', 
              textDecoration: 'none',
              border: '4px solid #FFFFFF',
              boxShadow: '8px 8px 0px #CCFF00', // Green accent shadow
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'transform 0.1s, box-shadow 0.1s'
            }}
            className="hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_#CCFF00] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[4px_4px_0px_#CCFF00]"
          >
            GET STARTED <ArrowRight size={18} />
          </Link>
        </div>
      </main>

      {/* Features Section - "STOP FIGHTING FRICTION" Style */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ 
          fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", 
          fontSize: 'clamp(48px, 8vw, 100px)', 
          fontWeight: 900, 
          lineHeight: 0.85, 
          textTransform: 'uppercase', 
          color: '#FFFFFF',
          marginBottom: '48px',
          maxWidth: '800px'
        }}>
          STOP FORGETTING <span style={{ color: '#555555' }}>DETAILS.</span>
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Card 1 */}
          <div style={{ background: '#FFFFFF', border: '4px solid #000000', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '8px 8px 0px #333333' }}>
            <div style={{ width: '40px', height: '40px', border: '2px solid #000000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} color="#000000" />
            </div>
            <div>
              <h3 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '18px', fontWeight: 700, color: '#000000', textTransform: 'uppercase', marginBottom: '12px' }}>NO MORE SLOW FOLLOW-UPS</h3>
              <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#333333', lineHeight: 1.5, textTransform: 'uppercase' }}>
                LOG INTERACTIONS INSTANTLY. NEVER WONDER WHEN YOU LAST SPOKE OR WHAT YOU TALKED ABOUT.
              </p>
            </div>
          </div>
          
          {/* Card 2 */}
          <div style={{ background: '#FFFFFF', border: '4px solid #000000', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '8px 8px 0px #333333' }}>
            <div style={{ width: '40px', height: '40px', border: '2px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(45deg)' }}>
              <Brain size={20} color="#000000" style={{ transform: 'rotate(-45deg)' }} />
            </div>
            <div>
              <h3 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '18px', fontWeight: 700, color: '#000000', textTransform: 'uppercase', marginBottom: '12px' }}>QUALITY-FIRST AI</h3>
              <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#333333', lineHeight: 1.5, textTransform: 'uppercase' }}>
                OUR AI ANALYZES YOUR NETWORK HEALTH AND SUGGESTS TIMELY NUDGES TO KEEP RELATIONSHIPS WARM.
              </p>
            </div>
          </div>
          
          {/* Card 3 */}
          <div style={{ background: '#FFFFFF', border: '4px solid #000000', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '8px 8px 0px #333333' }}>
            <div style={{ width: '40px', height: '40px', border: '2px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Rocket size={20} color="#000000" />
            </div>
            <div>
              <h3 style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '18px', fontWeight: 700, color: '#000000', textTransform: 'uppercase', marginBottom: '12px' }}>BUILT FOR BUILDERS</h3>
              <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#333333', lineHeight: 1.5, textTransform: 'uppercase' }}>
                PRECISION TRACKING WITH THE FLUIDITY OF A CANVAS. HIGH-OUTPUT NETWORKING WITHOUT THE CLUTTER.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Split Comparison Section - "WHY JOIN NOW?" Style */}
      <section style={{ maxWidth: '1200px', margin: '80px auto', width: '100%', padding: '0 24px' }}>
        <div style={{ background: '#FFFFFF', padding: '24px 32px', border: '4px solid #000000' }}>
          <h2 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 900, textTransform: 'uppercase', color: '#000000', margin: 0, textAlign: 'center' }}>
            WHY BONDIQ?
          </h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', border: '4px solid #000000', borderTop: 'none', background: '#000000' }}>
          
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '4px solid #000000' }}>
            <div style={{ padding: '40px 32px', borderRight: '4px solid #000000', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>THE OLD WAY</span>
              <h3 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 900, color: '#555555', margin: 0, lineHeight: 0.9 }}>SCATTERED NOTES</h3>
            </div>
            <div style={{ background: '#CCFF00', padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', color: '#334400', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>THE BONDIQ WAY</span>
              <h3 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 900, color: '#000000', margin: 0, lineHeight: 0.9 }}>CENTRALIZED INTEL</h3>
            </div>
          </div>
          
          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '4px solid #000000' }}>
            <div style={{ padding: '40px 32px', borderRight: '4px solid #000000', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>THE OLD WAY</span>
              <h3 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 900, color: '#555555', margin: 0, lineHeight: 0.9 }}>FORGETTING DATES</h3>
            </div>
            <div style={{ background: '#CCFF00', padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', color: '#334400', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>THE BONDIQ WAY</span>
              <h3 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 900, color: '#000000', margin: 0, lineHeight: 0.9 }}>TIMELY NUDGES</h3>
            </div>
          </div>
          
          {/* Row 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ padding: '40px 32px', borderRight: '4px solid #000000', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>THE OLD WAY</span>
              <h3 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 900, color: '#555555', margin: 0, lineHeight: 0.9 }}>MANUAL HANDOFF</h3>
            </div>
            <div style={{ background: '#CCFF00', padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', color: '#334400', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>THE BONDIQ WAY</span>
              <h3 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 900, color: '#000000', margin: 0, lineHeight: 0.9 }}>AI SYNTHESIS</h3>
            </div>
          </div>
          
        </div>
      </section>

      {/* Blueprint Section - "PROCESS BLUEPRINT" Style */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 100px auto', width: '100%', padding: '0 24px' }}>
        <div style={{ height: '8px', display: 'flex', marginBottom: '40px' }}>
          <div style={{ flex: 1, background: '#333333' }}></div>
          <div style={{ flex: 1, background: '#CCFF00' }}></div>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', color: '#CCFF00', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TECHNICAL ARCHITECTURE</span>
          <h2 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: 'clamp(48px, 8vw, 100px)', fontWeight: 900, color: '#FFFFFF', margin: '8px 0 0 0', lineHeight: 0.9 }}>PROCESS BLUEPRINT</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          
          {/* Step 1 */}
          <div style={{ position: 'relative', marginTop: '20px' }}>
            <div style={{ 
              position: 'absolute', 
              top: '-16px', 
              left: '20px', 
              background: '#CCFF00', 
              color: '#000000', 
              padding: '4px 12px', 
              fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", 
              fontSize: '11px', 
              fontWeight: 700, 
              border: '2px solid #000000', 
              transform: 'rotate(-4deg)', 
              zIndex: 10 
            }}>
              STEP 01
            </div>
            <div style={{ background: '#FFFFFF', border: '4px solid #000000', padding: '40px 32px', height: '100%', position: 'relative', boxShadow: '8px 8px 0px #333333' }}>
              <h3 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '40px', fontWeight: 900, color: '#000000', margin: '0 0 16px 0', lineHeight: 1 }}>CONNECT</h3>
              <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '15px', fontWeight: 600, color: '#333333', lineHeight: 1.4, textTransform: 'uppercase' }}>
                SYNC YOUR NETWORK DIRECTLY INTO OUR MEMORY ENGINE.
              </p>
              <div style={{ position: 'absolute', bottom: '16px', right: '24px', fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '80px', fontWeight: 900, color: '#F0F0F0', lineHeight: 0.8, zIndex: 0, opacity: 0.8 }}>01</div>
            </div>
          </div>
          
          {/* Step 2 */}
          <div style={{ position: 'relative', marginTop: '20px' }}>
            <div style={{ 
              position: 'absolute', 
              top: '-16px', 
              left: '20px', 
              background: '#CCFF00', 
              color: '#000000', 
              padding: '4px 12px', 
              fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", 
              fontSize: '11px', 
              fontWeight: 700, 
              border: '2px solid #000000', 
              transform: 'rotate(2deg)', 
              zIndex: 10 
            }}>
              STEP 02
            </div>
            <div style={{ background: '#FFFFFF', border: '4px solid #000000', padding: '40px 32px', height: '100%', position: 'relative', boxShadow: '8px 8px 0px #333333' }}>
              <h3 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '40px', fontWeight: 900, color: '#000000', margin: '0 0 16px 0', lineHeight: 1 }}>COMPOSE</h3>
              <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '15px', fontWeight: 600, color: '#333333', lineHeight: 1.4, textTransform: 'uppercase' }}>
                BUILD CONTEXT WITH AI-ASSISTED LOGS THAT FOLLOW YOUR RULES.
              </p>
              <div style={{ position: 'absolute', bottom: '16px', right: '24px', fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '80px', fontWeight: 900, color: '#F0F0F0', lineHeight: 0.8, zIndex: 0, opacity: 0.8 }}>02</div>
            </div>
          </div>
          
          {/* Step 3 */}
          <div style={{ position: 'relative', marginTop: '20px' }}>
            <div style={{ 
              position: 'absolute', 
              top: '-16px', 
              left: '20px', 
              background: '#CCFF00', 
              color: '#000000', 
              padding: '4px 12px', 
              fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", 
              fontSize: '11px', 
              fontWeight: 700, 
              border: '2px solid #000000', 
              transform: 'rotate(-3deg)', 
              zIndex: 10 
            }}>
              STEP 03
            </div>
            <div style={{ background: '#FFFFFF', border: '4px solid #000000', padding: '40px 32px', height: '100%', position: 'relative', boxShadow: '8px 8px 0px #333333' }}>
              <h3 style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '40px', fontWeight: 900, color: '#000000', margin: '0 0 16px 0', lineHeight: 1 }}>EXECUTE</h3>
              <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '15px', fontWeight: 600, color: '#333333', lineHeight: 1.4, textTransform: 'uppercase' }}>
                PUSH TIMELY FOLLOW-UPS STRAIGHT TO YOUR NETWORK. NO FORGETTING.
              </p>
              <div style={{ position: 'absolute', bottom: '16px', right: '24px', fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '80px', fontWeight: 900, color: '#F0F0F0', lineHeight: 0.8, zIndex: 0, opacity: 0.8 }}>03</div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Marquee Section */}
      <section style={{ borderTop: '4px solid #FFFFFF', borderBottom: '4px solid #FFFFFF', padding: '24px 0', overflow: 'hidden', background: '#000000' }}>
        <div className="animate-marquee" style={{ width: 'max-content', display: 'flex' }}>
          {/* Duplicate the array twice to ensure seamless infinite scroll */}
          {[...REVIEWS, ...REVIEWS].map((review, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '0 48px', borderRight: '4px solid #FFFFFF' }}>
              <div style={{ display: 'flex', gap: '4px', marginRight: '16px' }}>
                {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="#CCFF00" color="#CCFF00" />)}
              </div>
              <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '18px', fontWeight: 600, fontStyle: 'italic', margin: 0, paddingRight: '16px' }}>
                "{review.text}"
              </p>
              <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#888888' }}>
                — {review.author}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        <div>© 2026 BONDIQ</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span>MEMORY ENGINE</span>
          <span>SYSTEM v1.0</span>
        </div>
      </footer>
    </div>
  )
}
