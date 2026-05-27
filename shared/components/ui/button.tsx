import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/utils/cn"

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap",
    "font-bold uppercase tracking-wider select-none",
    "border-4",
    "transition-all duration-100 ease-out",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary: Black bg + white text + white border — matches "JOIN BETA" from screenshot
        default: [
          "bg-black text-white border-white",
          "[box-shadow:6px_6px_0px_#FFFFFF]",
          "hover:translate-x-[-3px] hover:translate-y-[-3px] hover:[box-shadow:9px_9px_0px_#CCFF00]",
          "active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:3px_3px_0px_#FFFFFF]",
        ].join(" "),
        // Outline: White bg + black text + black border
        outline: [
          "bg-white text-black border-black",
          "[box-shadow:6px_6px_0px_#000000]",
          "hover:translate-x-[-3px] hover:translate-y-[-3px] hover:[box-shadow:9px_9px_0px_#CCFF00]",
          "active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:3px_3px_0px_#000000]",
        ].join(" "),
        // Ghost: transparent, border on hover
        ghost: [
          "bg-transparent text-white border-transparent",
          "hover:bg-white hover:text-black hover:border-white",
          "hover:[box-shadow:4px_4px_0px_#CCFF00]",
        ].join(" "),
        // Secondary: dark bg + white border
        secondary: [
          "bg-[#111111] text-white border-white",
          "[box-shadow:6px_6px_0px_#FFFFFF]",
          "hover:translate-x-[-3px] hover:translate-y-[-3px] hover:[box-shadow:9px_9px_0px_#CCFF00]",
        ].join(" "),
        // Destructive: red outline
        destructive: [
          "bg-black text-red-400 border-red-500",
          "[box-shadow:4px_4px_0px_#FFFFFF]",
          "hover:bg-red-600 hover:text-white hover:border-red-600",
        ].join(" "),
        link: "border-transparent bg-transparent text-white underline-offset-4 hover:underline [box-shadow:none]",
      },
      size: {
        default: "h-10 px-5 text-xs",
        xs: "h-7 px-3 text-[10px] border-2 [box-shadow:3px_3px_0px_#FFFFFF]",
        sm: "h-8 px-4 text-[11px]",
        lg: "h-12 px-7 text-sm",
        icon: "size-10 p-0",
        "icon-xs": "size-7 p-0 border-2",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  style,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & { style?: React.CSSProperties }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)", borderRadius: 0, ...style }}
      {...props}
    />
  )
}

export { Button, buttonVariants }
