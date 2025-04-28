"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/lib/users"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface UserChatCardProps {
  user: User
  isSelected?: boolean
  onClick?: () => void
  unreadCount?: number
}

export function UserChatCard({ user, isSelected = false, onClick, unreadCount = 0 }: UserChatCardProps) {
  // Check if user is online (active in the last 5 minutes)
  const isOnline = () => {
    if (!user.lastActive) return false

    const lastActive = new Date(user.lastActive)
    const now = new Date()
    const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60)

    return diffMinutes < 5
  }

  return (
    <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-md p-2 cursor-pointer transition-colors",
          isSelected ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" : "hover:bg-muted",
        )}
        onClick={onClick}
      >
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profilePicture || "/user-default.png"} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          {isOnline() && (
            <span
              className={cn(
                "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1",
                isSelected ? "ring-primary" : "ring-background",
              )}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={cn("font-medium truncate", isSelected ? "text-white" : "")}>
              {user.name}
              {unreadCount > 0 && !isSelected && (
                <Badge className="ml-2 bg-pink-500 hover:bg-pink-600">{unreadCount}</Badge>
              )}
            </p>
          </div>
          <p className={cn("text-xs truncate", isSelected ? "text-white/80" : "text-muted-foreground")}>
            @{user.username}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
