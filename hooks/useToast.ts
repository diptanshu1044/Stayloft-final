import * as React from "react"
import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner"

interface ToastProps {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive" // Kept for API compatibility
  action?: {
    label: string
    onClick: () => void
  }
}

// Re-export the Toaster component from Sonner
export const Toaster = SonnerToaster

type ToastFunction = {
  (props: ToastProps): string | number
  success: (props: Omit<ToastProps, "variant">) => string | number
  error: (props: Omit<ToastProps, "variant">) => string | number
  info: (props: Omit<ToastProps, "variant">) => string | number
  warning: (props: Omit<ToastProps, "variant">) => string | number
  dismiss: (id?: string) => void
}

// Create a toast function with variants
const toast = ((props: ToastProps) => {
  const { title, description, action } = props
  
  return sonnerToast(title as string, {
    description,
    position: "bottom-right",
    duration: 5000,
    action: action ? {
      label: action.label,
      onClick: action.onClick
    } : undefined,
  })
}) as ToastFunction

// Add variant methods
toast.success = (props) => {
  const { title, description, action } = props
  return sonnerToast.success(title as string, {
    description,
    position: "bottom-right",
    duration: 5000,
    action: action ? {
      label: action.label,
      onClick: action.onClick
    } : undefined,
  })
}

toast.error = (props) => {
  const { title, description, action } = props
  return sonnerToast.error(title as string, {
    description,
    position: "bottom-right",
    duration: 5000,
    action: action ? {
      label: action.label,
      onClick: action.onClick
    } : undefined,
  })
}

toast.info = (props) => {
  const { title, description, action } = props
  return sonnerToast.info(title as string, {
    description,
    position: "bottom-right",
    duration: 5000,
    action: action ? {
      label: action.label,
      onClick: action.onClick
    } : undefined,
  })
}

toast.warning = (props) => {
  const { title, description, action } = props
  return sonnerToast.warning(title as string, {
    description,
    position: "bottom-right",
    duration: 5000,
    action: action ? {
      label: action.label,
      onClick: action.onClick
    } : undefined,
  })
}

// Add the dismiss method
toast.dismiss = sonnerToast.dismiss

function useToast() {
  return {
    toast,
    dismiss: toast.dismiss
  }
}

export { useToast, toast }
