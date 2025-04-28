"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCard } from "@/components/user-card"
import { MessagePreview } from "@/components/message-preview"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getAllUsers, getUser, type User } from "@/lib/users"
import { getRecentChats } from "@/lib/chat"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { MessageSquare, Users, UserPlus } from "lucide-react"
import { motion } from "framer-motion"
import { UserSearch } from "@/components/user-search"

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [recentChats, setRecentChats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setIsLoading(true)
        try {
          // Get all users except current user and admin
          const allUsers = getAllUsers().filter((u) => u.username !== user.username && u.username !== "admin")

          // Only update if users have changed
          if (JSON.stringify(allUsers) !== JSON.stringify(users)) {
            setUsers(allUsers)
          }

          // Get recent chats
          const chats = getRecentChats(user.username)
          // Only update if chats have changed
          if (JSON.stringify(chats) !== JSON.stringify(recentChats)) {
            setRecentChats(chats)
          }

          // Get full user data
          const userData = getUser(user.username)
          if (userData && JSON.stringify(userData) !== JSON.stringify(currentUser)) {
            setCurrentUser(userData)
          }
        } catch (error) {
          console.error("Error loading dashboard data:", error)
        } finally {
          setIsLoading(false)
        }
      }

      loadData()

      // Set online status
      const updateOnlineStatus = () => {
        if (user) {
          const userData = getUser(user.username)
          if (userData) {
            userData.lastActive = new Date().toISOString()
            localStorage.setItem(
              "users",
              JSON.stringify(getAllUsers().map((u) => (u.username === userData.username ? userData : u))),
            )
          }
        }
      }

      updateOnlineStatus()
      const interval = setInterval(updateOnlineStatus, 60000) // Update every minute

      return () => clearInterval(interval)
    }
  }, [user])

  const handleSelectUser = (username: string) => {
    router.push(`/chat?user=${username}`)
  }

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <motion.div
        className="flex flex-col gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Summary Card */}
          <Card className="flex-1 border border-white/20 shadow-lg backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
                My Profile
              </CardTitle>
              <CardDescription>Your profile summary and stats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={currentUser?.profilePicture || "/user-default.png"}
                    alt={currentUser?.name || user.name}
                  />
                  <AvatarFallback>{currentUser?.name?.charAt(0) || user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="text-xl font-semibold">{currentUser?.name || user.name}</h3>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <Badge
                      variant="outline"
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0"
                    >
                      {users.length} Connections
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0"
                    >
                      {recentChats.length} Chats
                    </Badge>
                  </div>
                </div>
                <div className="ml-auto">
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="rounded-full">
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </div>

              {currentUser?.bio && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">{currentUser.bio}</p>
                </div>
              )}

              {currentUser?.socialLinks && Object.keys(currentUser.socialLinks).length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">My Social Links</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(currentUser.socialLinks).map(
                      ([platform, url]) =>
                        url && (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-primary hover:text-primary-foreground"
                          >
                            {platform}
                          </a>
                        ),
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Search */}
        <Card className="border border-white/20 shadow-lg backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              <UserPlus className="h-5 w-5 text-pink-500" />
              Find Users
            </CardTitle>
            <CardDescription>Search for users by username to start a conversation</CardDescription>
          </CardHeader>
          <CardContent>
            <UserSearch onSelectUser={handleSelectUser} excludeUsername={user.username} />
          </CardContent>
        </Card>

        <Tabs defaultValue="connections">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="connections"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-full"
            >
              <Users className="h-4 w-4" />
              <span>Connections</span>
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-full"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Recent Messages</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                Array(6)
                  .fill(0)
                  .map((_, i) => <Skeleton key={i} className="h-[180px] rounded-lg" />)
              ) : users.length > 0 ? (
                users.map((user) => <UserCard key={user.username} user={user} />)
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No connections found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-4">
            <Card className="border border-white/20 shadow-lg backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
                  Recent Messages
                </CardTitle>
                <CardDescription>Your recent conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[300px]" />
                          </div>
                        </div>
                      ))
                  ) : recentChats.length > 0 ? (
                    recentChats.map((chat) => (
                      <MessagePreview
                        key={chat.username}
                        username={chat.username}
                        lastMessage={chat.lastMessage}
                        timestamp={chat.timestamp}
                        unreadCount={chat.unreadCount}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No recent messages</p>
                      <Link href="/chat">
                        <Button variant="outline" size="sm" className="mt-4 rounded-full">
                          Start a conversation
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  )
}
