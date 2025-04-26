"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { updateUserRole } from "@/actions/user.action"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function UserTypeModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkRole = async () => {
      const res = await axios.get("/api/user/role")
      console.log("res", res.data)
      if (res.data.role === "NONE") setOpen(true)
      setLoading(false)
    }

    checkRole()
  }, [])

  const handleSelectRole = async (role: "TENANT" | "OWNER") => {
    try {
      const result = await updateUserRole(role);
      if (result.success) {
        setOpen(false);
        router.refresh();
      } else {
        console.error("Failed to update role:", result.error);
        // You might want to show an error toast here
      }
    } catch (error) {
      console.error("Error updating role:", error);
      // You might want to show an error toast here
    }
  }

  if (loading) return null

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <DialogTitle>Select your user type</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={() => handleSelectRole("TENANT")}>I'm a Tenant</Button>
          <Button onClick={() => handleSelectRole("OWNER")} variant="secondary">
            I'm an Owner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
