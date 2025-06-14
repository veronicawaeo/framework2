"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Definisikan tipe untuk user
interface User {
  user_id: number
  email: string
  nama: string
  nim?: string | null
  nip?: string | null
  token?: string // Jika menggunakan JWT
}

// Definisikan tipe untuk context
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  userType: "civitas" | "umum" | null // Tambahkan userType untuk membedakan jenis pengguna
}

// Buat context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState<"civitas" | "umum" | null>(null)

  // Cek apakah user sudah login saat aplikasi dimuat
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedUserType = localStorage.getItem("userType") as "civitas" | "umum" | null

    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setUserType(storedUserType)
    }
    setLoading(false)
  }, [])

  // Fungsi login
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:3001/auth/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login gagal")
      }

      const data = await response.json()

      // Tentukan userType berdasarkan email atau data dari backend
      const type = email.includes("@unsrat.ac.id") || data.data.nim || data.data.nip ? "civitas" : "umum"

      setUser(data.data)
      setUserType(type)

      // Simpan ke localStorage
      localStorage.setItem("user", JSON.stringify(data.data))
      localStorage.setItem("userType", type)
    } catch (error: any) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Fungsi register
  const register = async (userData: any) => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:3001/auth/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Registrasi gagal")
      }

      const data = await response.json()

      // Tentukan userType berdasarkan email atau data dari form
      const type = userData.email.includes("@unsrat.ac.id") || userData.nim || userData.nip ? "civitas" : "umum"

      setUser(data.data)
      setUserType(type)

      // Simpan ke localStorage
      localStorage.setItem("user", JSON.stringify(data.data))
      localStorage.setItem("userType", type)
    } catch (error: any) {
      console.error("Register error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Fungsi logout
  const logout = () => {
    setUser(null)
    setUserType(null)
    localStorage.removeItem("user")
    localStorage.removeItem("userType")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        userType,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook untuk menggunakan auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}