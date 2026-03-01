"use client"

import { useState } from "react"
import { Search, Bell, Lock, AlertCircle, Save, CreditCard, UploadCloud, User } from "lucide-react"

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

    return (
        <div className="p-8 pb-16 bg-[#F8FAFC] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
                <div className="flex-1 mr-6">
                    <h1 className="text-3xl font-bold text-[#455a64]">ตั้งค่า</h1>
                    <p className="text-[13px] text-gray-500 mt-1">จัดการการตั้งค่าและตัวเลือกของร้านค้าของคุณ</p>
                </div>
                <div className="flex items-center gap-4 px-2 border-l border-[#e5e7eb] pl-6">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-[#455a64]">Shop EasyPrint</p>
                        <p className="text-[11px] font-medium text-gray-400">Test User</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#06B6D4] flex items-center justify-center text-white shadow-md">
                        <User size={20} />
                    </div>
                </div>
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
                                            <p className="font-bold text-[#1e293b] text-sm">ได้รับการชำระเงิน</p>
                                            <p className="text-[13px] text-gray-500 mt-0.5">รับการแจ้งเตือนหลังจากมีการชำระเงิน</p>
                                        </div>
                                        <Toggle
                                            active={notifSettings.paymentsReceived}
                                            onChange={() => setNotifSettings(prev => ({ ...prev, paymentsReceived: !prev.paymentsReceived }))}
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

                                    <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                                        <div>
                                            <p className="font-bold text-[#1e293b] text-sm">การยกเลิกคำสั่งซื้อ</p>
                                            <p className="text-[13px] text-gray-500 mt-0.5">รับการแจ้งเตือนเมื่อคำสั่งซื้อถูกยกเลิก</p>
                                        </div>
                                        <Toggle
                                            active={notifSettings.orderCancellations}
                                            onChange={() => setNotifSettings(prev => ({ ...prev, orderCancellations: !prev.orderCancellations }))}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pb-6">
                                        <div>
                                            <p className="font-bold text-[#1e293b] text-sm">การแจ้งเตือนทางอีเมล</p>
                                            <p className="text-[13px] text-gray-500 mt-0.5">รับการแจ้งเตือนผ่านกล่องข้อความอีเมล</p>
                                        </div>
                                        <Toggle
                                            active={notifSettings.emailNotifications}
                                            onChange={() => setNotifSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <button className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-6 py-2.5 rounded-[10px] text-[13px] font-bold flex items-center gap-2 transition-all shadow-[0_2px_10px_rgba(29,78,216,0.2)]">
                                            <Save size={16} strokeWidth={2.5} />
                                            บันทึกการตั้งค่าการแจ้งเตือน
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
                                        <button className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-6 py-2.5 rounded-[10px] text-[13px] font-bold flex items-center gap-2 transition-all shadow-[0_2px_10px_rgba(29,78,216,0.2)]">
                                            <Lock size={16} strokeWidth={2.5} />
                                            เปลี่ยนรหัสผ่าน
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
                                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group relative overflow-hidden">
                                            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                                <UploadCloud size={24} />
                                            </div>
                                            <p className="text-[13px] font-bold text-gray-700">คลิกเพื่ออัปโหลดไฟล์ QR Code</p>
                                            <p className="text-[12px] text-gray-500 mt-1">รองรับไฟล์ JPG, PNG</p>
                                        </div>
                                    </div>

                                    <div className="pt-2 mb-8">
                                        <button className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-6 py-2.5 rounded-[10px] text-[13px] font-bold flex items-center gap-2 transition-all shadow-[0_2px_10px_rgba(29,78,216,0.2)]">
                                            <Save size={16} strokeWidth={2.5} />
                                            บันทึกข้อมูลการชำระเงิน
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
