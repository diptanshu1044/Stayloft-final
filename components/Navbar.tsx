"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Building, Home, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/ModeToggle";
import { UserMenu } from "@/components/User/UserMenu";
import { UserRole } from "@/types";
import {
  SignedIn,
  SignedOut,
  useAuth,
  useClerk,
  UserButton,
} from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";
import { User } from "@prisma/client";

const Navbar = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useClerk();
  const auth = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/user");
        if (!res.status) {
          toast.error("Failed to fetch user data");
        }
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    console.log("User data changed:", user);
  }, [user]);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 transition-all duration-300  shadow-md py-2 bg-background">
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Building className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">StayLoft</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/flats"
            className="text-foreground hover:text-primary font-medium"
          >
            Flats
          </Link>
          <Link
            href="/pgs"
            className="text-foreground hover:text-primary font-medium"
          >
            PGs
          </Link>
          <Link
            href="/hostels"
            className="text-foreground hover:text-primary font-medium"
          >
            Hostels
          </Link>
          <Link
            href="/about"
            className="text-foreground hover:text-primary font-medium"
          >
            About
          </Link>
        </nav>

        {/* Auth Buttons or User Menu */}
        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />
          <SignedIn>
            <UserMenu userType={user?.role} userName={user?.name} />
            <Button variant="ghost" onClick={() => signOut()}>
              Sign Out
            </Button>
            {user?.role === "OWNER" && (
              <Button className="flex items-center gap-2" asChild>
                <Link href="/dashboard/add-property">
                  <Home className="h-5 w-5" />
                  List Property
                </Link>
              </Button>
            )}
          </SignedIn>
          <SignedOut>
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={handleLogin}
            >
              Sign in
            </Button>
            <Button className="flex items-center gap-2" onClick={handleSignup}>
              Sign up
            </Button>
          </SignedOut>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background shadow-lg p-4 md:hidden flex flex-col gap-4">
            <Link
              href="/flats"
              className="text-foreground hover:text-primary font-medium p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Flats
            </Link>
            <Link
              href="/pgs"
              className="text-foreground hover:text-primary font-medium p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              PGs
            </Link>
            <Link
              href="/hostels"
              className="text-foreground hover:text-primary font-medium p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Hostels
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary font-medium p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <hr className="my-2" />
            {/* {!isLoggedIn ? ( */}
            <SignedOut>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogin();
                }}
              >
                Sign in
              </Button>
              <Button
                variant="default"
                className="justify-start"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleSignup();
                }}
              >
                Sign up
              </Button>
            </SignedOut>
            {/* ) : ( */}
            <SignedIn>
              <div className="flex items-center justify-between p-2">
                {/* <UserMenu userType={userType} userName={userName} /> */}
                <UserButton />
                <ModeToggle />
              </div>
            </SignedIn>
            {/* )} */}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
