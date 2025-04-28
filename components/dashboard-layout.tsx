"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUser } from "@/lib/users"
import Link from "next/link"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [userData, setUserData] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user) {
      const userInfo = getUser(user.username)
      if (userInfo) {
        setUserData(userInfo)
      }
    }
  }, [user, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <div className="container flex h-16 items-center px-4">
            <Skeleton className="h-8 w-32" />
            <div className="ml-auto flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <div className="hidden border-r bg-muted/40 md:block md:w-64">
            <div className="flex h-full flex-col gap-2 p-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
            </div>
          </div>
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto max-w-6xl">
              <Skeleton className="h-8 w-48 mb-6" />
              <Skeleton className="h-[500px] w-full" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex h-16 items-center px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <div className="relative h-8 w-8">
              <Image src="/logo.png" alt="ConnectMe Logo" fill className="object-contain" />
            </div>
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              ConnectMe
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-4">
            {isMounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="rounded-full"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-16 items-center border-b px-4">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 font-bold text-xl"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="relative h-8 w-8">
                      <Image src="/logo.png" alt="ConnectMe Logo" fill className="object-contain" />
                    </div>
                    <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
                      ConnectMe
                    </span>
                  </Link>
                  <SheetTrigger asChild className="ml-auto">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetTrigger>
                </div>
                <Sidebar onLogout={handleLogout} isMobile={true} onItemClick={() => setIsMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>

            <Link href="/profile">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userData?.profilePicture || "/user-default.png"} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <div className="hidden border-r bg-muted/40 md:block md:w-64">
          <Sidebar onLogout={handleLogout} />
        </div>

        <main className="flex-1 p-4 md:p-6 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-indigo-500/5">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
