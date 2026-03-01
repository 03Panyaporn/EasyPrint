"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Search, Plus, Edit2, Trash2, FileText, Settings, Play } from "lucide-react"

// Mock data
const mockServices = [
    {
        id: "1",
        name: "ปริ้นเอกสารขาวดำ",
        category: "ถ่ายเอกสาร",
        basePrice: 1.00,
        unit: "ต่อหน้า",
        status: "ใช้งาน",
        icon: FileText
    },
    {
        id: "2",
        name: "ปริ้นเอกสารสี",
        category: "งานปริ้น",
        basePrice: 5.00,
        unit: "ต่อหน้า",
        status: "ใช้งาน",
        icon: FileText
    },
    {
        id: "3",
        name: "โปสเตอร์ A3",
        category: "โปสเตอร์",
        basePrice: 20.00,
        unit: "ต่อชิ้น",
        status: "ใช้งาน",
        icon: FileText
    },
    {
        id: "4",
        name: "เคลือบพลาสติก A4",
        category: "งานหลังพิมพ์",
        basePrice: 15.00,
        unit: "ต่อชิ้น",
        status: "ใช้งาน",
        icon: Settings
    },
    {
        id: "5",
        name: "เข้าเล่มกระดูกงู",
        category: "งานหลังพิมพ์",
        basePrice: 30.00,
        unit: "ต่อชิ้น",
        status: "ใช้งาน",
        icon: Settings
    },
]

export default function ServicesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("ทั้งหมด")
    const [services, setServices] = useState(mockServices)

    // Filter Logic
    const filteredServices = services.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.category.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesTab = activeTab === "ทั้งหมด" || service.category === activeTab
        return matchesSearch && matchesTab
    })

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
    }

    const handleDelete = (id: string) => {
        setServices(prev => prev.filter(service => service.id !== id))
    }

    return (
        <div className="p-8 pb-20 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#455a64] tracking-tight mb-2">
                        บริการและราคา
                    </h1>
                    <p className="text-[#90a4ae] text-base">
                        เพิ่มบริการและปรับราคาของสินค้า
                    </p>
                </div>

                <Link
                    href="/shop/services/add"
                    className="flex items-center gap-2 bg-[#7DD3E1] hover:bg-[#68C5D5] text-white px-4 py-2 mt-4 md:mt-2 rounded-xl font-medium transition-all shadow-sm hover:shadow transform hover:-translate-y-0.5 w-full md:w-auto justify-center text-sm"
                >
                    <Plus size={18} />
                    <span>เพิ่มสินค้าใหม่</span>
                </Link>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#eaf6f8] overflow-hidden flex flex-col">

                {/* Search and Tabs */}
                <div className="p-6 border-b border-[#eaf6f8] space-y-4">
                    <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">

                        {/* Search Bar */}
                        <div className="relative group w-full md:w-96">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-[#90a4ae] group-focus-within:text-[#06B6D4] transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="ค้นหาสินค้าหรือบริการ..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full bg-[#FAFAFA] border border-[#E0E0E0] rounded-2xl py-3 pl-12 pr-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4] transition-all placeholder:text-[#9EA3B0]"
                            />
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            {["ทั้งหมด", "งานปริ้น", "ถ่ายเอกสาร", "โปสเตอร์", "งานหลังพิมพ์"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabChange(tab)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab
                                        ? "text-[#455a64] bg-[#F8FAFC]"
                                        : "text-[#90a4ae] hover:text-[#455a64] hover:bg-gray-50"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#eaf6f8] bg-[#F8FAFC]">
                                <th className="px-6 py-4 text-xs font-bold text-[#90a4ae] uppercase tracking-wider">ชื่อบริการ</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#90a4ae] uppercase tracking-wider text-center">หมวดหมู่</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#90a4ae] uppercase tracking-wider text-center">ราคาเริ่มต้น</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#90a4ae] uppercase tracking-wider text-center">หน่วย</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#90a4ae] uppercase tracking-wider text-center">สถานะ</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#90a4ae] uppercase tracking-wider text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eaf6f8]">
                            {filteredServices.length > 0 ? (
                                filteredServices.map((service) => (
                                    <tr key={service.id} className="hover:bg-[#F8FAFC] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#E0F7FA] flex items-center justify-center text-[#06B6D4]">
                                                    <service.icon size={20} strokeWidth={2} />
                                                </div>
                                                <span className="font-bold text-[#455a64]">{service.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#64748b]">
                                                {service.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-[#455a64]">
                                            {service.basePrice.toFixed(2)} ฿
                                        </td>
                                        <td className="px-6 py-4 text-center text-[#90a4ae] text-sm">
                                            {service.unit}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                {service.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href="/shop/services/add" className="p-2 text-[#90a4ae] hover:text-[#06B6D4] hover:bg-[#E0F7FA] rounded-xl transition-colors block">
                                                    <Edit2 size={18} />
                                                </Link>
                                                <button onClick={() => handleDelete(service.id)} className="p-2 text-[#ff8a8a] hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[#90a4ae]">
                                        ไม่พบข้อมูลที่ค้นหา
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Info Text */}
                <div className="p-6 border-t border-[#eaf6f8] flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-sm text-[#90a4ae]">
                        แสดง {filteredServices.length} รายการ
                    </span>
                </div>

            </div>
        </div>
    )
}
