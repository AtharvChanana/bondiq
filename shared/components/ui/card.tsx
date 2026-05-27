import { cn } from "@/shared/utils/cn"

function Card({ className, style, ...props }: React.ComponentProps<"div"> & { style?: React.CSSProperties }) {
  return (
    <div
      data-slot="card"
      className={cn(className)}
      style={{
        background: '#111111',
        color: '#FFFFFF',
        border: '4px solid #FFFFFF',
        boxShadow: '8px 8px 0px #FFFFFF',
        borderRadius: 0,
        ...style,
      }}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 px-5 py-4", className)}
      style={{ borderBottom: '4px solid #FFFFFF' }}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-bold leading-tight", className)}
      style={{
        fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#FFFFFF',
      }}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-[#777777]", className)}
      style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", fontSize: '13px' }}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-5 py-4", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-5 py-4", className)}
      style={{ borderTop: '4px solid #FFFFFF' }}
      {...props}
    />
  )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
