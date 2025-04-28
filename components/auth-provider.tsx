"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { login as loginUser, signup as signupUser, logout as logoutUser, AuthContext } from "@/lib/auth"

type User = {
  username: string
  name: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  signup: (username: string, password: string, name: string) => Promise<boolean>
  logout: () => void
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      try {
        setUser(JSON.parse(currentUser))
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("currentUser")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const result = await loginUser(username, password)
    if (result.success && result.user) {
      setUser(result.user)
      return true
    }
    return false
  }

  const signup = async (username: string, password: string, name: string) => {
    const result = await signupUser(username, password, name)
    if (result.success && result.user) {
      setUser(result.user)
      return true
    }
    return false
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}
