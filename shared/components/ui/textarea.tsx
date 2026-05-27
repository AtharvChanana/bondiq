import { cn } from "@/shared/utils/cn"

function Textarea({ className, style, ...props }: React.ComponentProps<"textarea"> & { style?: React.CSSProperties }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn("w-full resize-y disabled:opacity-50", className)}
      style={{
        background: '#111111',
        color: '#FFFFFF',
        border: '4px solid #FFFFFF',
        borderRadius: 0,
        fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)",
        fontSize: '14px',
        padding: '10px 14px',
        outline: 'none',
        minHeight: '120px',
        transition: 'border-color 0.1s ease',
        ...style,
      }}
      {...props}
    />
  )
}

export { Textarea }
