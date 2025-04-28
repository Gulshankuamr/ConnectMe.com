// Chat helper functions

// Define chat message type
export type ChatMessage = {
  sender: string
  receiver: string
  content: string
  timestamp: string
  isRead?: boolean
}

// Initialize chats in localStorage if not exists
function initializeChats() {
  if (!localStorage.getItem("chats")) {
    localStorage.setItem("chats", JSON.stringify({}))
  }
}

// Get chat ID for two users (consistent regardless of order)
function getChatId(user1: string, user2: string): string {
  return [user1, user2].sort().join("_")
}

// Get chat messages between two users
export function getChatMessages(user1: string, user2: string): ChatMessage[] {
  initializeChats()

  try {
    const chats = JSON.parse(localStorage.getItem("chats") || "{}")
    const chatId = getChatId(user1, user2)

    return chats[chatId] || []
  } catch (error) {
    console.error("Error getting chat messages:", error)
    return []
  }
}

// Send a message
export function sendMessage(sender: string, receiver: string, content: string): ChatMessage {
  initializeChats()

  try {
    const chats = JSON.parse(localStorage.getItem("chats") || "{}")
    const chatId = getChatId(sender, receiver)

    // Create new message
    const newMessage: ChatMessage = {
      sender,
      receiver,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    }

    // Add message to chat
    if (!chats[chatId]) {
      chats[chatId] = []
    }

    chats[chatId].push(newMessage)
    localStorage.setItem("chats", JSON.stringify(chats))

    return newMessage
  } catch (error) {
    console.error("Error sending message:", error)
    throw new Error("Failed to send message")
  }
}

// Get recent chats for a user
export function getRecentChats(username: string): any[] {
  initializeChats()

  try {
    const chats = JSON.parse(localStorage.getItem("chats") || "{}")
    const recentChats: any[] = []

    // Loop through all chats
    Object.entries(chats).forEach(([chatId, messages]) => {
      const users = chatId.split("_")

      // Check if this chat involves the current user
      if (users.includes(username)) {
        const messages = chats[chatId] as ChatMessage[]

        if (messages.length > 0) {
          // Get the other user
          const otherUser = users[0] === username ? users[1] : users[0]

          // Get the last message
          const lastMessage = messages[messages.length - 1]

          // Count unread messages
          const unreadCount = messages.filter((msg) => msg.receiver === username && !msg.isRead).length

          recentChats.push({
            username: otherUser,
            lastMessage: lastMessage.content,
            timestamp: lastMessage.timestamp,
            unreadCount,
          })
        }
      }
    })

    // Sort by timestamp (newest first)
    recentChats.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    return recentChats
  } catch (error) {
    console.error("Error getting recent chats:", error)
    return []
  }
}

// Mark messages as read
export function markMessagesAsRead(currentUser: string, otherUser: string): boolean {
  initializeChats()

  try {
    const chats = JSON.parse(localStorage.getItem("chats") || "{}")
    const chatId = getChatId(currentUser, otherUser)

    if (chats[chatId]) {
      const updatedMessages = chats[chatId].map((msg: ChatMessage) => {
        if (msg.receiver === currentUser) {
          return { ...msg, isRead: true }
        }
        return msg
      })

      chats[chatId] = updatedMessages
      localStorage.setItem("chats", JSON.stringify(chats))
      return true
    }

    return false
  } catch (error) {
    console.error("Error marking messages as read:", error)
    return false
  }
}

// Delete chat between two users
export function deleteChat(user1: string, user2: string): boolean {
  initializeChats()

  try {
    const chats = JSON.parse(localStorage.getItem("chats") || "{}")
    const chatId = getChatId(user1, user2)

    if (chats[chatId]) {
      delete chats[chatId]
      localStorage.setItem("chats", JSON.stringify(chats))
      return true
    }

    return false
  } catch (error) {
    console.error("Error deleting chat:", error)
    return false
  }
}
