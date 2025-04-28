"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, MessageSquare, User, LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"

type SidebarProps = {
  onLogout: () => void
  isMobile?: boolean
  onItemClick?: () => void
}

export function Sidebar({ onLogout, isMobile = false, onItemClick }: SidebarProps) {
  const { user } = useAuth()
  const pathname = usePathname()

  // Base navigation items
  let navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Profile", href: "/profile", icon: User },
  ]

  // Add admin link if user is admin
  if (user?.isAdmin) {
    navigation = [...navigation, { name: "Admin", href: "/admin", icon: Shield }]
  }

  return (
    <nav className="flex h-full flex-col gap-2 p-4">
      {navigation.map((item) => (
        <motion.div key={item.name} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white"
                : "hover:bg-muted",
            )}
            onClick={onItemClick}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        </motion.div>
      ))}
      <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-start gap-2 px-3 py-2 text-sm font-medium hover:bg-muted rounded-full"
          onClick={() => {
            onLogout()
            if (onItemClick) onItemClick()
          }}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </motion.div>
    </nav>
  )
}
