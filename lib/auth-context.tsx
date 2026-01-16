"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "customer" | "admin" | "staff"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const API_URL = "http://localhost:5000/api"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setIsLoading(false)
        return
      }

      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (data.success) {
        setUser(data.data.user)
      } else {
        localStorage.removeItem("auth_token")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.success) {
        localStorage.setItem("auth_token", data.data.token)
        setUser(data.data.user)
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch (error) {
      return { success: false, error: "Login failed" }
    }
  }

  const adminLogin = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.success) {
        // Use a separate token key for admin sessions
        localStorage.setItem("admin_token", data.data.token)
        setUser(data.data.user)
        return { success: true }
      }
      return { success: false, error: data.error || "Admin login failed" }
    } catch (error) {
      return { success: false, error: "Admin login failed" }
    }
  }

  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      })
      const data = await res.json()

      if (data.success) {
        return await login(email, password)
      }
      return { success: false, error: data.error }
    } catch (error) {
      return { success: false, error: "Registration failed" }
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("auth_token")
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      localStorage.removeItem("auth_token")
      localStorage.removeItem("admin_token")
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, adminLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("admin_token") || localStorage.getItem("auth_token")
  }
  return null
}
