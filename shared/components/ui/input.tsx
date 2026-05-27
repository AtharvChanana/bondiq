import { cn } from "@/shared/utils/cn"

function Input({ className, style, ...props }: React.ComponentProps<"input"> & { style?: React.CSSProperties }) {
  return (
    <input
      data-slot="input"
      className={cn("w-full disabled:opacity-50", className)}
      style={{
        background: '#111111',
        color: '#FFFFFF',
        border: '4px solid #FFFFFF',
        borderRadius: 0,
        fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
        fontSize: '13px',
        padding: '10px 14px',
        outline: 'none',
        transition: 'border-color 0.1s ease',
        ...style,
      }}
      {...props}
    />
  )
}

export { Input }
