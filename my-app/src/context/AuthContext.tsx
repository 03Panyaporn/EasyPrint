"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
    id: string
    email: string
    name?: string
    role: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (userData: any, sessionData: any) => void
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // ตรวจสอบข้อมูลผู้ใช้จาก sessionStorage เมื่อแอปฯ เริ่มโหลด
        const storedUser = sessionStorage.getItem("user")
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (error) {
                console.error("Failed to parse user data from sessionStorage:", error)
                sessionStorage.removeItem("user")
            }
        }
        setLoading(false)
    }, [])

    const login = (userData: any, sessionData: any) => {
        const userObj = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role || "customer",
        }

        setUser(userObj)
        sessionStorage.setItem("user", JSON.stringify(userObj))
        sessionStorage.setItem("access_token", sessionData.access_token)
        sessionStorage.setItem("refresh_token", sessionData.refresh_token)
        // NOTE: การ redirect จะทำที่หน้า login page โดยตรง
    }

    const logout = async () => {
        try {
            const token = sessionStorage.getItem("access_token")
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/logout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            })
        } catch (error) {
            console.error("Logout API failed:", error)
        } finally {
            setUser(null)
            sessionStorage.removeItem("user")
            sessionStorage.removeItem("access_token")
            sessionStorage.removeItem("refresh_token")
            window.location.href = "/"
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
