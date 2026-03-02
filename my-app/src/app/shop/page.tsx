"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
    Search,
    DollarSign,
    ShoppingBag,
    Clock,
    TrendingUp,
    MoreHorizontal,
    ChevronDown,
    Eye,
    Receipt,
    FileText,
    User,
    Download,
    Trash2,
    Printer,
    ChevronRight,
    X,
} from "lucide-react"

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
        id: "ORD-7721",
        date: "14 ก.พ. 2569",
        customer: "คุณวิภาวี ใจดี",
        fileName: "เอกสารประกอบการเรียน.pdf",
        price: "42.5",
        status: "ตรวจสอบสลิป",
        statusColor: "bg-[#FFF9C4] text-[#F9A825]",
        progress: 10,
        progressBarColor: "bg-[#06B6D4]",
    },
    {
        id: "ORD-7720",
        date: "14 ก.พ. 2569",
        customer: "สมชาย รักเรียน",
        fileName: "รายงานประจำปี_V2.docx",
        price: "120",
        status: "กำลังดำเนินการ",
        statusColor: "bg-[#E0F7FA] text-[#06B6D4]",
        progress: 30,
        progressBarColor: "bg-[#06B6D4]",
    },
    {
        id: "ORD-7719",
        date: "14 ก.พ. 2569",
        customer: "กิตติศักดิ์ พิมพ์เก่ง",
        fileName: "Poster_A3_Event.ai",
        price: "350",
        status: "กำลังดำเนินการ",
        statusColor: "bg-[#E0F7FA] text-[#06B6D4]",
        progress: 50,
        progressBarColor: "bg-[#06B6D4]",
    },
    {
        id: "ORD-7718",
        date: "13 ก.พ. 2569",
        customer: "รุ่งนภา แจ่มใส",
        fileName: "รูปถ่ายครอบครัว.jpg",
        price: "85",
        status: "เสร็จสิ้นพร้อมรับ",
        statusColor: "bg-[#E8F5E9] text-[#4CAF50]",
        progress: 80,
        progressBarColor: "bg-[#06B6D4]",
    },
    {
        id: "ORD-7717",
        date: "13 ก.พ. 2569",
        customer: "ดนัย สุขุม",
        fileName: "แผ่นพับแนะนำร้าน.pdf",
        price: "240",
        status: "รับแล้ว",
        statusColor: "bg-[#F5F5F5] text-[#9E9E9E]",
        progress: 100,
        progressBarColor: "bg-[#06B6D4]",
    },
    {
        id: "ORD-7716",
        date: "12 ก.พ. 2569",
        customer: "มานะ ขยัน",
        fileName: "วิทยานิพนธ์_final.pdf",
        price: "1,250",
        status: "ยกเลิก",
        statusColor: "bg-[#FCE4EC] text-[#E91E63]",
        progress: 0,
        progressBarColor: "bg-gray-200",
    },
]

const topServices = [
    { name: "ถ่ายเอกสารขาวดำ", count: 120, percentage: 85, color: "bg-[#06B6D4]" },
    { name: "ถ่ายเอกสารสี", count: 98, percentage: 70, color: "bg-[#38bdf8]" },
    { name: "เข้าเล่มสันห่วง", count: 65, percentage: 48, color: "bg-[#7dd3fc]" },
    { name: "โปสเตอร์", count: 42, percentage: 30, color: "bg-[#a5f3fc]" },
    { name: "นามบัตร", count: 35, percentage: 25, color: "bg-[#cffafe]" },
]

function RevenueChart() {
    const data = [1200, 2800, 1800, 3200, 2400, 4100, 5000]
    const labels = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."]
    const max = Math.max(...data)
    const height = 140
    const width = 500

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
                <path d={areaD} fill="url(#areaGradient)" />
                <path d={pathD} fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                {points.map((p, i) => (
                    <text
                        key={`label-${i}`}
                        x={p.x}
                        y={height + 20}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#9ca3af"
                        className="font-medium"
                    >
                        {labels[i]}
                    </text>
                ))}
            </svg>
        </div>
    )
}
const statusSequence = [
    { label: "ตรวจสอบสลิป", color: "bg-[#FFF9C4] text-[#F9A825]", progress: 10 },
    { label: "กำลังดำเนินการ", color: "bg-[#E0F7FA] text-[#06B6D4]", progress: 40 },
    { label: "เสร็จสิ้นพร้อมรับ", color: "bg-[#E8F5E9] text-[#4CAF50]", progress: 80 },
    { label: "รับแล้ว", color: "bg-[#F5F5F5] text-[#9E9E9E]", progress: 100 },
]

export default function ShopDashboard() {
    const [userName, setUserName] = useState("ร้านค้า")
    const [filterPeriod, setFilterPeriod] = useState("Last 7 Days")
    const [isShopOpen, setIsShopOpen] = useState(true)
    const [orders, setOrders] = useState(recentOrders)

    // Modal states
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [isSlipModalOpen, setIsSlipModalOpen] = useState(false)
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<any>(null)

    const openUpdateModal = (order: any) => {
        setSelectedOrder(order)
        setIsUpdateModalOpen(true)
    }

    const openDetailsModal = (order: any) => {
        setSelectedOrder(order)
        setIsDetailsModalOpen(true)
    }

    const openSlipModal = (order: any) => {
        setSelectedOrder(order)
        setIsSlipModalOpen(true)
    }

    const openPrintModal = (order: any) => {
        setSelectedOrder(order)
        setIsPrintModalOpen(true)
    }

    const closeAllModals = () => {
        setIsUpdateModalOpen(false)
        setIsDetailsModalOpen(false)
        setIsSlipModalOpen(false)
        setIsPrintModalOpen(false)
        setIsCancelConfirmOpen(false)
        setSelectedOrder(null)
    }

    const handleCancelOrder = () => {
        if (!selectedOrder) return
        setIsCancelConfirmOpen(true)
    }

    const confirmCancelOrder = () => {
        if (!selectedOrder) return

        const updatedOrders = orders.map(o =>
            o.id === selectedOrder.id
                ? { ...o, status: "ยกเลิก", statusColor: "bg-[#FCE4EC] text-[#E91E63]", progress: 0, progressBarColor: "bg-gray-200" }
                : o
        )
        setOrders(updatedOrders)
        closeAllModals()
    }

    const handleUpdateStatus = () => {
        if (!selectedOrder) return
        if (selectedOrder.status === "ตรวจสอบสลิป") return // Strict guard
        if (selectedOrder.status === "ยกเลิก") return // Guard for cancelled orders

        const currentIndex = statusSequence.findIndex(s => s.label === selectedOrder.status)
        if (currentIndex < statusSequence.length - 1) {
            const nextStatus = statusSequence[currentIndex + 1]
            const updatedOrders = orders.map(o =>
                o.id === selectedOrder.id
                    ? { ...o, status: nextStatus.label, statusColor: nextStatus.color, progress: nextStatus.progress }
                    : o
            )
            setOrders(updatedOrders)
        }
        closeAllModals()
    }

    const handleVerifySlip = () => {
        if (!selectedOrder) return

        const nextStatus = statusSequence[1] // "กำลังดำเนินการ"
        const updatedOrders = orders.map(o =>
            o.id === selectedOrder.id
                ? { ...o, status: nextStatus.label, statusColor: nextStatus.color, progress: nextStatus.progress }
                : o
        )
        setOrders(updatedOrders)
        closeAllModals()
    }

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
            <div className="flex items-center justify-between mb-8">
                <div className="relative w-[360px]">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="ค้นหา..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-[#e5e7eb] rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] transition-all shadow-sm"
                    />
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-[#e5e7eb] shadow-sm">
                        <div className="flex flex-col text-right">
                            <span className="text-xs font-medium text-[#90a4ae]">สถานะร้านค้า</span>
                            <span className={`text-sm font-bold ${isShopOpen ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {isShopOpen ? 'เปิดร้านค้า' : 'ปิดร้านค้า'}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsShopOpen(!isShopOpen)}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06B6D4] ${isShopOpen ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        >
                            <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isShopOpen ? 'translate-x-6' : 'translate-x-0 '}`} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 border-l pl-6 border-[#e5e7eb]">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-[#455a64]">Shop EasyPrint</p>
                            <p className="text-xs text-[#90a4ae]">{userName}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#06B6D4] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#06B6D4]/20">
                            <User size={20} />
                        </div>
                    </div>
                </div>
            </div>
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
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f4f5]">
                    <div>
                        <h2 className="text-xl font-bold text-[#455a64]">Orders Management</h2>
                        <p className="text-xs text-[#90a4ae] mt-1">จัดการออเดอร์ล่าสุดของร้านค้า</p>
                    </div>
                    <Link href="/shop/orders">
                        <button className="flex items-center gap-2 px-4 py-2 border border-[#e5e7eb] rounded-xl text-sm text-[#78909c] hover:bg-[#f5fbfe] hover:border-[#06B6D4] hover:text-[#06B6D4] transition-all">
                            <FileText size={15} />
                            ดูทั้งหมด
                        </button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#f0f4f5]">
                                <th className="text-left px-8 py-5 text-[11px] font-bold text-[#90a4ae] uppercase tracking-wider">เลขที่ออเดอร์</th>
                                <th className="text-left px-8 py-5 text-[11px] font-bold text-[#90a4ae] uppercase tracking-wider">ลูกค้า/ไฟล์งาน</th>
                                <th className="text-left px-8 py-5 text-[11px] font-bold text-[#90a4ae] uppercase tracking-wider">ยอดรวม</th>
                                <th className="text-left px-8 py-5 text-[11px] font-bold text-[#90a4ae] uppercase tracking-wider">สถานะการผลิต</th>
                                <th className="text-right px-8 py-5 text-[11px] font-bold text-[#90a4ae] uppercase tracking-wider">การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0f4f5]">
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-[#fafeff] transition-colors duration-150 group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-[#06B6D4] mb-0.5">{order.id}</span>
                                            <span className="text-[11px] text-[#90a4ae]">{order.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#E0F7FA] flex items-center justify-center text-[#06B6D4] text-xs font-black shadow-sm group-hover:scale-105 transition-transform">
                                                {order.customer.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-[#455a64] font-bold leading-tight mb-1">{order.customer}</span>
                                                <div className="flex items-center gap-1.5 group/file cursor-pointer">
                                                    <Download size={12} className="text-[#90a4ae] group-hover/file:text-[#06B6D4] transition-colors" />
                                                    <span className="text-[11px] text-[#90a4ae] group-hover/file:text-[#06B6D4] transition-colors truncate max-w-[150px]">{order.fileName}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-black text-[#455a64]">฿{order.price}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col w-[160px]">
                                            <div className="mb-2">
                                                <span className={`text-[10px] font-bold px-3 py-1 rounded-lg ${order.statusColor}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="w-full h-1.5 bg-[#f0f4f5] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${order.progressBarColor} rounded-full transition-all duration-700`}
                                                    style={{ width: `${order.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2.5">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => openDetailsModal(order)} className="p-2 text-[#90a4ae] hover:bg-emerald-100 hover:text-emerald-500 rounded-xl transition-all" title="รายละเอียดออเดอร์">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => openSlipModal(order)} className="p-2 text-[#90a4ae] hover:bg-amber-100 hover:text-amber-500 rounded-xl transition-all" title="สลิปโอนเงิน">
                                                    <Receipt size={16} />
                                                </button>
                                                <button onClick={() => openPrintModal(order)} className="p-2 text-[#90a4ae] hover:bg-sky-100 hover:text-[#06B6D4] rounded-xl transition-all" title="พิมพ์">
                                                    <Printer size={16} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => openUpdateModal(order)}
                                                className="flex items-center gap-2 px-4 py-2 bg-[#06B6D4] text-white rounded-xl text-xs font-bold hover:scale-105 hover:bg-[#0891b2] transition-all shadow-md shadow-[#06B6D4]/20"
                                            >
                                                อัปเดตสถานะ
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Status Update Modal */}
                {isUpdateModalOpen && selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-[480px] rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 relative">
                            <button
                                onClick={closeAllModals}
                                className="absolute -top-3 -right-3 z-[60] w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-[#90a4ae] hover:text-rose-500 hover:scale-110 transition-all border border-[#f0f4f5] group/close"
                            >
                                <X size={20} />
                            </button>

                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6">
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-bold text-[#455a64]">อัปเดตสถานะออเดอร์</h3>
                                    <p className="text-sm text-[#90a4ae] mt-1">ออเดอร์เลขที่ {selectedOrder.id}</p>
                                </div>
                                <div className="w-12 h-12 bg-[#E0F7FA] rounded-2xl flex items-center justify-center text-[#06B6D4]">
                                    <Clock size={24} />
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 pt-2">
                                <div className="relative flex flex-col gap-8 ml-4">
                                    {/* Connection Line */}
                                    <div className="absolute left-[13px] top-8 bottom-8 w-0.5 bg-[#f0f4f5] border-l border-dashed border-[#e5e7eb]" />

                                    {/* Step 1: Current Status */}
                                    <div className="flex flex-col gap-4 relative z-10">
                                        <div className="flex items-start gap-4">
                                            <div className="w-7 h-7 rounded-full bg-white border-2 border-[#e5e7eb] flex items-center justify-center text-xs font-bold text-[#90a4ae] shadow-sm">
                                                {Math.max(1, statusSequence.findIndex(s => s.label === selectedOrder.status) + 1)}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-xs font-medium text-[#90a4ae]">สถานะปัจจุบัน</p>
                                                <p className="text-sm font-bold text-[#455a64] mt-0.5">{selectedOrder.status}</p>
                                            </div>
                                        </div>
                                        {selectedOrder.status === "ตรวจสอบสลิป" && (
                                            <div
                                                onClick={() => openSlipModal(selectedOrder)}
                                                className="ml-11 bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4 group cursor-pointer hover:bg-gray-100 transition-all"
                                            >
                                                <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform overflow-hidden flex-shrink-0">
                                                    <Receipt size={24} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-[11px] font-bold text-[#90a4ae] uppercase tracking-wider mb-0.5">หลักฐานการโอนเงิน</p>
                                                    <p className="text-xs text-[#455a64] font-medium">รอการตรวจสอบสลิป...</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Step 2: Next Status */}
                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="w-7 h-7 rounded-full bg-white border-2 border-[#06B6D4] flex items-center justify-center text-xs font-bold text-[#06B6D4] shadow-sm shadow-[#06B6D4]/10">
                                            {Math.min(statusSequence.length + 1, Math.max(2, statusSequence.findIndex(s => s.label === selectedOrder.status) + 2))}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-xs font-medium text-[#06B6D4]">สถานะถัดไป</p>
                                            <p className="text-sm font-bold text-[#455a64] mt-0.5">
                                                {statusSequence[statusSequence.findIndex(s => s.label === selectedOrder.status) + 1]?.label || "เสร็จสิ้น"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Card */}
                                <div className="mt-8 bg-[#f5fbfe] border border-[#e1f5fe] rounded-2xl p-4 flex gap-3">
                                    <div className="w-6 h-6 bg-[#06B6D4]/10 text-[#06B6D4] rounded-full flex items-center justify-center flex-shrink-0">
                                        <FileText size={14} />
                                    </div>
                                    <p className="text-xs text-[#78909c] leading-relaxed">
                                        เมื่อคุณกดยืนยัน ระบบจะบันทึกข้อมูลและส่งการแจ้งเตือนความคืบหน้าให้คุณ {selectedOrder.customer} ทราบทันที
                                    </p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 flex items-center gap-3">
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={selectedOrder.status !== "ตรวจสอบสลิป" && selectedOrder.status !== "ยกเลิก"}
                                    className={`flex-1 px-6 py-3 border rounded-2xl text-sm font-bold transition-all ${selectedOrder.status !== "ตรวจสอบสลิป"
                                        ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
                                        : "border-[#e5e7eb] text-rose-500 hover:bg-rose-50"}`}
                                >
                                    {selectedOrder.status === "ตรวจสอบสลิป" ? "สลิปไม่ถูกต้อง" :
                                        selectedOrder.status === "ยกเลิก" ? "ถูกยกเลิกแล้ว" : "ยืนยันแล้วยกเลิกไม่ได้"}
                                </button>
                                <button
                                    onClick={selectedOrder.status === "ตรวจสอบสลิป" ? handleVerifySlip : handleUpdateStatus}
                                    disabled={selectedOrder.status === "ยกเลิก"}
                                    className={`flex-1 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg ${selectedOrder.status === "ตรวจสอบสลิป"
                                        ? "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20"
                                        : selectedOrder.status === "ยกเลิก"
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                            : "bg-[#06B6D4] text-white hover:bg-[#0891b2] shadow-[#06B6D4]/20"
                                        }`}
                                >
                                    {selectedOrder.status === "ตรวจสอบสลิป" ? "ตรวจสอบเรียบร้อย" :
                                        selectedOrder.status === "ยกเลิก" ? "ถูกยกเลิกแล้ว" : "ยืนยันการอัปเดต"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Details Modal */}
                {isDetailsModalOpen && selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-[550px] rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                            <button onClick={closeAllModals} className="absolute top-4 right-4 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all">
                                <X size={20} />
                            </button>
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 bg-[#E0F7FA] rounded-2xl flex items-center justify-center text-[#06B6D4]">
                                        <Eye size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#455a64]">รายละเอียดออเดอร์</h3>
                                        <p className="text-sm text-[#90a4ae]">{selectedOrder.id} • {selectedOrder.date}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                        <p className="text-[11px] font-bold text-[#90a4ae] uppercase tracking-wider mb-3">ข้อมูลลูกค้า</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#455a64] font-bold shadow-sm">{selectedOrder.customer.charAt(0)}</div>
                                            <p className="text-sm font-bold text-[#455a64]">{selectedOrder.customer}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                        <p className="text-[11px] font-bold text-[#90a4ae] uppercase tracking-wider mb-3">รายละเอียดเอกสาร</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                                                <span className="text-[10px] font-bold text-[#90a4ae] uppercase">จำนวนหน้า</span>
                                                <span className="text-sm font-bold text-[#455a64]">42 หน้า</span>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                                                <span className="text-[10px] font-bold text-[#90a4ae] uppercase">ประเภทกระดาษ</span>
                                                <span className="text-sm font-bold text-[#455a64]">A4 (80 แกรม)</span>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                                                <span className="text-[10px] font-bold text-[#90a4ae] uppercase">สีการพิมพ์</span>
                                                <span className="text-sm font-bold text-[#455a64]">ขาว-ดำ</span>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                                                <span className="text-[10px] font-bold text-[#90a4ae] uppercase">การเข้าเล่ม</span>
                                                <span className="text-sm font-bold text-[#455a64]">แม็กมุมซ้าย</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                        <p className="text-[11px] font-bold text-[#90a4ae] uppercase tracking-wider mb-3">รายการงานพิมพ์</p>
                                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-sky-50 text-sky-500 rounded-lg flex items-center justify-center"><FileText size={16} /></div>
                                                <p className="text-sm font-medium text-[#455a64] truncate max-w-[200px]">{selectedOrder.fileName}</p>
                                            </div>
                                            <p className="text-sm font-black text-[#06B6D4]">฿{selectedOrder.price}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-200">
                                        <p className="text-sm font-bold text-[#90a4ae]">ราคาสุทธิ</p>
                                        <p className="text-xl font-black text-[#455a64]">฿{selectedOrder.price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Slip Modal */}
                {isSlipModalOpen && selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-[420px] rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                            <button onClick={closeAllModals} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur shadow-md rounded-full flex items-center justify-center text-gray-500 hover:text-rose-500 transition-all">
                                <X size={20} />
                            </button>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-[#455a64] mb-4 flex items-center gap-2">
                                    <Receipt size={20} className="text-amber-500" />
                                    หลักฐานการโอนเงิน
                                </h3>
                                <div className="aspect-[3/4] rounded-2xl rounded-2xl bg-gray-100 border border-gray-200 flex flex-col items-center justify-center gap-3 overflow-hidden group">
                                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform">
                                        <Receipt size={32} />
                                    </div>
                                    <p className="text-sm font-medium text-gray-400 italic">รูปภาพสลิปโอนเงิน</p>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={handleCancelOrder}
                                        disabled={selectedOrder.status !== "ตรวจสอบสลิป"}
                                        className={`flex-1 py-3.5 border rounded-2xl text-sm font-bold transition-all ${selectedOrder.status !== "ตรวจสอบสลิป"
                                            ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                                            : "border-[#e5e7eb] text-rose-500 hover:bg-rose-50"
                                            }`}
                                    >
                                        สลิปไม่ถูกต้อง
                                    </button>
                                    <button
                                        onClick={handleVerifySlip}
                                        disabled={selectedOrder.status !== "ตรวจสอบสลิป"}
                                        className={`flex-[2] py-3.5 rounded-2xl text-sm font-bold transition-all shadow-lg ${selectedOrder.status !== "ตรวจสอบสลิป"
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                            : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20"
                                            }`}
                                    >
                                        {selectedOrder.status === "ตรวจสอบสลิป" ? "ตรวจสอบเรียบร้อย" : "ตรวจสอบแล้ว"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Print Modal */}
                {isPrintModalOpen && selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-[500px] rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                            <button onClick={closeAllModals} className="absolute top-4 right-4 w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all">
                                <X size={20} />
                            </button>
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-[#06B6D4]">
                                        <Printer size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#455a64]">พิมพ์ใบสั่งงาน</h3>
                                        <p className="text-sm text-[#90a4ae]">เตรียมพิมพ์ {selectedOrder.id}</p>
                                    </div>
                                </div>

                                <div className="border-2 border-dashed border-gray-100 rounded-3xl p-6 bg-gray-50/50">
                                    <div className="flex justify-between mb-4">
                                        <span className="text-xs font-bold text-gray-400 uppercase">ไฟล์งาน</span>
                                        <span className="text-sm font-bold text-[#455a64]">{selectedOrder.fileName}</span>
                                    </div>
                                    <div className="flex justify-between mb-4">
                                        <span className="text-xs font-bold text-gray-400 uppercase">ลูกค้า</span>
                                        <span className="text-sm font-bold text-[#455a64]">{selectedOrder.customer}</span>
                                    </div>
                                    <div className="flex justify-between pt-4 border-t border-gray-200">
                                        <span className="text-sm font-black text-[#455a64]">รวมทั้งสิ้น</span>
                                        <span className="text-lg font-black text-[#06B6D4]">฿{selectedOrder.price}</span>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <button
                                        onClick={() => { window.print(); closeAllModals(); }}
                                        disabled={selectedOrder.status === "ตรวจสอบสลิป"}
                                        className={`flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${selectedOrder.status === "ตรวจสอบสลิป"
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                            : "bg-[#455a64] text-white hover:bg-[#37474f] shadow-gray-200"
                                            }`}
                                    >
                                        <Printer size={18} />
                                        {selectedOrder.status === "ตรวจสอบสลิป" ? "ต้องตรวจสอบสลิปก่อนเริ่มพิมพ์" : "ยืนยันส่งพิมพ์"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cancel Confirmation Modal */}
                {isCancelConfirmOpen && selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-[400px] rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                            <div className="p-8 text-center">
                                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6">
                                    <Trash2 size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-[#455a64] mb-2">ยืนยันการยกเลิก?</h3>
                                <p className="text-sm text-[#90a4ae] leading-relaxed mb-8">
                                    คุณแน่ใจหรือไม่ที่จะยกเลิกออเดอร์ <span className="font-bold text-[#06B6D4]">{selectedOrder.id}</span>?<br />
                                    การกระทำนี้ไม่สามารถย้อนกลับได้
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsCancelConfirmOpen(false)}
                                        className="flex-1 py-4 bg-gray-50 text-[#90a4ae] rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all border border-gray-100"
                                    >
                                        ไม่, ย้อนกลับ
                                    </button>
                                    <button
                                        onClick={confirmCancelOrder}
                                        className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-sm font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
                                    >
                                        ใช่, ยกเลิกออเดอร์
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer and Pagination */}
                <div className="px-6 py-5 border-t border-[#f0f4f5] flex items-center justify-between">
                    <p className="text-xs text-[#90a4ae]">
                        การเปลี่ยนสถานะจะแจ้งเตือนลูกค้าโดยอัตโนมัติผ่านทางหน้าเว็บ
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-xs font-medium text-[#90a4ae] hover:bg-[#06B6D4] hover:text-white hover:border-[#06B6D4] transition-all disabled:opacity-50">
                            ก่อนหน้า
                        </button>
                        <button className="px-4 py-2 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-xs font-medium text-[#455a64] hover:bg-[#06B6D4] hover:text-white hover:border-[#06B6D4] transition-all">
                            ถัดไป
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Charts Section ─── */}
            <div className="grid grid-cols-2 gap-6">
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
        </div >
    )
}
