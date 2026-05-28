import { Suspense } from "react"
import Link from "next/link"
import { SignupForm } from "@/features/auth/components/SignupForm"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"
import { BondiqLogo } from "@/shared/components/BondiqLogo"

export function SignupPage() {
  return (
    <main className="flex min-h-[100dvh] bg-[#121212] relative overflow-hidden">
      {/* Right: Bold brand panel (flipped from login) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-8 md:p-12 bg-[#121212] w-full">
        {/* Mobile logo */}
        <Link href="/" className="flex md:hidden" style={{ alignItems: 'center', gap: '10px', marginBottom: '40px', textDecoration: 'none' }}>
          <BondiqLogo size={40} labelColor="#FFFFFF" labelSize="22px" />
        </Link>

        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '36px' }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FFFFFF', marginBottom: '8px' }}>
              — CREATE ACCOUNT
            </p>
            <h2 
              className="text-[48px] sm:text-[56px] font-normal uppercase leading-[0.9] text-white m-0"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              JOIN UP
            </h2>
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <SignupForm />
          </Suspense>
        </div>
      </div>

      {/* Right: Volt panel */}
      <div
        style={{
          background: '#FFFFFF',
          borderLeft: '4px solid #000000',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="hidden md:flex w-1/2 flex-col justify-between"
      >
        {/* Big watermark */}
        <div style={{
          position: 'absolute',
          bottom: '-40px',
          right: '-20px',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '280px',
          color: '#000000',
          opacity: 0.05,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}>01</div>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <BondiqLogo size={44} labelColor="#000000" labelSize="26px" />
        </Link>

        {/* Headline */}
        <div>
          <div style={{ transform: 'rotate(2deg)', display: 'inline-block', background: '#000000', color: '#FFFFFF', padding: '4px 12px', fontFamily: "'Space Mono', monospace", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', border: '2px solid #000000', marginBottom: '20px', boxShadow: '3px 3px 0px rgba(0,0,0,0.3)' }}>
            FREE TO START
          </div>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(60px, 8vw, 110px)',
            fontWeight: 400,
            textTransform: 'uppercase',
            lineHeight: 0.85,
            color: '#000000',
            margin: '0 0 20px',
          }}>
            START BUILDING.
          </h1>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontStyle: 'italic', color: '#000000', fontWeight: 600, lineHeight: 1.5 }}>
            Your network is your net worth. Start tracking it today.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '0', border: '3px solid #000000' }}>
          {[['∞', 'PEOPLE'], ['AI', 'POWERED'], ['0$', 'TO START']].map(([val, label], i) => (
            <div key={label} style={{ flex: 1, padding: '12px 16px', borderRight: i < 2 ? '3px solid #000000' : 'none', background: i === 1 ? '#000000' : 'transparent' }}>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '28px', color: i === 1 ? '#FFFFFF' : '#000000', margin: 0, lineHeight: 1 }}>{val}</p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: i === 1 ? '#FFFFFF' : '#000000', marginTop: '4px' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
