"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUser, type User } from "@/lib/users"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare, UserX } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function InvitePage({ params }: { params: { userId: string } }) {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [invitedUser, setInvitedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { userId } = params

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // If not logged in, redirect to login with return URL
        toast({
          title: "Login required",
          description: "Please log in to connect with this user",
        })
        // Store the invite URL to redirect back after login
        localStorage.setItem("inviteRedirect", `/invite/${userId}`)
        router.push("/login")
        return
      }

      // If logged in as the same user as the invite, redirect to dashboard
      if (user.username === userId) {
        toast({
          title: "That's your own invite link",
          description: "You can't chat with yourself",
        })
        router.push("/dashboard")
        return
      }

      // Load the invited user
      setIsLoading(true)
      try {
        const userData = getUser(userId)
        if (userData) {
          setInvitedUser(userData)
          setIsLoading(false)
        } else {
          // User not found
          toast({
            title: "User not found",
            description: "The user you're looking for doesn't exist",
            variant: "destructive",
          })
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error loading invited user:", error)
        setIsLoading(false)
      }
    }
  }, [user, authLoading, userId, router, toast])

  const handleStartChat = () => {
    if (invitedUser) {
      router.push(`/chat?user=${invitedUser.username}`)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md border border-white/20 shadow-lg backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!invitedUser) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md border border-white/20 shadow-lg backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
          <CardHeader>
            <CardTitle>User Not Found</CardTitle>
            <CardDescription>The user you're looking for doesn't exist</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <UserX className="h-16 w-16 text-muted-foreground" />
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border border-white/20 shadow-lg backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              Chat Invitation
            </CardTitle>
            <CardDescription>You've been invited to chat with {invitedUser.name}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full overflow-hidden mb-4">
                <img
                  src={invitedUser.profilePicture || "/user-default.png"}
                  alt={invitedUser.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">{invitedUser.name}</h3>
              <p className="text-sm text-muted-foreground">@{invitedUser.username}</p>
            </div>

            {invitedUser.bio && <p className="text-center text-sm">{invitedUser.bio}</p>}

            <Button
              onClick={handleStartChat}
              className="w-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Chatting
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
