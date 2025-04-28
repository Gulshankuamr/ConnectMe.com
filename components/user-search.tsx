"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { searchUsers, type User } from "@/lib/users"
import { Search, UserPlus, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface UserSearchProps {
  onSelectUser?: (username: string) => void
  excludeUsername?: string
  className?: string
}

export function UserSearch({ onSelectUser, excludeUsername, className = "" }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true)
      const results = searchUsers(searchQuery)
        .filter((user) => user.username !== excludeUsername)
        .slice(0, 5) // Limit to 5 results
      setSearchResults(results)
      setIsSearching(false)
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }, [searchQuery, excludeUsername])

  const handleSelectUser = (username: string) => {
    if (onSelectUser) {
      onSelectUser(username)
    }
    setSearchQuery("")
    setShowResults(false)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setShowResults(false)
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 rounded-full bg-white/70 dark:bg-gray-900/70 border-white/20"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full p-0"
              onClick={handleClearSearch}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showResults && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-1 w-full"
          >
            <Card className="overflow-hidden border border-white/20 shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-950/90">
              <ul className="py-1">
                {searchResults.map((user) => (
                  <li key={user.username}>
                    {onSelectUser ? (
                      <button
                        className="w-full px-3 py-2 flex items-center gap-3 hover:bg-muted/50 transition-colors"
                        onClick={() => handleSelectUser(user.username)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profilePicture || "/user-default.png"} alt={user.name} />
                          <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </button>
                    ) : (
                      <Link
                        href={`/chat?user=${user.username}`}
                        className="px-3 py-2 flex items-center gap-3 hover:bg-muted/50 transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profilePicture || "/user-default.png"} alt={user.name} />
                          <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="ml-auto rounded-full">
                          <UserPlus className="h-4 w-4" />
                          <span className="sr-only">Chat with {user.name}</span>
                        </Button>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}

        {showResults && searchQuery.trim().length > 0 && searchResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-1 w-full"
          >
            <Card className="p-4 text-center border border-white/20 shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-950/90">
              <p className="text-muted-foreground">No users found</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
