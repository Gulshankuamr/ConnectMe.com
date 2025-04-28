"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/users"
import { getChatMessages, sendMessage, type ChatMessage, markMessagesAsRead } from "@/lib/chat"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatTime } from "@/lib/utils"
import { Send, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface ChatInterfaceProps {
  currentUser: string
  otherUser: User
}

export function ChatInterface({ currentUser, otherUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastMessageRef = useRef<string | null>(null)

  useEffect(() => {
    const loadMessages = () => {
      try {
        const chatMessages = getChatMessages(currentUser, otherUser.username)

        // Check if messages have actually changed to avoid unnecessary re-renders
        const messagesJson = JSON.stringify(chatMessages)
        if (lastMessageRef.current !== messagesJson) {
          lastMessageRef.current = messagesJson
          setMessages(chatMessages)

          // Mark messages as read when viewing the chat
          markMessagesAsRead(currentUser, otherUser.username)
        }
      } catch (error) {
        console.error("Error loading messages:", error)
      }
    }

    loadMessages()

    // Poll for new messages every 2 seconds to simulate real-time
    const interval = setInterval(loadMessages, 2000)

    return () => clearInterval(interval)
  }, [currentUser, otherUser.username])

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)

    // Show typing indicator to the other user
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Set typing timeout - in a real app, this would trigger a server event
    const timeout = setTimeout(() => {
      // Typing stopped
    }, 1000)

    setTypingTimeout(timeout)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    setIsLoading(true)

    try {
      const message = sendMessage(currentUser, otherUser.username, newMessage)
      setMessages([...messages, message])
      setNewMessage("")

      // Simulate typing from the other user if they are admin or if current user is admin
      if (otherUser.username === "admin" || currentUser === "admin") {
        simulateTyping()
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const simulateTyping = () => {
    // Show typing indicator
    setIsTyping(true)

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set a random timeout between 2-5 seconds to simulate typing
    const typingTime = Math.floor(Math.random() * 3000) + 2000

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)

      // If the other user is admin, simulate a response
      if (otherUser.username === "admin") {
        const responses = [
          "Thanks for your message! I'll get back to you soon.",
          "I appreciate you reaching out.",
          "Let me check that for you.",
          "How can I help you further?",
          "Is there anything else you'd like to know?",
        ]

        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        const simulatedMessage = sendMessage(otherUser.username, currentUser, randomResponse)
        setMessages((prev) => [...prev, simulatedMessage])
      }

      // If current user is admin, no need to simulate a response
    }, typingTime)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Check if user is online (active in the last 5 minutes)
  const isOnline = () => {
    if (!otherUser.lastActive) return false

    const lastActive = new Date(otherUser.lastActive)
    const now = new Date()
    const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60)

    return diffMinutes < 5
  }

  return (
    <Card className="h-full flex flex-col border border-white/20 shadow-lg backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
      <CardHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherUser.profilePicture || "/user-default.png"} alt={otherUser.name} />
              <AvatarFallback>{otherUser.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            {isOnline() && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-background" />
            )}
          </div>
          <div>
            <CardTitle className="text-base">{otherUser.name}</CardTitle>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">@{otherUser.username}</p>
              {isOnline() ? (
                <Badge variant="outline" className="bg-green-500 text-white border-0 text-xs py-0 h-4">
                  Online
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-500 text-white border-0 text-xs py-0 h-4">
                  Offline
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground text-sm">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={index}
                className={`flex ${message.sender === currentUser ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === currentUser
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                      : "bg-white dark:bg-gray-800 shadow-sm"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === currentUser ? "text-white/70" : "text-muted-foreground"
                    }`}
                  >
                    {formatTime(new Date(message.timestamp))}
                  </p>
                </div>
              </motion.div>
            ))
          )}

          <AnimatePresence>
            {isTyping && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-white dark:bg-gray-800 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{otherUser.name} is typing...</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <CardFooter className="border-t p-4">
        <div className="flex w-full items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 rounded-full bg-white/70 dark:bg-gray-900/70 border-white/20"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !newMessage.trim()}
            size="icon"
            className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
