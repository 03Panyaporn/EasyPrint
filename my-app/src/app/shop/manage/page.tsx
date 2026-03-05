"use client"

import { useState, useEffect } from "react"
import { Search, Info, UploadCloud, MapPin, AlertCircle, Save, User, Loader2, Check } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ManageShopPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [shopId, setShopId] = useState<string | null>(null)
    const [shopStatus, setShopStatus] = useState(true)

    const [basicInfo, setBasicInfo] = useState({
        name: "",
        phone: "",
        address: "",
        description: "",
        maps_url: ""
    })

    const days = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"]

    const [schedule, setSchedule] = useState(
        days.map(day => ({
            day,
            isOpen: true,
            openTime: "08:00",
            closeTime: "18:00",
        }))
    )

    useEffect(() => {
        const fetchShop = async () => {
            setIsLoading(true)
            try {
                const targetId = "b9652bb2-cba5-4440-9d89-0f93f598cb67"

                const { data, error } = await supabase
                    .from('shops')
                    .select('*')
                    .eq('id', targetId)
                    .single()

                if (error) throw error

                if (data) {
                    setShopId(data.id)
                    setShopStatus(data.is_open ?? true)
                    setBasicInfo({
                        name: data.name || "",
                        phone: data.phone || "",
                        address: data.address || "",
                        description: data.description || "",
                        maps_url: data.maps_url || ""
                    })

                    if (data.open_hours) {
                        setSchedule(data.open_hours)
                    }
                }
            } catch (error: any) {
                console.error("Error fetching shop data:", error)
                alert("ไม่สามารถดึงข้อมูลร้านค้าได้: " + error.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchShop()

        const channel = supabase.channel('shop-status-manage')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'shops',
                filter: `id=eq.b9652bb2-cba5-4440-9d89-0f93f598cb67`
            }, (payload) => {
                if (payload.new && typeof payload.new.is_open === 'boolean') {
                    setShopStatus(payload.new.is_open)
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const handleToggleShopStatus = async () => {
        const newStatus = !shopStatus
        setShopStatus(newStatus)

        try {
            const { error } = await supabase
                .from('shops')
                .update({ is_open: newStatus })
                .eq('id', "b9652bb2-cba5-4440-9d89-0f93f598cb67")
            if (error) throw error
        } catch (error) {
            console.error("Error toggling shop status:", error)
            setShopStatus(!newStatus)
            alert("ไม่สามารถอัปเดตสถานะร้านค้าได้แบบเรียลไทม์")
        }
    }

    const handleSave = async () => {
        if (!shopId) {
            alert("กรุณารีโหลดหน้าเว็บ")
            return
        }

        setIsSaving(true)
        try {
            console.log("Attempting to save data for shopId:", shopId)

            const { error } = await supabase
                .from('shops')
                .update({
                    name: basicInfo.name,
                    phone: basicInfo.phone,
                    address: basicInfo.address,
                    description: basicInfo.description,
                    maps_url: basicInfo.maps_url,
                    is_open: shopStatus,
                    open_hours: schedule
                })
                .eq('id', shopId)

            if (error) throw error


            setShowSuccess(true)
            setTimeout(() => {
                setShowSuccess(false)
            }, 1500)

        } catch (error: any) {
            console.error("Save error:", error)
            alert("เกิดข้อผิดพลาดในการบันทึก: " + (error.message))
        } finally {
            setIsSaving(false)
        }
    }

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

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
                <Loader2 className="w-10 h-10 text-[#06B6D4] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">กำลังโหลดข้อมูลร้านค้า...</p>
            </div>
        )
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
                            <span className={`text-sm font-bold ${shopStatus ? 'text-emerald-500' : 'text-rose-400'}`}>
                                {shopStatus ? 'เปิดร้านค้า' : 'ปิดร้านค้า'}
                            </span>
                        </div>
                        <Toggle active={shopStatus} onChange={handleToggleShopStatus} />
                    </div>

                    <div className="flex items-center gap-4 px-2 border-l border-[#e5e7eb] pl-6">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-[#455a64]">{basicInfo.name || "Shop EasyPrint"}</p>
                            <p className="text-[11px] font-medium text-gray-400">เจ้าของร้าน</p>
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
                                        placeholder="ระบุชื่อร้าน"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-medium text-gray-600 mb-2">เบอร์โทรศัพท์</label>
                                    <input
                                        type="text"
                                        value={basicInfo.phone}
                                        onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] transition-all text-gray-700 font-medium"
                                        placeholder="08X-XXX-XXXX"
                                    />
                                </div>
                            </div>
                            <div className="mb-5">
                                <label className="block text-[13px] font-medium text-gray-600 mb-2">คำอธิบายร้านค้า</label>
                                <textarea
                                    value={basicInfo.description}
                                    onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] transition-all text-gray-700 font-medium resize-none"
                                    placeholder="เล่ารายละเอียดเกี่ยวกับร้านค้าของคุณ..."
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-gray-600 mb-2">ที่อยู่</label>
                                <input
                                    type="text"
                                    value={basicInfo.address}
                                    onChange={(e) => setBasicInfo({ ...basicInfo, address: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] transition-all text-gray-700 font-medium"
                                    placeholder="ระบุที่อยู่ของร้าน"
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

                            <div className="mb-4">
                                <label className="block text-[12px] font-medium text-gray-600 mb-2">ลิงก์ Google Maps</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={basicInfo.maps_url}
                                        onChange={(e) => setBasicInfo({ ...basicInfo, maps_url: e.target.value })}
                                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[12px] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] transition-all text-gray-700 font-medium"
                                        placeholder="แปะลิงก์จาก Google Maps ที่นี่"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => basicInfo.maps_url && window.open(basicInfo.maps_url, '_blank')}
                                        disabled={!basicInfo.maps_url}
                                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-[12px] font-bold transition-all disabled:opacity-50"
                                    >
                                        เปิดดู
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-xl relative overflow-hidden border border-gray-100 min-h-[200px]">
                                {basicInfo.address || basicInfo.name ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(basicInfo.address || basicInfo.name)}&t=&z=17&ie=UTF8&iwloc=&output=embed`}
                                        allowFullScreen
                                        loading="lazy"
                                    ></iframe>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4">
                                        <MapPin size={32} className="mb-2 opacity-20" />
                                        <p className="text-[11px] font-medium text-center">กรอกชื่อร้านหรือที่อยู่<br />เพื่อแสดงพิกัดบนแผนที่</p>
                                    </div>
                                )}
                            </div>
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
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#06B6D4] hover:bg-[#0891b2] text-white px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-[#06B6D4]/20 hover:shadow-lg hover:shadow-[#06B6D4]/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save size={18} strokeWidth={2.5} />
                        )}
                        {isSaving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                    </button>
                </div>

            </div >

            {/* Processing / Success Modal */}
            {
                (isSaving || showSuccess) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-[320px] rounded-[32px] p-8 shadow-2xl text-center animate-in zoom-in-95 duration-300">
                            {isSaving ? (
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
                                    <p className="text-sm text-[#90a4ae] mt-1">ข้อมูลร้านค้าของคุณอัปเดตเรียบร้อยแล้ว</p>
                                </>
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    )
}

function Toggle({ active, onChange }: { active: boolean; onChange: () => void }) {
    return (
        <button
            type="button"
            className={`w-[42px] h-[24px] rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10b981]/30 ${active ? 'bg-[#10b981]' : 'bg-rose-400'}`}
            onClick={onChange}
        >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-[4px] transition-transform duration-300 shadow-sm ${active ? 'translate-x-[22px]' : 'translate-x-[4px]'}`} />
        </button>
    )
}
