"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/users"
import Link from "next/link"
import { MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  // Check if user is online (active in the last 5 minutes)
  const isOnline = () => {
    if (!user.lastActive) return false

    const lastActive = new Date(user.lastActive)
    const now = new Date()
    const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60)

    return diffMinutes < 5
  }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden border border-white/20 shadow-lg backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.profilePicture || "/user-default.png"} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              {isOnline() && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
              )}
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-lg font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
            {user.bio && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{user.bio}</p>}

            {user.socialLinks && Object.values(user.socialLinks).some((link) => link) && (
              <div className="mt-4 flex flex-wrap justify-center gap-1">
                {Object.entries(user.socialLinks).map(
                  ([platform, url]) =>
                    url && (
                      <Badge key={platform} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ),
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 p-4 pt-0">
          <Button asChild variant="outline" size="sm" className="w-full rounded-full">
            <Link href={`/profile/${user.username}`}>View Profile</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            <Link href={`/chat?user=${user.username}`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
