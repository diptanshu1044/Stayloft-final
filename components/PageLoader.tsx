// components/shared/page-loader.tsx
"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type PageLoaderProps = {
  message?: string
  className?: string
}

export default function PageLoader({ message = "Loading...", className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
