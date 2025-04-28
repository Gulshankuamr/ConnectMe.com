"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUser } from "@/lib/users"
import Link from "next/link"
import { formatDistanceToNow } from "@/lib/utils"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface MessagePreviewProps {
  username: string
  lastMessage: string
  timestamp: string
  unreadCount?: number
}

export function MessagePreview({ username, lastMessage, timestamp, unreadCount = 0 }: MessagePreviewProps) {
  const user = getUser(username)

  if (!user) return null

  return (
    <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/chat?user=${username}`}
        className="flex items-center gap-3 rounded-md p-2 hover:bg-muted transition-colors"
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.profilePicture || "/user-default.png"} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <p className="font-medium flex items-center">
              {user.name}
              {unreadCount > 0 && <Badge className="ml-2 bg-pink-500 hover:bg-pink-600">{unreadCount}</Badge>}
            </p>
            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(timestamp))}</span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
        </div>
      </Link>
    </motion.div>
  )
}
