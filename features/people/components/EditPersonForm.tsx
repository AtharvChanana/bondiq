"use client"

import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Save, User, Camera, Phone, Heart, Info, MessageSquare, X, MapPin, Hash } from "lucide-react"
import { useState, useRef } from "react"

import type { PersonDetail, UpdatePersonInput } from "@/features/people/types"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { RELATIONSHIP_TYPES } from "@/shared/constants/relationship-types"

interface EditPersonFormProps {
  person: PersonDetail
  onSave: (data: UpdatePersonInput) => Promise<void>
}

export function EditPersonForm({ person, onSave }: EditPersonFormProps) {
  const form = useForm<UpdatePersonInput>({ defaultValues: person })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(person.avatar ?? null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setAvatarPreview(result)
      form.setValue("avatar", result)
    }
    reader.readAsDataURL(file)
  }

  function clearAvatar() {
    setAvatarPreview(null)
    form.setValue("avatar", "")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function submit(values: UpdatePersonInput) {
    try {
      await onSave(values)
      toast.success("Profile updated successfully!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile")
    }
  }

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} onSubmit={form.handleSubmit(submit)}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={14} color="#000000" /> FULL NAME
          </label>
          <input 
            style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none' }}
            placeholder="E.G. SARAH JENKINS"
            {...form.register("name")} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={14} color="#000000" /> RELATIONSHIP
          </label>
          <div style={{ position: 'relative' }}>
            <select 
              style={{ width: '100%', fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none', appearance: 'none', cursor: 'pointer', textTransform: 'uppercase' }}
              {...form.register("relationship")}
            >
              {RELATIONSHIP_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
            <div style={{ pointerEvents: 'none', position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }}>
              <svg fill="#000000" height="16" width="16" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={14} color="#000000" /> PHOTO
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {avatarPreview ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '4px solid #000000', background: '#F5F5F5' }}>
              <img src={avatarPreview} alt="Preview" style={{ width: '56px', height: '56px', objectFit: 'cover', border: '2px solid #000000' }} />
              <span style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, color: '#333333', flex: 1, textTransform: 'uppercase' }}>PHOTO SELECTED</span>
              <button type="button" onClick={clearAvatar} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X size={16} color="#FF3333" strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#FFFFFF', color: '#000000', border: '4px dashed #000000', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
            >
              <Camera size={14} /> CHOOSE PHOTO FROM DEVICE
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={14} color="#000000" /> PHONE NUMBER
          </label>
          <input 
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none' }}
            placeholder="+1 (555) 000-0000"
            {...form.register("phone")} 
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} color="#000000" /> LOCATION
          </label>
          <input 
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none', textTransform: 'uppercase' }}
            placeholder="E.G. CHICAGO, IL"
            {...form.register("location")} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Hash size={14} color="#000000" /> TAGS
          </label>
          <input 
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none', textTransform: 'uppercase' }}
            placeholder="E.G. FOUNDER, TECH"
            {...form.register("tags")} 
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={14} color="#000000" /> BIRTHDAY
          </label>
          <input 
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none' }}
            placeholder="E.G. MARCH 12"
            {...form.register("birthday")} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={14} color="#000000" /> KNOWN SINCE
          </label>
          <input 
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none' }}
            placeholder="E.G. 2018 OR '5 YEARS'"
            {...form.register("knownSince")} 
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={14} color="#000000" /> HOW YOU MET
        </label>
        <textarea 
          style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none', minHeight: '100px', resize: 'vertical' }}
          placeholder="DESCRIBE HOW OR WHERE YOU FIRST CROSSED PATHS..."
          {...form.register("howWeMet")} 
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={14} color="#000000" /> CURRENT SITUATION
        </label>
        <textarea 
          style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none', minHeight: '120px', resize: 'vertical' }}
          placeholder="E.G. JUST STARTED A NEW BUSINESS, LIVES IN AUSTIN, TRAINING FOR A HALF-MARATHON."
          {...form.register("currentSituation")} 
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart size={14} color="#000000" /> WHAT MATTERS TO THEM
        </label>
        <textarea 
          style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none', minHeight: '120px', resize: 'vertical' }}
          placeholder="E.G. FAMILY-ORIENTED, LOVES COFFEE TASTING, PASSIONATE ABOUT MENTAL HEALTH, VALUES DEEP CATCHUPS."
          {...form.register("whatMattersToThem")} 
        />
      </div>

      <div style={{ paddingTop: '16px' }}>
        <button 
          type="submit" 
          style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#CCFF00', color: '#000000', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', padding: '16px 32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', transition: 'transform 0.1s, box-shadow 0.1s' }}
          className="hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_#333333] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_0px_#333333]"
        >
          <Save size={18} /> SAVE CHANGES
        </button>
      </div>
    </form>
  )
}

