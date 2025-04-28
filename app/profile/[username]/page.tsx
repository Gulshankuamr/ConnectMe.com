"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getUser, type User } from "@/lib/users"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { username } = params

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const loadUser = () => {
      setIsLoading(true)
      try {
        const userData = getUser(username)
        if (userData) {
          setProfileUser(userData)
        } else {
          // User not found
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error loading user profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (username) {
      loadUser()
    }
  }, [username, router])

  if (authLoading || !user || isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-full max-w-sm" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </DashboardLayout>
    )
  }

  if (!profileUser) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <p className="text-muted-foreground mb-6">The user you are looking for does not exist</p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  // Check if this is the current user's profile
  const isCurrentUser = user.username === profileUser.username

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{profileUser.name}'s Profile</h1>
            <p className="text-muted-foreground">
              View {isCurrentUser ? "your" : `${profileUser.name}'s`} profile information
            </p>
          </div>

          {!isCurrentUser && (
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href={`/chat?user=${profileUser.username}`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Link>
              </Button>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              {isCurrentUser ? "Your" : `${profileUser.name}'s`} personal information and social links
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileUser.profilePicture || "/user-default.png"} alt={profileUser.name} />
                  <AvatarFallback>{profileUser.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <Badge variant="outline">{isUserOnline(profileUser) ? "Online" : "Offline"}</Badge>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="text-xl font-semibold">{profileUser.name}</h3>
                  <p className="text-sm text-muted-foreground">@{profileUser.username}</p>
                </div>

                {profileUser.bio && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Bio</h4>
                    <p className="text-sm">{profileUser.bio}</p>
                  </div>
                )}
              </div>
            </div>

            {profileUser.socialLinks && Object.values(profileUser.socialLinks).some((link) => link) && (
              <>
                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Social Links</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(profileUser.socialLinks).map(
                      ([platform, url]) =>
                        url && (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
                          >
                            {platform}
                          </a>
                        ),
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
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
