"use client"

import { useState, useEffect } from "react"
import {
    Search,
    DollarSign,
    ShoppingBag,
    Clock,
    TrendingUp,
    MoreHorizontal,
    ChevronDown,
    Eye,
    FileText,
    User,
} from "lucide-react"

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────
const statsCards = [
    {
        label: "รายได้วันนี้",
        value: "฿ 5,000",
        icon: DollarSign,
        color: "from-[#E0F7FA] to-[#B2EBF2]",
        iconColor: "text-[#06B6D4]",
        change: "+12%",
        changeUp: true,
    },
    {
        label: "ออเดอร์ทั้งหมด",
        value: "6",
        icon: ShoppingBag,
        color: "from-[#FFF9C4] to-[#FFF176]",
        iconColor: "text-[#F9A825]",
        change: "+3",
        changeUp: true,
    },
    {
        label: "ออเดอร์รอดำเนินการ",
        value: "3",
        icon: Clock,
        color: "from-[#F3E5F5] to-[#E1BEE7]",
        iconColor: "text-[#AB47BC]",
        change: "รอจัดการ",
        changeUp: false,
    },
]

const recentOrders = [
    {
        id: "#EP-001",
        customer: "สมชาย ใจดี",
        service: "ถ่ายสี A4 หน้าเดียว",
        quantity: "5 ชุด",
        price: "฿250",
        status: "เสร็จแล้ว",
        statusColor: "bg-emerald-100 text-emerald-700",
        date: "28 ก.พ. 69",
    },
    {
        id: "#EP-002",
        customer: "สมหญิง สุขใจ",
        service: "เข้าเล่มสันกาว",
        quantity: "2 ชุด",
        price: "฿180",
        status: "กำลังดำเนินการ",
        statusColor: "bg-amber-100 text-amber-700",
        date: "28 ก.พ. 69",
    },
    {
        id: "#EP-003",
        customer: "นายก้อง แสนดี",
        service: "โปสเตอร์ A3",
        quantity: "10 ชุด",
        price: "฿1,500",
        status: "รอดำเนินการ",
        statusColor: "bg-red-100 text-red-600",
        date: "28 ก.พ. 69",
    },
    {
        id: "#EP-004",
        customer: "พิมพ์ลดา สวัสดี",
        service: "ถ่ายขาวดำ A4 หน้าหลัง",
        quantity: "20 ชุด",
        price: "฿400",
        status: "เสร็จแล้ว",
        statusColor: "bg-emerald-100 text-emerald-700",
        date: "27 ก.พ. 69",
    },
    {
        id: "#EP-005",
        customer: "วรรณา เก่งมาก",
        service: "นามบัตร",
        quantity: "100 ใบ",
        price: "฿1,200",
        status: "กำลังดำเนินการ",
        statusColor: "bg-amber-100 text-amber-700",
        date: "27 ก.พ. 69",
    },
]

const topServices = [
    { name: "ถ่ายเอกสารขาวดำ", count: 120, percentage: 85, color: "bg-[#06B6D4]" },
    { name: "ถ่ายเอกสารสี", count: 98, percentage: 70, color: "bg-[#38bdf8]" },
    { name: "เข้าเล่มสันห่วง", count: 65, percentage: 48, color: "bg-[#7dd3fc]" },
    { name: "โปสเตอร์", count: 42, percentage: 30, color: "bg-[#a5f3fc]" },
    { name: "นามบัตร", count: 35, percentage: 25, color: "bg-[#cffafe]" },
]

// ─────────────────────────────────────────────
// Mini Chart Component (Revenue Trend)
// ─────────────────────────────────────────────
function RevenueChart() {
    const data = [1200, 2800, 1800, 3200, 2400, 4100, 5000]
    const labels = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."]
    const max = Math.max(...data)
    const height = 140
    const width = 100

    const points = data.map((val, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - (val / max) * height,
    }))

    const pathD = points
        .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
        .join(" ")

    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`

    return (
        <div className="relative w-full h-full">
            <svg viewBox={`-5 -10 ${width + 10} ${height + 30}`} className="w-full h-full" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0, 1, 2, 3].map((i) => (
                    <line
                        key={i}
                        x1={-5}
                        y1={(height / 3) * i}
                        x2={width + 5}
                        y2={(height / 3) * i}
                        stroke="#e5e7eb"
                        strokeWidth="0.3"
                        strokeDasharray="2,2"
                    />
                ))}
                {/* Area fill */}
                <path d={areaD} fill="url(#areaGradient)" />
                {/* Line */}
                <path d={pathD} fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {/* Dots */}
                {points.map((p, i) => (
                    <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="2.5"
                        fill="white"
                        stroke="#06B6D4"
                        strokeWidth="1.5"
                    />
                ))}
                {/* Labels */}
                {points.map((p, i) => (
                    <text
                        key={`label-${i}`}
                        x={p.x}
                        y={height + 15}
                        textAnchor="middle"
                        fontSize="5"
                        fill="#9ca3af"
                    >
                        {labels[i]}
                    </text>
                ))}
            </svg>
        </div>
    )
}

// ─────────────────────────────────────────────
// Main Dashboard Page
// ─────────────────────────────────────────────
export default function ShopDashboard() {
    const [userName, setUserName] = useState("ร้านค้า")
    const [filterPeriod, setFilterPeriod] = useState("Last 7 Days")

    useEffect(() => {
        try {
            const user = localStorage.getItem('user')
            if (user) {
                const parsed = JSON.parse(user)
                setUserName(parsed.name || parsed.email || "ร้านค้า")
            }
        } catch { }
    }, [])

    return (
        <div className="p-8">
            {/* ─── Top Bar ─── */}
            <div className="flex items-center justify-between mb-8">
                {/* Search */}
                <div className="relative w-[360px]">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="ค้นหาออเดอร์, ลูกค้า..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-[#e5e7eb] rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] transition-all shadow-sm"
                    />
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-[#455a64]">Shop EasyPrint</p>
                        <p className="text-xs text-[#90a4ae]">{userName}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#0891b2] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#06B6D4]/20">
                        <User size={18} />
                    </div>
                </div>
            </div>

            {/* ─── Stats Cards ─── */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                {statsCards.map((card) => {
                    const Icon = card.icon
                    return (
                        <div
                            key={card.label}
                            className="bg-white rounded-2xl p-6 border border-[#eaf6f8] shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-[#90a4ae] font-medium">{card.label}</p>
                                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={20} className={card.iconColor} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-[#455a64] tracking-tight">{card.value}</p>
                            <div className="flex items-center gap-1.5 mt-2">
                                {card.changeUp ? (
                                    <TrendingUp size={14} className="text-emerald-500" />
                                ) : (
                                    <Clock size={14} className="text-amber-500" />
                                )}
                                <span className={`text-xs font-medium ${card.changeUp ? "text-emerald-500" : "text-amber-500"}`}>
                                    {card.change}
                                </span>
                                {card.changeUp && <span className="text-xs text-[#90a4ae]">จากเมื่อวาน</span>}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ─── Orders Management ─── */}
            <div className="bg-white rounded-2xl border border-[#eaf6f8] shadow-sm mb-8 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f4f5]">
                    <div>
                        <h2 className="text-lg font-semibold text-[#455a64]">Orders Management</h2>
                        <p className="text-xs text-[#90a4ae] mt-0.5">จัดการออเดอร์ล่าสุดของร้านค้า</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-[#e5e7eb] rounded-xl text-sm text-[#78909c] hover:bg-[#f5fbfe] hover:border-[#06B6D4] hover:text-[#06B6D4] transition-all">
                        <FileText size={15} />
                        ดูทั้งหมด
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#fafbfc]">
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#90a4ae] uppercase tracking-wider">เลขออเดอร์</th>
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#90a4ae] uppercase tracking-wider">ลูกค้า</th>
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#90a4ae] uppercase tracking-wider">บริการ</th>
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#90a4ae] uppercase tracking-wider">จำนวน</th>
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#90a4ae] uppercase tracking-wider">ราคา</th>
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#90a4ae] uppercase tracking-wider">สถานะ</th>
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#90a4ae] uppercase tracking-wider">วันที่</th>
                                <th className="px-6 py-3.5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0f4f5]">
                            {recentOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-[#fafeff] transition-colors duration-150 group"
                                >
                                    <td className="px-6 py-4 text-sm font-semibold text-[#06B6D4]">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] flex items-center justify-center text-[#06B6D4] text-xs font-bold">
                                                {order.customer.charAt(0)}
                                            </div>
                                            <span className="text-sm text-[#455a64] font-medium">{order.customer}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#78909c]">{order.service}</td>
                                    <td className="px-6 py-4 text-sm text-[#78909c]">{order.quantity}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-[#455a64]">{order.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${order.statusColor}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#90a4ae]">{order.date}</td>
                                    <td className="px-6 py-4">
                                        <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#f0f4f5] rounded-lg transition-all">
                                            <Eye size={16} className="text-[#90a4ae]" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ─── Charts Section ─── */}
            <div className="grid grid-cols-2 gap-6">
                {/* Revenue Trends */}
                <div className="bg-white rounded-2xl border border-[#eaf6f8] shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-semibold text-[#455a64]">Revenue Trends</h3>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f5fbfe] border border-[#e5e7eb] rounded-lg text-xs text-[#78909c] hover:border-[#06B6D4] transition-all">
                            {filterPeriod}
                            <ChevronDown size={14} />
                        </button>
                    </div>
                    <div className="h-[200px]">
                        <RevenueChart />
                    </div>
                </div>

                {/* Top Selling Services */}
                <div className="bg-white rounded-2xl border border-[#eaf6f8] shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-semibold text-[#455a64]">Top Selling Services</h3>
                        <button className="text-xs text-[#06B6D4] hover:text-[#0891b2] font-medium transition-colors">
                            ดูรายละเอียด →
                        </button>
                    </div>
                    <div className="space-y-4">
                        {topServices.map((service) => (
                            <div key={service.name} className="group">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm text-[#455a64] font-medium">{service.name}</span>
                                    <span className="text-xs text-[#90a4ae]">{service.count} รายการ</span>
                                </div>
                                <div className="w-full h-2.5 bg-[#f0f4f5] rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${service.color} rounded-full transition-all duration-700 ease-out group-hover:opacity-80`}
                                        style={{ width: `${service.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
