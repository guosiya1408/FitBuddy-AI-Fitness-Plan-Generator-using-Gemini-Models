"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-xl",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-primary/5 before:to-accent/5 before:opacity-0 before:transition-opacity",
        hover && "hover:before:opacity-100 hover:shadow-2xl hover:border-primary/30 transition-all duration-300",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  )
}
