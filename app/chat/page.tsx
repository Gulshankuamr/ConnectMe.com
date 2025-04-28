"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getAllUsers, type User } from "@/lib/users"
import { Skeleton } from "@/components/ui/skeleton"
import { UserChatCard } from "@/components/user-chat-card"
import { ChatInterface } from "@/components/chat-interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { UserSearch } from "@/components/user-search"

export default function ChatPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      const loadUsers = () => {
        setIsLoading(true)
        try {
          // Get all users except current user
          let allUsers = getAllUsers().filter((u) => u.username !== user.username)

          // If user is not admin, make sure admin is the first user in the list
          if (user.username !== "admin") {
            const adminUser = allUsers.find((u) => u.username === "admin")
            if (adminUser) {
              allUsers = [adminUser, ...allUsers.filter((u) => u.username !== "admin")]
            }
          }

          // Only update state if users have changed
          const usersChanged = JSON.stringify(allUsers) !== JSON.stringify(users)
          if (usersChanged) {
            setUsers(allUsers)
          }

          // Check if there's a user parameter in the URL
          const userParam = searchParams.get("user")
          if (userParam && !selectedUser) {
            const selectedUser = allUsers.find((u) => u.username === userParam)
            if (selectedUser) {
              setSelectedUser(selectedUser)
            }
          } else if (allUsers.length > 0 && !selectedUser) {
            // Select first user by default (admin for regular users) only if no user is selected
            setSelectedUser(allUsers[0])
          }
        } catch (error) {
          console.error("Error loading users:", error)
        } finally {
          setIsLoading(false)
        }
      }

      loadUsers()

      // Poll for user status updates
      const interval = setInterval(loadUsers, 30000)
      return () => clearInterval(interval)
    }
  }, [user, searchParams])

  const handleSelectUser = (username: string) => {
    const selected = users.find((u) => u.username === username)
    if (selected) {
      setSelectedUser(selected)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-10rem)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Users List */}
        <div className="md:col-span-1 overflow-hidden flex flex-col">
          <Card className="h-full flex flex-col border border-white/20 shadow-lg backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
            <CardHeader className="pb-3">
              <CardTitle className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
                Conversations
              </CardTitle>
              <CardDescription>Select a user to start chatting</CardDescription>

              {/* User Search */}
              <div className="mt-3">
                <UserSearch onSelectUser={handleSelectUser} excludeUsername={user.username} />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-4 mb-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                    </div>
                  ))
              ) : users.length > 0 ? (
                <div className="space-y-2">
                  {users.map((user) => (
                    <UserChatCard
                      key={user.username}
                      user={user}
                      isSelected={selectedUser?.username === user.username}
                      onClick={() => handleSelectUser(user.username)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No users found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="md:col-span-2 overflow-hidden">
          {selectedUser ? (
            <ChatInterface currentUser={user.username} otherUser={selectedUser} />
          ) : (
            <Card className="h-full flex flex-col items-center justify-center text-center p-4 border border-white/20 shadow-lg backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">Start a conversation</CardTitle>
              <CardDescription>Select a user from the list to start chatting</CardDescription>
            </Card>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
