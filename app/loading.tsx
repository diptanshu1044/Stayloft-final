// app/loading.tsx
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted to-background animate-fadeIn">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-[6px] border-muted border-t-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-primary animate-pulse" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Getting things ready…</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            StayLoft is preparing your experience. This won’t take long!
          </p>
        </div>
      </div>
    </div>
  )
}
