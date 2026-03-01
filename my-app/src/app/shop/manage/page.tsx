"use client"

import { useState } from "react"
import { Search, Info, UploadCloud, MapPin, AlertCircle, Save, User } from "lucide-react"

export default function ManageShopPage() {
    const [shopStatus, setShopStatus] = useState(true)

    const [basicInfo, setBasicInfo] = useState({
        name: "EASYPRINT",
        phone: "089-8888-251",
        address: "112 หมู่ 2 ตำบล ท่าเรือ อำเภอ เมือง จังหวัด นครศรีธรรมราช 80000"
    })

    const days = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"]

    const [schedule, setSchedule] = useState(
        days.map(day => ({
            day,
            isOpen: day !== "อาทิตย์",
            openTime: "08:00",
            closeTime: "18:00",
        }))
    )

    const handleScheduleToggle = (index: number) => {
        const newSchedule = [...schedule]
        newSchedule[index].isOpen = !newSchedule[index].isOpen
        setSchedule(newSchedule)
    }

    const applyToAll = () => {
        const firstDay = schedule[0]
        setSchedule(schedule.map(s => ({
            ...s,
            isOpen: firstDay.isOpen,
            openTime: firstDay.openTime,
            closeTime: firstDay.closeTime
        })))
    }

    return (
        <div className="p-8 pb-16 bg-[#F8FAFC] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold text-[#455a64]">จัดการร้านค้า</h1>
                    <p className="text-[13px] text-gray-500 mt-1">จัดการข้อมูลร้านค้า รูปภาพ เวลาทำการ และสถานะร้าน</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-[#e5e7eb] shadow-sm">
                        <div className="flex flex-col text-right">
                            <span className="text-xs font-medium text-[#90a4ae]">สถานะร้านค้า</span>
                            <span className={`text-sm font-bold ${shopStatus ? 'text-emerald-500' : 'text-gray-400'}`}>
                                {shopStatus ? 'เปิดร้านค้า' : 'ปิดร้านค้า'}
                            </span>
                        </div>
                        <Toggle active={shopStatus} onChange={() => setShopStatus(!shopStatus)} />
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
            </div>

            <div className="max-w-6xl mx-auto space-y-6">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column (2/3) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Basic Info */}
                        <div className="bg-white rounded-[14px] p-6 shadow-sm border border-gray-100">
                            <h2 className="text-[15px] font-bold text-[#1e293b] mb-5">ข้อมูลพื้นฐาน</h2>
                            <div className="grid grid-cols-2 gap-5 mb-5">
                                <div>
                                    <label className="block text-[13px] font-medium text-gray-600 mb-2">ชื่อร้านค้า</label>
                                    <input
                                        type="text"
                                        value={basicInfo.name}
                                        onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] transition-all text-gray-700 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-medium text-gray-600 mb-2">เบอร์โทรศัพท์</label>
                                    <input
                                        type="text"
                                        value={basicInfo.phone}
                                        onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] transition-all text-gray-700 font-medium"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-gray-600 mb-2">ที่อยู่</label>
                                <input
                                    type="text"
                                    value={basicInfo.address}
                                    onChange={(e) => setBasicInfo({ ...basicInfo, address: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] transition-all text-gray-700 font-medium"
                                />
                            </div>
                        </div>

                        {/* Store Cover Image */}
                        <div className="bg-white rounded-[14px] p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-[15px] font-bold text-[#1e293b]">ภาพร้าน</h2>
                                    <p className="text-[12px] text-gray-500 mt-1">อัปโหลดภาพร้านหรือภาพปกของคุณ (แนะนำขนาด 1200x400 พิกเซล, สูงสุด 10MB)</p>
                                </div>
                            </div>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl h-[200px] flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer group relative overflow-hidden">
                                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                <div className="w-12 h-12 bg-[#06B6D4]/10 text-[#06B6D4] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <UploadCloud size={24} />
                                </div>
                                <p className="text-[13px] font-bold text-[#1e293b]">คลิกเพื่ออัปโหลดภาพร้าน</p>
                                <p className="text-[12px] text-gray-400 mt-1">PNG, JPG หรือ WEBP (สูงสุด 10MB)</p>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (1/3) */}
                    <div className="flex flex-col gap-6 h-full">

                        {/* Shop Logo */}
                        <div className="bg-white rounded-[14px] p-6 shadow-sm border border-gray-100 flex-shrink-0">
                            <h2 className="text-[15px] font-bold text-[#1e293b] mb-4">โลโก้ร้าน</h2>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl h-[120px] flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer group relative overflow-hidden">
                                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                <div className="w-10 h-10 bg-[#06B6D4]/10 text-[#06B6D4] rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <UploadCloud size={20} />
                                </div>
                                <p className="text-[12px] font-bold text-[#1e293b]">โลโก้ร้านใหม่</p>
                                <p className="text-[10px] text-gray-400">PNG, JPG (สูงสุด 5 MB)</p>
                            </div>
                        </div>

                        {/* Location / View Map */}
                        <div className="bg-white rounded-[14px] p-6 shadow-sm border border-gray-100 flex-1 flex flex-col">
                            <h2 className="text-[15px] font-bold text-[#1e293b] mb-4">ตำแหน่งร้านค้า</h2>
                            <div className="flex-1 bg-gray-100 rounded-xl relative overflow-hidden border border-gray-200 min-h-[220px]">
                                {/* Simulated Google Map Thumbnail */}
                                <img src={`https://maps.googleapis.com/maps/api/staticmap?center=13.7563,100.5018&zoom=13&size=400x400&maptype=roadmap&markers=color:red%7C13.7563,100.5018&key=INVALID_KEY`} alt="Map" className="w-full h-full object-cover opacity-80" onError={(e) => {
                                    // Fallback if key invalid
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                                }} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <MapPin size={32} className="text-red-500 drop-shadow-md" />
                                </div>
                            </div>
                            <p className="text-[11px] text-center text-gray-400 mt-3 hover:text-[#06B6D4] cursor-pointer transition-colors">ลากหมุดเพื่อปรับตำแหน่งโลเคชัน</p>
                        </div>
                    </div>
                </div>

                {/* Operating Hours */}
                <div className="bg-white rounded-[14px] p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-[15px] font-bold text-[#1e293b]">ตารางเวลาทำการ</h2>
                            <p className="text-[12px] text-gray-500 mt-1">กำหนดเวลาเปิด-ปิดร้านสำหรับแต่ละวัน</p>
                        </div>
                        <button onClick={applyToAll} className="px-4 py-2 border border-gray-200 hover:border-[#06B6D4] hover:text-[#06B6D4] text-[12px] font-bold text-gray-600 rounded-lg transition-colors">
                            ใช้เวลาเดียวกันทุกวัน
                        </button>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="py-4 px-2 text-[12px] font-bold text-gray-500 w-[15%]">วัน</th>
                                    <th className="py-4 px-2 text-[12px] font-bold text-gray-500 w-[20%]">สถานะ</th>
                                    <th className="py-4 px-2 text-[12px] font-bold text-gray-500 w-[25%]">เวลาเปิด</th>
                                    <th className="py-4 px-2 text-[12px] font-bold text-gray-500 w-[25%]">เวลาปิด</th>
                                    <th className="py-4 px-2 text-[12px] font-bold text-gray-500 w-[15%]">ชั่วโมงทำการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.map((day, index) => {
                                    let hoursText = "ปิดทำการ"
                                    if (day.isOpen) {
                                        hoursText = `${day.openTime} - ${day.closeTime}`
                                    }

                                    return (
                                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-2">
                                                <span className={`text-[13px] font-bold ${day.isOpen ? 'text-[#1e293b]' : 'text-gray-400'}`}>{day.day}</span>
                                            </td>
                                            <td className="py-4 px-2">
                                                <div className="flex items-center gap-2">
                                                    <Toggle active={day.isOpen} onChange={() => handleScheduleToggle(index)} />
                                                    <span className={`text-[12px] font-bold ${day.isOpen ? 'text-[#10b981]' : 'text-gray-400'}`}>
                                                        {day.isOpen ? 'เปิด' : 'ปิด'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2">
                                                <input
                                                    type="time"
                                                    value={day.openTime}
                                                    onChange={(e) => {
                                                        const newSchedule = [...schedule]
                                                        newSchedule[index].openTime = e.target.value
                                                        setSchedule(newSchedule)
                                                    }}
                                                    disabled={!day.isOpen}
                                                    className={`px-3 py-1.5 rounded-lg border text-[13px] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] transition-all bg-gray-50 ${!day.isOpen ? 'opacity-50 border-gray-100 text-gray-400' : 'border-gray-200 text-gray-700'}`}
                                                />
                                            </td>
                                            <td className="py-4 px-2">
                                                <input
                                                    type="time"
                                                    value={day.closeTime}
                                                    onChange={(e) => {
                                                        const newSchedule = [...schedule]
                                                        newSchedule[index].closeTime = e.target.value
                                                        setSchedule(newSchedule)
                                                    }}
                                                    disabled={!day.isOpen}
                                                    className={`px-3 py-1.5 rounded-lg border text-[13px] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] transition-all bg-gray-50 ${!day.isOpen ? 'opacity-50 border-gray-100 text-gray-400' : 'border-gray-200 text-gray-700'}`}
                                                />
                                            </td>
                                            <td className="py-4 px-2">
                                                <span className={`text-[12px] font-medium ${day.isOpen ? 'text-gray-600' : 'text-red-400 font-bold'}`}>
                                                    {hoursText}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Alert */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-[14px] p-5 flex items-start gap-3">
                    <AlertCircle size={18} className="text-[#06B6D4] shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-[#06B6D4] text-[13px] mb-1">ข้อมูลส่วนนี้จะแสดงให้ลูกค้าทั่วไป</h3>
                        <p className="text-[12px] text-blue-900/70 font-medium">โปรดตรวจสอบความถูกต้องของข้อมูล เพื่อให้ลูกค้าสามารถติดต่อและหาร้านของคุณได้อย่างถูกต้อง</p>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 mb-4">
                    <button className="bg-[#06B6D4] hover:bg-[#0891b2] text-white px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-[#06B6D4]/20 hover:shadow-lg hover:shadow-[#06B6D4]/30 hover:-translate-y-0.5">
                        <Save size={18} strokeWidth={2.5} />
                        บันทึกการเปลี่ยนแปลง
                    </button>
                </div>

            </div>
        </div >
    )
}

function Toggle({ active, onChange }: { active: boolean; onChange: () => void }) {
    return (
        <button
            type="button"
            className={`w-[42px] h-[24px] rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10b981]/30 ${active ? 'bg-[#10b981]' : 'bg-gray-200'}`}
            onClick={onChange}
        >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-[4px] transition-transform duration-300 shadow-sm ${active ? 'translate-x-[22px]' : 'translate-x-[4px]'}`} />
        </button>
    )
}
