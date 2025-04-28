"use client"

// Authentication helper functions
import { createContext, useContext } from "react"

// Define user type
export type User = {
  username: string
  name: string
  password: string
  isAdmin?: boolean
}

// Initialize users in localStorage if not exists
export function initializeUsers() {
  if (!localStorage.getItem("users")) {
    // Create default admin user
    const adminUser = {
      username: "admin",
      password: "admin123",
      name: "Admin",
      bio: "Platform administrator",
      profilePicture: "",
      socialLinks: {},
      lastActive: new Date().toISOString(),
      isAdmin: true,
    }

    localStorage.setItem("users", JSON.stringify([adminUser]))
  }
}

// Login function
export async function login(username: string, password: string) {
  initializeUsers()

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: User) => u.username === username && u.password === password)

    if (user) {
      // Store current user in localStorage
      const userData = {
        username: user.username,
        name: user.name,
        isAdmin: user.isAdmin || false,
      }
      localStorage.setItem("currentUser", JSON.stringify(userData))

      // Update last active timestamp
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = allUsers.map((u: any) => {
        if (u.username === username) {
          return {
            ...u,
            lastActive: new Date().toISOString(),
          }
        }
        return u
      })
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      return { success: true, user: userData }
    }

    return { success: false, error: "Invalid username or password" }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

// Signup function
export async function signup(username: string, password: string, name: string) {
  initializeUsers()

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Check if username already exists
    if (users.some((u: User) => u.username === username)) {
      return { success: false, error: "Username already exists" }
    }

    // Create new user
    const newUser = {
      username,
      password,
      name,
      bio: "",
      profilePicture: "",
      socialLinks: {},
      lastActive: new Date().toISOString(),
      isAdmin: false,
    }

    // Add user to users array
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    // Store current user in localStorage
    const userData = {
      username: newUser.username,
      name: newUser.name,
      isAdmin: false,
    }
    localStorage.setItem("currentUser", JSON.stringify(userData))

    return { success: true, user: userData }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false, error: "An error occurred during signup" }
  }
}

// Logout function
export function logout() {
  localStorage.removeItem("currentUser")
}

// Get current user
export function getCurrentUser() {
  const currentUser = localStorage.getItem("currentUser")
  if (currentUser) {
    return JSON.parse(currentUser)
  }
  return null
}

// Remote logout function for admin
export function remoteLogout(username: string): boolean {
  try {
    // Update the user's lastActive to show they're offline
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = allUsers.map((u: any) => {
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
    return true
  } catch (error) {
    console.error("Error in remote logout:", error)
    return false
  }
}

// Add the AuthContext and useAuth hook at the end of the file
type AuthContextType = {
  user: { username: string; name: string; isAdmin?: boolean } | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  signup: (username: string, password: string, name: string) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
