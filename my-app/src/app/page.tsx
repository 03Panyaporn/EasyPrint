"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { setAuthCookie } from "@/app/actions/auth"

// ─────────────────────────────────────────────
// Auth Modal Component
// ─────────────────────────────────────────────
function AuthModal({
  mode,
  onClose,
  onSwitchMode,
}: {
  mode: "login" | "register"
  onClose: () => void
  onSwitchMode: () => void
}) {
  const router = useRouter() // 👈 2. ประกาศเรียกใช้ router

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const { login: authLogin } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "เข้าสู่ระบบไม่สำเร็จ")
        setLoading(false) // 👈 แนะนำให้ใส่เผื่อเกิด error แล้วปุ่มค้าง
        return
      }

      authLogin(data.user, data.session)

      // 👈 3. เพิ่มบรรทัดนี้: เซ็ต Cookie ให้ Next.js ฝั่ง frontend ก่อนเปลี่ยนหน้า
      await setAuthCookie(data.session.access_token, data.user.role || 'customer')

      // 👈 4. ปิด Modal ทันทีที่ล็อกอินเสร็จ (ช่วยให้ UI ดูสมูทขึ้น)
      onClose()

      // 👈 5. Redirect ด้วย router.push แทน window.location.href
      if (data.user.role === 'merchant') {
        router.push("/shop")
      } else {
        router.push("/customer")
      }
    } catch {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน")
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
        credentials: "include",
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "สมัครสมาชิกไม่สำเร็จ")
        return
      }

      setSuccess("สมัครสมาชิกสำเร็จ! กรุณาเช็คอีเมลเพื่อยืนยันบัญชี")
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
    } catch {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 mx-4 animate-[slideUp_0.3s_ease]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#06B6D4] to-[#0891b2] rounded-xl flex items-center justify-center shadow-md shadow-[#06B6D4]/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#455a64]">
              EASY<span className="text-[#06B6D4]">PRINT</span>
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </h2>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ชื่อผู้ใช้"
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
              minLength={6}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all text-sm"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all text-sm"
              />
            </div>
          )}

          {mode === "login" && (
            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-xs text-cyan-500 hover:text-cyan-600 transition-colors">
                ลืมรหัสผ่าน?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-[#06B6D4] to-[#0891b2] hover:from-[#0891b2] hover:to-[#0e7490] text-white font-medium rounded-lg transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#06B6D4]/20"
          >
            {loading
              ? mode === "login"
                ? "กำลังเข้าสู่ระบบ..."
                : "กำลังสมัคร..."
              : mode === "login"
                ? "เข้าสู่ระบบ"
                : "สมัครสมาชิก"}
          </button>
        </form>

        {/* Switch Mode */}
        <p className="text-center text-gray-500 text-xs mt-5">
          {mode === "login" ? "ยังไม่มีบัญชี?" : "มีบัญชีอยู่แล้ว?"}{" "}
          <button
            onClick={onSwitchMode}
            className="text-cyan-500 hover:text-cyan-600 font-medium transition-colors"
          >
            {mode === "login" ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
          </button>
        </p>
      </div>

      {/* Animations */}
      <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
    </div>
  )
}



// ─────────────────────────────────────────────
// Feature Card Data
// ─────────────────────────────────────────────
const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
    ),
    title: "สั่งพิมพ์ออนไลน์",
    desc: "อัปโหลดไฟล์ เลือกตัวเลือกการพิมพ์ สั่งพิมพ์ได้ทันทีจากทุกที่",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "คำนวณราคาอัตโนมัติ",
    desc: "คิดราคาแม่นยำโปร่งใส ดูราคาก่อนยืนยันสั่ง ไม่มีค่าใช้จ่ายซ่อน",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: "แจ้งเตือนสถานะ",
    desc: "ติดตามงานพิมพ์ได้แบบเรียลไทม์ รู้ทันทุกขั้นตอนจนถึงมือ",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "แชทกับร้านค้า",
    desc: "สอบถามรายละเอียด พูดคุยกับร้านค้าได้โดยตรงผ่านระบบแชท",
  },
]

const steps = [
  { step: "01", title: "สมัครสมาชิก", desc: "สร้างบัญชีฟรีภายในไม่กี่วินาที" },
  { step: "02", title: "อัปโหลดไฟล์", desc: "เลือกไฟล์ที่ต้องการพิมพ์ (PDF, DOC, รูปภาพ)" },
  { step: "03", title: "เลือกตัวเลือก", desc: "กำหนดขนาด ประเภท จำนวน และตัวเลือกเพิ่มเติม" },
  { step: "04", title: "รับงานพิมพ์", desc: "ติดตามสถานะและรับงานพิมพ์ตามที่ต้องการ" },
]

// ─────────────────────────────────────────────
// Landing Page
// ─────────────────────────────────────────────
export default function Home() {
  const [authModal, setAuthModal] = useState<"login" | "register" | null>(null)
  const [shopInfo, setShopInfo] = useState<{ maps_url: string | null }>({
    maps_url: null
  })

  useEffect(() => {
    supabase
      .from('shops')
      .select('maps_url')
      .eq('id', 'b9652bb2-cba5-4440-9d89-0f93f598cb67')
      .single()
      .then(({ data }) => {
        if (data) {
          setShopInfo({ maps_url: data.maps_url || null })
        }
      })
  }, [])

  // ถ้า Login อยู่แล้ว ให้ Redirect ไปหน้า Dashboard ของตัวเองทันที
  // เพื่อป้องกันความสับสนระหว่างหน้า Landing และหน้าใช้งานจริง
  useEffect(() => {
    const userStr = sessionStorage.getItem('user')
    // ตรวจสอบ access_token จากคุกกี้ (ถ้ามี)
    const hasToken = document.cookie.includes('access_token=')

    if (userStr && hasToken) {
      try {
        const user = JSON.parse(userStr)
        if (user.role === 'merchant') {
          window.location.href = '/shop'
        } else {
          window.location.href = '/customer'
        }
      } catch (e) {
        console.error("Auth redirect error", e)
      }
    }
  }, [])


  return (
    <div className="min-h-screen bg-white">
      {/* ═══════ Auth Modal ═══════ */}
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitchMode={() =>
            setAuthModal(authModal === "login" ? "register" : "login")
          }
        />
      )}

      {/* ═══════ Navbar ═══════ */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#06B6D4] to-[#0891b2] rounded-xl flex items-center justify-center shadow-md shadow-[#06B6D4]/20 group-hover:shadow-lg group-hover:shadow-[#06B6D4]/30 transition-all duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#455a64]">
              EASY<span className="text-[#06B6D4]">PRINT</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#78909c]">
            <a href="#features" className="hover:text-[#06B6D4] transition-colors">จุดเด่น</a>
            <a href="#how-it-works" className="hover:text-[#06B6D4] transition-colors">วิธีใช้งาน</a>
            <a href="#contact" className="hover:text-[#06B6D4] transition-colors">ติดต่อ</a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAuthModal("login")}
              className="px-5 py-2 text-sm font-semibold text-[#455a64] hover:text-[#06B6D4] transition-colors"
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => setAuthModal("register")}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#06B6D4] to-[#0891b2] rounded-xl shadow-md shadow-[#06B6D4]/25 hover:shadow-lg hover:shadow-[#06B6D4]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              สมัครสมาชิก
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════ Hero Section ═══════ */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#06B6D4]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#06B6D4]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-14 relative">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E0F7FA] rounded-full text-[#06B6D4] text-xs font-semibold mb-4">
              <span className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full animate-pulse" />
              บริการพิมพ์งานออนไลน์
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-[1.2] text-[#455a64] tracking-tight">
              Print Smarter,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#0891b2]">
                Cooler &amp; Faster.
              </span>
            </h1>

            <p className="mt-5 text-lg lg:text-xl text-[#78909c] leading-relaxed max-w-md mx-auto lg:mx-0">
              บริการถ่ายเอกสาร พิมพ์งาน และเข้าเล่มออนไลน์ คำนวณราคาอัตโนมัติ
              รวดเร็ว สะดวก โปร่งใส มั่นใจในทุกขั้นตอน
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-7 justify-center lg:justify-start">
              <button
                onClick={() => setAuthModal("register")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#0891b2] rounded-xl shadow-lg shadow-[#06B6D4]/25 hover:shadow-xl hover:shadow-[#06B6D4]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                เริ่มต้นใช้งาน
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button
                onClick={() => setAuthModal("login")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-[#455a64] bg-white border-2 border-[#e5e7eb] rounded-xl shadow-sm hover:border-[#06B6D4] hover:text-[#06B6D4] hover:shadow-md transition-all duration-300"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>

          {/* Right — Illustration */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-[320px] h-[360px] lg:w-[400px] lg:h-[440px] bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] rounded-[40px] border-[10px] border-white shadow-2xl shadow-[#06B6D4]/10 flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-5 bg-white rounded-2xl shadow-lg shadow-[#06B6D4]/20 flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#06B6D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-[#455a64] leading-snug">
                    สะดวก <span className="text-[#06B6D4]">รวดเร็ว</span><br />ทุกที่ ทุกเวลา
                  </p>
                  <p className="text-[#90a4ae] text-xs mt-2 leading-relaxed">
                    บริการพิมพ์งานออนไลน์<br />ครบจบในที่เดียว
                  </p>
                  <div className="flex flex-col gap-2 mt-8 items-center">
                    <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur text-green-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      พร้อมให้บริการ
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur text-amber-500 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                      ⚡ รวดเร็ว ทันใจ
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-5 -right-5 w-24 h-24 bg-[#FFF9C4] rounded-2xl rotate-12 shadow-lg flex items-center justify-center">
                <svg className="w-10 h-10 text-[#F9A825]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-[#F3E5F5] rounded-2xl -rotate-12 shadow-lg flex items-center justify-center">
                <svg className="w-9 h-9 text-[#AB47BC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Features Section ═══════ */}
      <section id="features" className="bg-[#FAFCFD] py-14 lg:py-20 border-t border-[#E0F3F7]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[#06B6D4] font-semibold text-xs uppercase tracking-widest mb-2">Features</p>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#455a64]">ทำไมต้อง EasyPrint?</h2>
            <p className="text-[#90a4ae] text-sm mt-3 max-w-md mx-auto">
              ระบบสั่งพิมพ์ออนไลน์ที่ออกแบบมาให้ใช้งานง่าย สะดวก ครบจบในที่เดียว
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-7 border border-[#eaf6f8] shadow-sm hover:shadow-lg hover:shadow-[#06B6D4]/5 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] text-[#06B6D4] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-[#455a64] mb-2">{f.title}</h3>
                <p className="text-sm text-[#90a4ae] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ How It Works ═══════ */}
      <section id="how-it-works" className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[#06B6D4] font-semibold text-xs uppercase tracking-widest mb-2">How It Works</p>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#455a64]">ขั้นตอนง่ายๆ</h2>
            <p className="text-[#90a4ae] text-sm mt-3 max-w-md mx-auto">
              เพียง 4 ขั้นตอนก็พร้อมรับงานพิมพ์คุณภาพ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center group">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-[#06B6D4]/30 to-[#06B6D4]/10" />
                )}

                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#06B6D4] to-[#0891b2] text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-[#06B6D4]/20 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#06B6D4]/30 transition-all duration-300 mb-4">
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-[#455a64] mb-1">{s.title}</h3>
                <p className="text-xs text-[#90a4ae] max-w-[180px] mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => setAuthModal("register")}
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#0891b2] rounded-xl shadow-lg shadow-[#06B6D4]/25 hover:shadow-xl hover:shadow-[#06B6D4]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              เริ่มใช้งานฟรี
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ Footer ═══════ */}
      <footer id="contact" className="bg-white border-t border-gray-100 pt-14 pb-8 text-[#455a64]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-[#06B6D4] to-[#0891b2] rounded-xl flex items-center justify-center shadow-md shadow-[#06B6D4]/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-[#455a64]">
                  EASY<span className="text-[#06B6D4]">PRINT</span>
                </span>
              </div>
              <p className="text-[#78909c] text-sm leading-relaxed max-w-sm">
                ประสบการณ์ใหม่สำหรับการสั่งพิมพ์งานออนไลน์ เพื่อความสะดวกสบาย พร้อมการแจ้งเตือนสถานะ ครบจบในที่เดียว
              </p>

              <div className="flex gap-3 mt-6">
                {[
                  {
                    icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 13 19.79 19.79 0 011.61 4.41C1.61 3.26 2.39 2.26 3.52 2H6.5a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.55 9.5a16 16 0 006.91 6.91l.78-.78a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />,
                    title: "เบอร์โทรศัพท์",
                    action: () => { }
                  },
                  {
                    icon: (
                      <>
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </>
                    ),
                    title: "อีเมล",
                    action: () => { }
                  },
                  {
                    icon: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
                    title: "แชท",
                    action: () => { }
                  },
                  {
                    icon: (
                      <>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </>
                    ),
                    title: "ตำแหน่งร้านค้า",
                    action: () => shopInfo.maps_url && window.open(shopInfo.maps_url, '_blank'),
                    show: !!shopInfo.maps_url
                  }
                ].filter(btn => btn.show !== false).map((btn, i) => (
                  <button
                    key={i}
                    onClick={btn.action}
                    title={btn.title}
                    className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-[#78909c] hover:text-[#06B6D4] hover:border-[#06B6D4] hover:bg-[#06B6D4]/10 transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {btn.icon}
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[#06B6D4] font-semibold uppercase tracking-widest text-xs mb-4">Platform</h4>
              <ul className="space-y-2.5 text-[#78909c] text-sm">
                {[
                  { name: "สั่งพิมพ์งาน", href: "/customer/order" },
                  { name: "ดูราคาบริการ", href: "/customer/pricing" },
                  { name: "ติดตามสถานะ", href: "/customer/tracking" },
                ].map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="hover:text-[#06B6D4] transition-colors inline-flex items-center gap-1.5 group">
                      <span className="w-0 group-hover:w-3 h-px bg-[#06B6D4] transition-all duration-200 rounded-full" />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[#06B6D4] font-semibold uppercase tracking-widest text-xs mb-4">Company</h4>
              <ul className="space-y-2.5 text-[#78909c] text-sm">
                {["เกี่ยวกับเรา", "นโยบายความเป็นส่วนตัว", "ข้อกำหนดการใช้งาน"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-[#06B6D4] transition-colors inline-flex items-center gap-1.5 group">
                      <span className="w-0 group-hover:w-3 h-px bg-[#06B6D4] transition-all duration-200 rounded-full" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 text-center text-[#90a4ae] text-xs">
            © 2026 EasyPrint. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
