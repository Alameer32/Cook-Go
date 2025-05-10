"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Menu, X, ClipboardList, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import UserProfile from "@/components/auth/user-profile"
import { auth } from "@/lib/firebase"
import { ADMIN_EMAIL } from "@/lib/constants"
import { signOut } from "firebase/auth"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user)
      setIsAdmin(user?.email === ADMIN_EMAIL)
    })

    return () => unsubscribe()
  }, [])

  const routes = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/about", label: "About Us" },
  ]

  const adminRoutes = [
    { href: "/admin", label: "Admin Dashboard" },
    { href: "/admin/orders", label: "Orders" },
  ]

  const authRoutes = [
    { href: "/login", label: "Login" },
    { href: "/signup", label: "Sign Up" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            {/* <Image src="/logo.png" alt="Cook&Go Logo" width={32} height={32} className="object-contain" /> */}
          </div>
          <span className="text-xl font-bold text-primary">Cook&Go</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === route.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <UserProfile />

              {isAdmin && (
                <>
                  <Link href="/admin">
                    <Button variant="ghost" size="icon" aria-label="Admin Dashboard">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </Link>

                  <Link href="/admin/orders">
                    <Button variant="ghost" size="icon" aria-label="Order Management">
                      <ClipboardList className="h-5 w-5" />
                    </Button>
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}

          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Shopping Cart">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 border-t">
          <nav className="flex flex-col space-y-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === route.href ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {route.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">Account</p>
                <Link
                  href="/profile"
                  className={`text-sm font-medium transition-colors hover:text-primary block mb-2 ${
                    pathname === "/profile" ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => {
                    setIsMenuOpen(false)
                    signOut(auth)
                  }}
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">Account</p>
                {authRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`text-sm font-medium transition-colors hover:text-primary block mb-2 ${
                      pathname === route.href ? "text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            )}

            {isAdmin && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">Admin</p>
                {adminRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`text-sm font-medium transition-colors hover:text-primary block mb-2 ${
                      pathname === route.href ? "text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
