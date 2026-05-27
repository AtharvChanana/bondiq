import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/utils/cn"

const badgeVariants = cva(
  "inline-flex items-center font-bold uppercase tracking-wider border-2 border-black",
  {
    variants: {
      variant: {
        default: "bg-[#CCFF00] text-black",
        secondary: "bg-white text-black",
        outline: "bg-transparent text-white border-white",
        destructive: "bg-white text-red-600 border-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  style,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { style?: React.CSSProperties }) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '10px',
        letterSpacing: '0.1em',
        padding: '2px 8px',
        borderRadius: 0,
        ...style,
      }}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
