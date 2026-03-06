"use client"

import { useState, useEffect } from "react"
import { User, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"

const SHOP_ID = "b9652bb2-cba5-4440-9d89-0f93f598cb67"

export default function MerchantProfile() {
    const [shopName, setShopName] = useState("Shop EasyPrint")
    const [userName, setUserName] = useState("เจ้าของร้าน")
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const { logout } = useAuth()

    useEffect(() => {
        const fetchShop = async () => {
            try {
                const { data, error } = await supabase
                    .from('shops')
                    .select('name')
                    .eq('id', SHOP_ID)
                    .single()
                if (data && data.name) setShopName(data.name)
            } catch (err) {
                console.error("Error fetching shop name:", err)
            }
        }

        try {
            const userStr = sessionStorage.getItem('user')
            if (userStr) {
                const user = JSON.parse(userStr)
                setUserName(user.name || user.email || "เจ้าของร้าน")
            }
        } catch { }

        fetchShop()

        const channel = supabase
            .channel(`shop-profile-sync`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'shops',
                    filter: `id=eq.${SHOP_ID}`
                },
                (payload) => {
                    if (payload.new && payload.new.name) {
                        setShopName(payload.new.name)
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const handleLogout = async () => {
        await logout()
    }

    return (
        <>
            <div
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-4 px-2 border-l border-[#e5e7eb] pl-6 cursor-pointer hover:opacity-80 transition-all group select-none"
            >
                <div className="text-right">
                    <p className="text-sm font-semibold text-[#455a64] group-hover:text-[#06B6D4] transition-colors">{shopName}</p>
                    <p className="text-[11px] font-medium text-gray-400">{userName}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#06B6D4] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <User size={20} />
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-[400px] rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                        <div className="p-8 text-center text-[#455a64]">
                            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6">
                                <LogOut size={40} />
                            </div>
                            <h3 className="text-2xl font-black mb-2">ออกจากระบบ?</h3>
                            <p className="text-sm text-[#90a4ae] leading-relaxed mb-8">
                                คุณแน่ใจหรือไม่ที่จะออกจากระบบร้านค้า?<br />
                                เซสชั่นการทำงานปัจจุบันจะสิ้นสุดลง
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 py-4 bg-gray-50 text-[#90a4ae] rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all border border-gray-100"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-sm font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
                                >
                                    ยืนยัน
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
