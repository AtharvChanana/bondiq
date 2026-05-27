"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cn } from "@/shared/utils/cn"

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn(className)} {...props} />
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("flex gap-1 overflow-x-auto", className)}
      style={{ borderBottom: '4px solid #333333', paddingBottom: '0', background: 'transparent' }}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Tab>) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "flex-shrink-0 cursor-pointer select-none",
        "transition-all duration-100",
        "data-[selected]:bg-[#CCFF00] data-[selected]:text-black data-[selected]:border-black data-[selected]:[box-shadow:4px_4px_0px_#000000] data-[selected]:translate-x-[-2px] data-[selected]:translate-y-[-2px]",
        "data-[highlighted]:text-white",
        className
      )}
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        padding: '8px 16px',
        border: '2px solid transparent',
        borderRadius: 0,
        background: 'transparent',
        outline: 'none',
        whiteSpace: 'nowrap',
        color: '#888888',
      }}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Panel>) {
  return (
    <TabsPrimitive.Panel
      className={cn("outline-none mt-6", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
