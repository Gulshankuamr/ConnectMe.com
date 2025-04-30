"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Copy, Check, Share2 } from "lucide-react"
import { motion } from "framer-motion"

interface InviteLinkProps {
  username: string
}

export function InviteLink({ username }: InviteLinkProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const inviteLink = `${window.location.origin}/invite/${username}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Your invite link has been copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually",
        variant: "destructive",
      })
    }
  }

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Chat with me on ConnectMe",
          text: `Join me for a chat on ConnectMe!`,
          url: inviteLink,
        })
        toast({
          title: "Link shared!",
          description: "Your invite link has been shared",
        })
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast({
            title: "Failed to share",
            description: "Please try again or copy manually",
            variant: "destructive",
          })
        }
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <motion.div
      className="flex flex-col space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-2">
        <Input value={inviteLink} readOnly className="rounded-full bg-white/70 dark:bg-gray-900/70 border-white/20" />
        <Button
          size="icon"
          variant="outline"
          className="rounded-full"
          onClick={copyToClipboard}
          aria-label="Copy invite link"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full"
          onClick={shareLink}
          aria-label="Share invite link"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Share this link with friends to start chatting with them
      </p>
    </motion.div>
  )
}
