"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/users"
import { Search } from "lucide-react"

interface UserFinderProps {
  currentUsername: string
}

export function UserFinder({ currentUsername }: UserFinderProps) {
  const [username, setUsername] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleFindUser = () => {
    if (!username.trim()) return

    setIsSearching(true)
    try {
      const user = getUser(username.trim())

      if (!user) {
        toast({
          title: "User not found",
          description: "No user with that username exists",
          variant: "destructive",
        })
        return
      }

      if (user.username === currentUsername) {
        toast({
          title: "That's you!",
          description: "You can't chat with yourself",
          variant: "destructive",
        })
        return
      }

      // Navigate to chat with this user
      router.push(`/chat?user=${user.username}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find user",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Enter username to chat"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="pl-9 rounded-full bg-white/70 dark:bg-gray-900/70 border-white/20"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleFindUser()
            }
          }}
        />
      </div>
      <Button
        onClick={handleFindUser}
        disabled={isSearching || !username.trim()}
        className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
      >
        {isSearching ? "Searching..." : "Chat"}
      </Button>
    </div>
  )
}
