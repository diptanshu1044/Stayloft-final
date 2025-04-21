import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export default function AuthLayout({ children}: { children: ReactNode}) {
  return (
    <>
      {children}
    </>
  )
}
