"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, User, Camera, Phone, Heart, Info, MessageSquare, X, MapPin, Hash, Users } from "lucide-react"
import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import type { CreatePersonInput } from "@/features/people/types"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { RELATIONSHIP_TYPES } from "@/shared/constants/relationship-types"

const PersonFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.enum(RELATIONSHIP_TYPES),
  avatar: z.string().optional(),
  location: z.string().optional(),
  tags: z.string().optional(),
  phone: z.string().optional(),
  birthday: z.string().optional(),
  knownSince: z.string().optional(),
  howWeMet: z.string().optional(),
  currentSituation: z.string().optional(),
  whatMattersToThem: z.string().optional(),
})

type PersonFormInput = z.infer<typeof PersonFormSchema>

interface AddPersonModalProps {
  onAdd: (data: CreatePersonInput) => Promise<void>
}

export function AddPersonModal({ onAdd }: AddPersonModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const form = useForm<PersonFormInput>({
    resolver: zodResolver(PersonFormSchema),
    defaultValues: { relationship: "friend" },
  })

  async function handleImportContact() {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const props = ['name', 'tel']
        const opts = { multiple: false }
        const contacts = await (navigator as any).contacts.select(props, opts)
        if (contacts && contacts.length > 0) {
          const contact = contacts[0]
          if (contact.name && contact.name.length > 0) {
            form.setValue("name", contact.name[0])
          }
          if (contact.tel && contact.tel.length > 0) {
            form.setValue("phone", contact.tel[0])
          }
          toast.success("Contact imported successfully!")
        }
      } catch (err) {
        toast.error("Failed to import contact or permission denied.")
      }
    } else {
      toast.error("Contact import is not supported on this device/browser.")
    }
  }

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

  async function onSubmit(values: PersonFormInput) {
    setLoading(true)
    try {
      await onAdd(values)
      toast.success("Person added successfully!")
      form.reset({ relationship: "friend" })
      setAvatarPreview(null)
      setOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add person")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#000000', color: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', padding: '12px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'transform 0.1s, box-shadow 0.1s' }} className="hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_#333333] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_0px_#333333]">
        <Plus size={16} /> ADD PERSON
      </DialogTrigger>
      <DialogContent style={{ background: '#FFFFFF', border: '4px solid #000000', boxShadow: '16px 16px 0px #333333', padding: 0, gap: 0, maxWidth: '800px', width: '90vw', maxHeight: '90vh', overflowY: 'auto' }} className="rounded-none sm:rounded-none">
        <DialogHeader style={{ background: '#CCFF00', borderBottom: '4px solid #000000', padding: '24px' }}>
          <DialogTitle style={{ fontFamily: "var(--font-headline, 'Barlow Condensed', sans-serif)", fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', margin: '0 0 8px 0', lineHeight: 1 }}>
            ADD NEW CONNECTION
          </DialogTitle>
          <p style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#333333', margin: 0 }}>
            REGISTER A NEW PERSON IN YOUR CIRCLE TO BEGIN EXTRACTING INSIGHTS AND TRACKING RELATIONSHIP DETAILS.
          </p>
        </DialogHeader>

        <form style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }} onSubmit={form.handleSubmit(onSubmit)}>
          <button
            type="button"
            onClick={handleImportContact}
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#FFFFFF', color: '#000000', border: '4px dashed #000000', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
          >
            <Users size={16} /> IMPORT FROM PHONE
          </button>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={14} color="#000000" /> FULL NAME (REQUIRED)
              </label>
              <input 
                style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none' }}
                placeholder="E.G. SARAH JENKINS"
                {...form.register("name")} 
              />
              {form.formState.errors.name && (
                <p style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '10px', fontWeight: 700, color: '#FF3333', textTransform: 'uppercase' }}>{form.formState.errors.name.message}</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="#000000" /> PHONE NUMBER (OPTIONAL)
              </label>
              <input 
                style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none' }}
                placeholder="+1 (555) 000-0000"
                {...form.register("phone")} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={14} color="#000000" /> RELATIONSHIP (REQUIRED)
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
                <Camera size={14} color="#000000" /> PHOTO (OPTIONAL)
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
                <MapPin size={14} color="#000000" /> LOCATION (OPTIONAL)
              </label>
              <input 
                style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none', textTransform: 'uppercase' }}
                placeholder="E.G. CHICAGO, IL"
                {...form.register("location")} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Hash size={14} color="#000000" /> TAGS (COMMA SEPARATED)
              </label>
              <input 
                style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none', textTransform: 'uppercase' }}
                placeholder="E.G. FOUNDER, COLLEGE, TECH"
                {...form.register("tags")} 
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={14} color="#000000" /> BIRTHDAY (OPTIONAL)
              </label>
              <input 
                style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 700, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none' }}
                placeholder="E.G. MARCH 12"
                {...form.register("birthday")} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={14} color="#000000" /> KNOWN SINCE (OPTIONAL)
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
              <Info size={14} color="#000000" /> HOW YOU MET (OPTIONAL)
            </label>
            <textarea 
              style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none', minHeight: '80px', resize: 'vertical' }}
              placeholder="DESCRIBE HOW OR WHERE YOU FIRST CROSSED PATHS..."
              {...form.register("howWeMet")} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={14} color="#000000" /> CURRENT SITUATION (OPTIONAL)
            </label>
            <textarea 
              style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none', minHeight: '80px', resize: 'vertical' }}
              placeholder="E.G. RELOCATED TO CHICAGO, WORKING AT A TECH STARTUP, LOVES CHECKING OUT LOCAL ROASTERIES."
              {...form.register("currentSituation")} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={14} color="#000000" /> WHAT MATTERS TO THEM (OPTIONAL)
            </label>
            <textarea 
              style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '14px', fontWeight: 600, padding: '16px', background: '#FFFFFF', border: '4px solid #000000', color: '#000000', outline: 'none', minHeight: '80px', resize: 'vertical' }}
              placeholder="WHAT ARE THEIR PASSIONS, MAJOR GOALS, OR VALUES?"
              {...form.register("whatMattersToThem")} 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#000000', color: '#FFFFFF', border: '4px solid #000000', boxShadow: '8px 8px 0px #333333', padding: '16px 32px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', transition: 'transform 0.1s, box-shadow 0.1s', opacity: loading ? 0.7 : 1 }}
            className="hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_#333333] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_0px_#333333]"
          >
            {loading ? "ADDING CONNECTION..." : "SAVE CONNECTION"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

