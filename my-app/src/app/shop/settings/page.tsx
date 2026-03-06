"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Bell, Lock, AlertCircle, Save, CreditCard, UploadCloud, User, Loader2, Check, XCircle, X, LogOut } from "lucide-react"
import MerchantProfile from "@/components/ui/shop/MerchantProfile"
import { supabase } from "@/lib/supabase"

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<"payment" | "notifications" | "security">("payment")

    // Settings states
    const [notifSettings, setNotifSettings] = useState({
        newOrders: true,
        paymentsReceived: true,
        newMessages: true,
        orderCancellations: true,
        emailNotifications: false,
    })

    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: ""
    })

    const [paymentSettings, setPaymentSettings] = useState({
        bankName: "",
        accountName: "",
        accountNumber: "",
        promptPayQr: null as string | null
    })

    const [qrFile, setQrFile] = useState<File | null>(null)
    const [qrPreview, setQrPreview] = useState<string | null>(null)
    const [isSavingPayment, setIsSavingPayment] = useState(false)
    const [isSavingNotifications, setIsSavingNotifications] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState("บันทึกข้อมูลเรียบร้อยแล้ว")
    const [alertModal, setAlertModal] = useState<{ type: 'error' | 'warning'; title: string; message: string } | null>(null)
    const qrInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const fetchPaymentSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('shops')
                    .select('bank_name, account_name, account_number, promptpay_qr_url, notify_new_orders, notify_payments_received, notify_new_messages, notify_order_cancellations, notify_email_notifications')
                    .eq('id', 'b9652bb2-cba5-4440-9d89-0f93f598cb67')
                    .single()

                if (error) throw error

                if (data) {
                    setPaymentSettings({
                        bankName: data.bank_name || "",
                        accountName: data.account_name || "",
                        accountNumber: data.account_number || "",
                        promptPayQr: data.promptpay_qr_url || null
                    })
                    if (data.promptpay_qr_url) {
                        setQrPreview(data.promptpay_qr_url)
                    }

                    // Set notification settings
                    setNotifSettings({
                        newOrders: data.notify_new_orders ?? true,
                        paymentsReceived: data.notify_payments_received ?? true,
                        newMessages: data.notify_new_messages ?? true,
                        orderCancellations: data.notify_order_cancellations ?? true,
                        emailNotifications: data.notify_email_notifications ?? false,
                    })
                }
            } catch (error) {
                console.error("Error fetching payment settings:", error)
            }
        }
        fetchPaymentSettings()
    }, [])

    const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setQrFile(file)
        setQrPreview(URL.createObjectURL(file))
    }

    const handleSavePayment = async () => {
        setIsSavingPayment(true)
        try {
            let qrUrl = paymentSettings.promptPayQr

            if (qrFile) {
                const fileExt = qrFile.name.split('.').pop()
                const fileName = `qr_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
                const filePath = `receipts/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('slips')
                    .upload(filePath, qrFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('slips')
                    .getPublicUrl(filePath)

                qrUrl = publicUrl
            }

            const { error } = await supabase
                .from('shops')
                .update({
                    bank_name: paymentSettings.bankName,
                    account_name: paymentSettings.accountName,
                    account_number: paymentSettings.accountNumber,
                    promptpay_qr_url: qrUrl
                })
                .eq('id', 'b9652bb2-cba5-4440-9d89-0f93f598cb67')

            if (error) throw error

            setPaymentSettings(prev => ({ ...prev, promptPayQr: qrUrl }))
            setSuccessMessage("ข้อมูลการชำระเงินอัปเดตเรียบร้อยแล้ว")
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 1500)

        } catch (error: any) {
            console.error("Error saving payment settings:", error)
            setAlertModal({ type: 'error', title: 'ไม่สามารถบันทึกได้', message: error.message })
        } finally {
            setIsSavingPayment(false)
            setQrFile(null)
        }
    }

    const handleSaveNotificationSettings = async () => {
        setIsSavingNotifications(true)
        try {
            const { error } = await supabase
                .from('shops')
                .update({
                    notify_new_orders: notifSettings.newOrders,
                    notify_payments_received: notifSettings.paymentsReceived,
                    notify_new_messages: notifSettings.newMessages,
                    notify_order_cancellations: notifSettings.orderCancellations,
                    notify_email_notifications: notifSettings.emailNotifications
                })
                .eq('id', 'b9652bb2-cba5-4440-9d89-0f93f598cb67')

            if (error) throw error

            setSuccessMessage("บันทึกการตั้งค่าการแจ้งเตือนเรียบร้อยแล้ว")
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 1500)
        } catch (error: any) {
            console.error("Error saving notification settings:", error)
            setAlertModal({ type: 'error', title: 'ไม่สามารถบันทึกได้', message: error.message })
        } finally {
            setIsSavingNotifications(false)
        }
    }

    const handleChangePassword = async () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            setAlertModal({ type: 'warning', title: 'ข้อมูลไม่ครบถ้วน', message: 'กรุณากรอกรหัสผ่านทุกช่องให้ครบถ้วน' })
            return
        }

        if (passwords.new !== passwords.confirm) {
            setAlertModal({ type: 'warning', title: 'รหัสผ่านไม่ตรงกัน', message: 'รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง' })
            return
        }

        if (passwords.new.length < 8) {
            setAlertModal({ type: 'warning', title: 'รหัสผ่านสั้นเกินไป', message: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร' })
            return
        }

        setIsChangingPassword(true)
        try {
            // Get current user email from sessionStorage (set by AuthContext on login)
            const storedUser = sessionStorage.getItem('user')
            if (!storedUser) throw new Error("ไม่พบข้อมูลผู้ใช้ กรุณาล็อกอินใหม่")
            const userObj = JSON.parse(storedUser)
            const email = userObj?.email
            if (!email) throw new Error("ไม่พบอีเมลผู้ใช้ กรุณาล็อกอินใหม่")

            // Call the backend to verify old password and update to new one
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
            const res = await fetch(`${API_URL}/api/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    currentPassword: passwords.current,
                    newPassword: passwords.new,
                }),
            })

            const result = await res.json()
            if (!res.ok) {
                throw new Error(result.error || "ไม่สามารถเปลี่ยนรหัสผ่านได้")
            }

            // Success! Clear form and show success message
            setPasswords({ current: "", new: "", confirm: "" })
            setSuccessMessage("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว")
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 2000)

        } catch (error: any) {
            console.error("Error changing password:", error)
            setAlertModal({ type: 'error', title: 'ไม่สามารถเปลี่ยนรหัสผ่านได้', message: error.message })
        } finally {
            setIsChangingPassword(false)
        }
    }

    return (
        <div className="p-8 pb-16 bg-[#F8FAFC] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
                <div className="flex-1 mr-6">
                    <h1 className="text-3xl font-bold text-[#455a64]">ตั้งค่า</h1>
                    <p className="text-[13px] text-gray-500 mt-1">จัดการการตั้งค่าและตัวเลือกของร้านค้าของคุณ</p>
                </div>
                <MerchantProfile />
            </div>

            <div className="max-w-4xl mx-auto space-y-6">

                <div className="bg-white rounded-[14px] shadow-sm border border-gray-100 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 px-6 pt-2">
                        <button
                            onClick={() => setActiveTab("payment")}
                            className={`flex items-center gap-2 px-4 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === "payment" ? "border-[#1d4ed8] text-[#1d4ed8]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                        >
                            <CreditCard size={18} />
                            ตั้งค่าการชำระเงิน
                        </button>
                        <button
                            onClick={() => setActiveTab("notifications")}
                            className={`flex items-center gap-2 px-4 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === "notifications" ? "border-[#1d4ed8] text-[#1d4ed8]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                        >
                            <Bell size={18} />
                            รับการแจ้งเตือน
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={`flex items-center gap-2 px-4 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === "security" ? "border-[#1d4ed8] text-[#1d4ed8]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                        >
                            <Lock size={18} />
                            ความปลอดภัย
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-8">
                        {activeTab === "notifications" && (
                            <div className="max-w-3xl animate-[fadeIn_0.3s_ease]">
                                <h2 className="text-[15px] font-bold text-[#1e293b] mb-6">เลือกการแจ้งเตือนที่คุณต้องการรับ</h2>

                                <div className="space-y-6">
                                    {/* Toggle Items */}
                                    <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                                        <div>
                                            <p className="font-bold text-[#1e293b] text-sm">คำสั่งซื้อใหม่</p>
                                            <p className="text-[13px] text-gray-500 mt-0.5">รับการแจ้งเตือนเมื่อมีคำสั่งซื้อใหม่เข้ามา</p>
                                        </div>
                                        <Toggle
                                            active={notifSettings.newOrders}
                                            onChange={() => setNotifSettings(prev => ({ ...prev, newOrders: !prev.newOrders }))}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                                        <div>
                                            <p className="font-bold text-[#1e293b] text-sm">ข้อความใหม่</p>
                                            <p className="text-[13px] text-gray-500 mt-0.5">รับการแจ้งเตือนเมื่อลูกค้าส่งข้อความมาหาคุณ</p>
                                        </div>
                                        <Toggle
                                            active={notifSettings.newMessages}
                                            onChange={() => setNotifSettings(prev => ({ ...prev, newMessages: !prev.newMessages }))}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pb-6">
                                        <div>
                                            <p className="font-bold text-[#1e293b] text-sm">การยกเลิกคำสั่งซื้อ</p>
                                            <p className="text-[13px] text-gray-500 mt-0.5">รับการแจ้งเตือนเมื่อคำสั่งซื้อถูกยกเลิก</p>
                                        </div>
                                        <Toggle
                                            active={notifSettings.orderCancellations}
                                            onChange={() => setNotifSettings(prev => ({ ...prev, orderCancellations: !prev.orderCancellations }))}
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            onClick={handleSaveNotificationSettings}
                                            disabled={isSavingNotifications}
                                            className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-6 py-2.5 rounded-[10px] text-[13px] font-bold flex items-center gap-2 transition-all shadow-[0_2px_10px_rgba(29,78,216,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSavingNotifications ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} strokeWidth={2.5} />}
                                            {isSavingNotifications ? "กำลังบันทึก..." : "บันทึกการตั้งค่าการแจ้งเตือน"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="max-w-2xl animate-[fadeIn_0.3s_ease]">
                                <h2 className="text-[15px] font-bold text-[#1e293b] mb-6">อัปเดตรหัสผ่านเพื่อรักษาบัญชีของคุณให้ปลอดภัย</h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#1e293b] mb-2">รหัสผ่านปัจจุบัน</label>
                                        <input
                                            type="password"
                                            placeholder="กรอกรหัสผ่านปัจจุบัน"
                                            value={passwords.current}
                                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/30 focus:border-[#1d4ed8] transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-[#1e293b] mb-2">รหัสผ่านใหม่</label>
                                        <input
                                            type="password"
                                            placeholder="กรอกรหัสผ่านใหม่"
                                            value={passwords.new}
                                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/30 focus:border-[#1d4ed8] transition-all mb-1.5"
                                        />
                                        <p className="text-[12px] font-medium text-gray-500">รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร</p>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-[#1e293b] mb-2">ยืนยันรหัสผ่านใหม่</label>
                                        <input
                                            type="password"
                                            placeholder="ยืนยันรหัสผ่านใหม่"
                                            value={passwords.confirm}
                                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/30 focus:border-[#1d4ed8] transition-all"
                                        />
                                    </div>

                                    <div className="pt-2 mb-8">
                                        <button
                                            onClick={handleChangePassword}
                                            disabled={isChangingPassword}
                                            className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-6 py-2.5 rounded-[10px] text-[13px] font-bold flex items-center gap-2 transition-all shadow-[0_2px_10px_rgba(29,78,216,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isChangingPassword ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} strokeWidth={2.5} />}
                                            {isChangingPassword ? "กำลังเปลี่ยนรหัสผ่าน..." : "เปลี่ยนรหัสผ่าน"}
                                        </button>
                                    </div>

                                    {/* Security Tips */}
                                    <div className="bg-blue-50/50 border border-blue-100 rounded-[14px] p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <AlertCircle size={18} className="text-[#1d4ed8]" />
                                            <h3 className="font-bold text-[#1d4ed8] text-[15px]">คำแนะนำด้านความปลอดภัย</h3>
                                        </div>
                                        <ul className="text-[13px] text-blue-900/70 space-y-2 font-medium list-disc pl-5">
                                            <li>ใช้รหัสผ่านที่รัดกุมและไม่ซ้ำกับที่อื่น</li>
                                            <li>อย่าแชร์รหัสผ่านกับผู้อื่น</li>
                                            <li>เปลี่ยนรหัสผ่านเป็นประจำ</li>
                                            <li>เปิดใช้งานการยืนยันตัวตนแบบสองขั้นตอนเมื่อทำได้</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "payment" && (
                            <div className="max-w-2xl animate-[fadeIn_0.3s_ease]">
                                <h2 className="text-[15px] font-bold text-[#1e293b] mb-6">จัดการบัญชีธนาคารและพร้อมเพย์ (PromptPay) สำหรับรับการชำระเงิน</h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#1e293b] mb-2">ชื่อธนาคาร</label>
                                        <select
                                            value={paymentSettings.bankName}
                                            onChange={(e) => setPaymentSettings({ ...paymentSettings, bankName: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/30 focus:border-[#1d4ed8] transition-all text-gray-700"
                                        >
                                            <option value="">เลือกธนาคาร</option>
                                            <option value="kbank">ธนาคารกสิกรไทย</option>
                                            <option value="scb">ธนาคารไทยพาณิชย์</option>
                                            <option value="ktb">ธนาคารกรุงไทย</option>
                                            <option value="bbl">ธนาคารกรุงเทพ</option>
                                            <option value="bay">ธนาคารกรุงศรีอยุธยา</option>
                                            <option value="ttb">ทีเอ็มบีธนชาต (ttb)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-[#1e293b] mb-2">ชื่อบัญชี</label>
                                        <input
                                            type="text"
                                            placeholder="เช่น นาย สมชาย ใจดี"
                                            value={paymentSettings.accountName}
                                            onChange={(e) => setPaymentSettings({ ...paymentSettings, accountName: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/30 focus:border-[#1d4ed8] transition-all text-gray-700"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-[#1e293b] mb-2">เลขที่บัญชี</label>
                                        <input
                                            type="text"
                                            placeholder="เช่น 123-4-56789-0"
                                            value={paymentSettings.accountNumber}
                                            onChange={(e) => setPaymentSettings({ ...paymentSettings, accountNumber: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/30 focus:border-[#1d4ed8] transition-all text-gray-700"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-[#1e293b] mb-2">อัปโหลด QR Code (PromptPay)</label>
                                        <div
                                            onClick={() => qrInputRef.current?.click()}
                                            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group relative overflow-hidden flex flex-col items-center justify-center"
                                        >
                                            <input
                                                ref={qrInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleQrChange}
                                            />
                                            {qrPreview ? (
                                                <div className="flex flex-col items-center">
                                                    <img src={qrPreview} alt="QR Code" className="max-h-40 rounded-xl shadow-sm mb-3 border border-gray-100" />
                                                    <p className="text-[13px] font-bold text-gray-700">คลิกเพื่อเปลี่ยน QR Code</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                                        <UploadCloud size={24} />
                                                    </div>
                                                    <p className="text-[13px] font-bold text-gray-700">คลิกเพื่ออัปโหลดไฟล์ QR Code</p>
                                                    <p className="text-[12px] text-gray-500 mt-1">รองรับไฟล์ JPG, PNG</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-2 mb-8">
                                        <button
                                            onClick={handleSavePayment}
                                            disabled={isSavingPayment}
                                            className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-6 py-2.5 rounded-[10px] text-[13px] font-bold flex items-center gap-2 transition-all shadow-[0_2px_10px_rgba(29,78,216,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSavingPayment ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} strokeWidth={2.5} />}
                                            {isSavingPayment ? "กำลังบันทึก..." : "บันทึกข้อมูลการชำระเงิน"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Alert/Error Modal */}
            {alertModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-[340px] rounded-[28px] p-8 shadow-2xl text-center animate-in zoom-in-95 duration-200">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${alertModal.type === 'error' ? 'bg-red-50' : 'bg-amber-50'
                            }`}>
                            {alertModal.type === 'error'
                                ? <XCircle className="w-9 h-9 text-red-500" />
                                : <AlertCircle className="w-9 h-9 text-amber-500" />
                            }
                        </div>
                        <h3 className="text-[17px] font-bold text-[#1e293b] mb-1.5">{alertModal.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{alertModal.message}</p>
                        <button
                            onClick={() => setAlertModal(null)}
                            className={`mt-6 w-full py-2.5 rounded-[12px] text-sm font-bold text-white transition-all ${alertModal.type === 'error'
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-amber-500 hover:bg-amber-600'
                                }`}
                        >
                            ตกลง
                        </button>
                    </div>
                </div>
            )}

            {/* Processing / Success Modal */}
            {
                (isSavingPayment || isSavingNotifications || isChangingPassword || showSuccess) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-[320px] rounded-[32px] p-8 shadow-2xl text-center animate-in zoom-in-95 duration-300">
                            {(isSavingPayment || isSavingNotifications || isChangingPassword) ? (
                                <>
                                    <div className="w-16 h-16 bg-[#E0F7FA] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Loader2 className="w-10 h-10 text-[#06B6D4] animate-spin" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#455a64]">กำลังบันทึก...</h3>
                                    <p className="text-sm text-[#90a4ae] mt-1">กรุณารอสักครู่ ระบบกำลังอัปเดตข้อมูล</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check size={40} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#455a64]">บันทึกสำเร็จ!</h3>
                                    <p className="text-sm text-[#90a4ae] mt-1">{successMessage}</p>
                                </>
                            )}
                        </div>
                    </div>
                )
            }

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}

function Toggle({ active, onChange }: { active: boolean; onChange: () => void }) {
    return (
        <button
            type="button"
            className={`w-12 h-[26px] rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d4ed8]/30 ${active ? 'bg-[#1d4ed8]' : 'bg-gray-200'}`}
            onClick={onChange}
        >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-[3px] transition-transform duration-300 shadow-sm ${active ? 'translate-x-[24px]' : 'translate-x-[3px]'}`} />
        </button>
    )
}
