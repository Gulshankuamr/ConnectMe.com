"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAllUsers, type User } from "@/lib/users"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "@/lib/utils"
import { LogOut, UserX, Users, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeUsers, setActiveUsers] = useState<User[]>([])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (user && user.username !== "admin") {
      // Only allow admin access
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && user.username === "admin") {
      const loadUsers = () => {
        try {
          const allUsers = getAllUsers().filter((u) => u.username !== "admin")
          setUsers(allUsers)

          // Get active users (active in the last 5 minutes)
          const fiveMinutesAgo = new Date()
          fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5)

          const active = allUsers.filter((u) => {
            if (!u.lastActive) return false
            const lastActive = new Date(u.lastActive)
            return lastActive > fiveMinutesAgo
          })

          setActiveUsers(active)
          setIsLoading(false)
        } catch (error) {
          console.error("Error loading users:", error)
          setIsLoading(false)
        }
      }

      loadUsers()
      // Poll for updates every 30 seconds
      const interval = setInterval(loadUsers, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const handleLogoutUser = (username: string) => {
    try {
      // Remove the user's currentUser entry if it exists
      if (username === localStorage.getItem("currentUser")) {
        localStorage.removeItem("currentUser")
      }

      // Update the user's lastActive to show they're offline
      const allUsers = getAllUsers()
      const updatedUsers = allUsers.map((u) => {
        if (u.username === username) {
          // Set lastActive to a time in the past
          const pastDate = new Date()
          pastDate.setDate(pastDate.getDate() - 1) // 1 day ago
          return {
            ...u,
            lastActive: pastDate.toISOString(),
          }
        }
        return u
      })

      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // Update the users list
      setUsers(updatedUsers.filter((u) => u.username !== "admin"))

      toast({
        title: "User logged out",
        description: `${username} has been logged out successfully`,
      })
    } catch (error) {
      console.error("Error logging out user:", error)
      toast({
        title: "Error",
        description: "Failed to log out user",
        variant: "destructive",
      })
    }
  }

  if (authLoading || !user || user.username !== "admin") {
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
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage users and monitor platform activity</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
              {activeUsers.length} Active Users
            </Badge>
            <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0">
              {users.length} Total Users
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="all-users">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all-users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>All Users</span>
            </TabsTrigger>
            <TabsTrigger value="active-users" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Active Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-users" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage all registered users on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center justify-between gap-4 p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[200px]" />
                              <Skeleton className="h-4 w-[150px]" />
                            </div>
                          </div>
                          <Skeleton className="h-9 w-[100px]" />
                        </div>
                      ))}
                  </div>
                ) : users.length > 0 ? (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <motion.div
                        key={user.username}
                        className="flex items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.profilePicture || "/user-default.png"} alt={user.name} />
                            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-muted-foreground">@{user.username}</p>
                              {isUserOnline(user) ? (
                                <Badge variant="outline" className="bg-green-500 text-white border-0 text-xs">
                                  Online
                                </Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  Last active:{" "}
                                  {user.lastActive ? formatDistanceToNow(new Date(user.lastActive)) : "Never"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleLogoutUser(user.username)}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Log Out</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active-users" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>Users who are currently online or active in the last 5 minutes</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(2)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center justify-between gap-4 p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[200px]" />
                              <Skeleton className="h-4 w-[150px]" />
                            </div>
                          </div>
                          <Skeleton className="h-9 w-[100px]" />
                        </div>
                      ))}
                  </div>
                ) : activeUsers.length > 0 ? (
                  <div className="space-y-4">
                    {activeUsers.map((user) => (
                      <motion.div
                        key={user.username}
                        className="flex items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.profilePicture || "/user-default.png"} alt={user.name} />
                              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleLogoutUser(user.username)}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Log Out</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No active users</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  )
}

// Helper function to check if a user is online (active in the last 5 minutes)
function isUserOnline(user: User): boolean {
  if (!user.lastActive) return false

  const lastActive = new Date(user.lastActive)
  const now = new Date()
  const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60)

  return diffMinutes < 5
}
