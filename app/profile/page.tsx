"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getUser, updateUser } from "@/lib/users"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { InviteLink } from "@/components/invite-link"

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  // Profile data
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [profilePicture, setProfilePicture] = useState("")

  // Social links
  const [linkedin, setLinkedin] = useState("")
  const [github, setGithub] = useState("")
  const [twitter, setTwitter] = useState("")
  const [instagram, setInstagram] = useState("")
  const [website, setWebsite] = useState("")

  // For saving
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      const loadUserData = () => {
        setIsLoading(true)
        try {
          const userData = getUser(user.username)
          if (userData) {
            setName(userData.name || "")
            setBio(userData.bio || "")
            setProfilePicture(userData.profilePicture || "")

            // Load social links if they exist
            const socialLinks = userData.socialLinks || {}
            setLinkedin(socialLinks.LinkedIn || "")
            setGithub(socialLinks.GitHub || "")
            setTwitter(socialLinks.Twitter || "")
            setInstagram(socialLinks.Instagram || "")
            setWebsite(socialLinks.Website || "")
          }
        } catch (error) {
          console.error("Error loading user data:", error)
          toast({
            title: "Error",
            description: "Failed to load your profile data",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }

      loadUserData()
    }
  }, [user, toast])

  const handleSave = () => {
    if (!user) return

    setIsSaving(true)
    try {
      const success = updateUser(user.username, {
        name,
        bio,
        profilePicture,
        socialLinks: {
          LinkedIn: linkedin,
          GitHub: github,
          Twitter: twitter,
          Instagram: instagram,
          Website: website,
        },
      })

      if (success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        })
      } else {
        toast({
          title: "Update failed",
          description: "Failed to update your profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "An error occurred while updating your profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
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
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and preferences</p>
          </div>
        </div>

        <Card className="border border-white/20 shadow-lg backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information and profile picture</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profilePicture || "/user-default.png"} alt={name} />
                  <AvatarFallback>{name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-4 flex-1">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-full bg-white/70 dark:bg-gray-900/70 border-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={user.username}
                      disabled
                      className="rounded-full bg-white/70 dark:bg-gray-900/70 border-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profilePicture">Profile Picture URL</Label>
                    <Input
                      id="profilePicture"
                      placeholder="https://example.com/your-image.jpg"
                      value={profilePicture}
                      onChange={(e) => setProfilePicture(e.target.value)}
                      className="rounded-full bg-white/70 dark:bg-gray-900/70 border-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell others about yourself"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="resize-none h-20 bg-white/70 dark:bg-gray-900/70 border-white/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Social Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="rounded-full bg-white/70 dark:bg-gray-900/70 border-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    placeholder="https://github.com/username"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="rounded-full bg-white/70 dark:bg-gray-900/70 border-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/username"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="rounded-full bg-white/70 dark:bg-gray-900/70 border-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/username"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="rounded-full bg-white/70 dark:bg-gray-900/70 border-white/20"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="website">Personal Website</Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="rounded-full bg-white/70 dark:bg-gray-900/70 border-white/20"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Your Invite Link</h3>
              <InviteLink username={user.username} />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </DashboardLayout>
  )
}

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-muted rounded ${className}`} />
}
