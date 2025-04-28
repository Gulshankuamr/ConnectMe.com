// User data helper functions

// Define user type
export type User = {
  username: string
  name: string
  bio?: string
  profilePicture?: string
  socialLinks?: {
    [key: string]: string
  }
  lastActive?: string
}

// Get all users
export function getAllUsers(): User[] {
  try {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    return users
  } catch (error) {
    console.error("Error getting users:", error)
    return []
  }
}

// Get user by username
export function getUser(username: string): User | null {
  try {
    const users = getAllUsers()
    return users.find((user) => user.username === username) || null
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

// Update user
export function updateUser(username: string, userData: Partial<User>): boolean {
  try {
    const users = getAllUsers()
    const userIndex = users.findIndex((user) => user.username === username)

    if (userIndex === -1) {
      return false
    }

    // Preserve password and other fields
    const currentUser = users[userIndex]
    users[userIndex] = {
      ...currentUser,
      ...userData,
      // Make sure username doesn't change
      username: currentUser.username,
      // Update last active timestamp
      lastActive: new Date().toISOString(),
    }

    localStorage.setItem("users", JSON.stringify(users))
    return true
  } catch (error) {
    console.error("Error updating user:", error)
    return false
  }
}

// Search users by name or username
export function searchUsers(query: string): User[] {
  try {
    const users = getAllUsers()
    const lowerQuery = query.toLowerCase()

    return users.filter(
      (user) => user.name.toLowerCase().includes(lowerQuery) || user.username.toLowerCase().includes(lowerQuery),
    )
  } catch (error) {
    console.error("Error searching users:", error)
    return []
  }
}

// Get online users (active in the last 5 minutes)
export function getOnlineUsers(): User[] {
  try {
    const users = getAllUsers()
    const fiveMinutesAgo = new Date()
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5)

    return users.filter((user) => {
      if (!user.lastActive) return false
      const lastActive = new Date(user.lastActive)
      return lastActive > fiveMinutesAgo
    })
  } catch (error) {
    console.error("Error getting online users:", error)
    return []
  }
}
