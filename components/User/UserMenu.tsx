import Link from "next/link"
import {
  Bell,
  LogOut,
  Settings,
  User,
  LayoutDashboard,
  MessageSquare,
  Sun,
  Moon,
  Laptop,
  HelpCircle,
  UserCheck
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { UserRole, ThemeType } from "@/types"
import { useEffect, useState } from "react"

interface UserMenuProps {
  userType?: UserRole;
  userName?: string;
  userImage?: string;
}

export function UserMenu({ userType = "TENANT", userName = "User", userImage }: UserMenuProps) {
  const { setTheme, theme } = useTheme();
  const dashboardPath = userType === "OWNER" ? "/dashboard" : "/user-dashboard/saved-properties";
  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase();
  
  const [storedAvatar, setStoredAvatar] = useState<string | null>(null);
  
  useEffect(() => {
    // Get avatar from localStorage if available
    const avatar = localStorage.getItem("userAvatar");
    if (avatar) {
      setStoredAvatar(avatar);
    }
    
    // Listen for storage events to update avatar if changed in another tab
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userAvatar") {
        setStoredAvatar(e.newValue);
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={storedAvatar || userImage} alt={userName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">
              {userType === "OWNER" ? "Property Owner" : "Tenant"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={dashboardPath}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`${dashboardPath}/profile`}>
              <User className="mr-2 h-4 w-4" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`${dashboardPath}/verification`}>
              <UserCheck className="mr-2 h-4 w-4" />
              Verification
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Sun className="mr-2 h-4 w-4" />
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as ThemeType)}>
                <DropdownMenuRadioItem value="light">
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <Laptop className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem asChild>
          <Link href={`${dashboardPath}/support`}>
            <HelpCircle className="mr-2 h-4 w-4" />
            Support
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          asChild
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userRole");
          }}
        >
          <Link href="/login" className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
