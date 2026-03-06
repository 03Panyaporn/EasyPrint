"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
    Search,
    DollarSign,
    ShoppingBag,
    Clock,
    TrendingUp,
    Eye,
    Receipt,
    FileText,
    User,
    Download,
    Trash2,
    Printer,
    ChevronRight,
    X,
    MessageSquare,
    LogOut,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import MerchantProfile from "@/components/ui/shop/MerchantProfile"
    ShoppingCart,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from "recharts"





const getStatusInfo = (status: string) => {
    switch (status) {
        case "รอตรวจสอบสลิป": return { statusColor: "bg-[#FFF9C4] text-[#F9A825]", progress: 10, progressBarColor: "bg-[#06B6D4]" };
        case "กำลังดำเนินการ": return { statusColor: "bg-[#E0F7FA] text-[#06B6D4]", progress: 40, progressBarColor: "bg-[#06B6D4]" };
        case "เสร็จรอรับ": return { statusColor: "bg-[#E8F5E9] text-[#4CAF50]", progress: 80, progressBarColor: "bg-[#06B6D4]" };
        case "รับแล้ว": return { statusColor: "bg-[#F5F5F5] text-[#9E9E9E]", progress: 100, progressBarColor: "bg-[#06B6D4]" };
        case "ยกเลิก": return { statusColor: "bg-[#FCE4EC] text-[#E91E63]", progress: 0, progressBarColor: "bg-gray-200" };
        default: return { statusColor: "bg-gray-100 text-gray-500", progress: 0, progressBarColor: "bg-gray-200" };
    }
}





const statusSequence = [
    { label: "ตรวจสอบสลิป", color: "bg-[#FFF9C4] text-[#F9A825]", progress: 10 },
    { label: "กำลังดำเนินการ", color: "bg-[#E0F7FA] text-[#06B6D4]", progress: 40 },
    { label: "เสร็จสิ้นพร้อมรับ", color: "bg-[#E8F5E9] text-[#4CAF50]", progress: 80 },
    { label: "รับแล้ว", color: "bg-[#F5F5F5] text-[#9E9E9E]", progress: 100 },
]

const SHOP_ID = "b9652bb2-cba5-4440-9d89-0f93f598cb67"

export default function ShopDashboard() {
    const [userName, setUserName] = useState("ร้านค้า")
    const [isShopOpen, setIsShopOpen] = useState(true)
    const [isTogglingShop, setIsTogglingShop] = useState(false)
    const [orders, setOrders] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const ORDERS_PER_PAGE = 5

    // Modal states
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [isSlipModalOpen, setIsSlipModalOpen] = useState(false)
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const [previewFile, setPreviewFile] = useState<{ url: string, name: string } | null>(null)

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

    const fetchShopStatus = async () => {
        try {
            const { data, error } = await supabase
                .from('shops')
                .select('is_open')
                .eq('id', SHOP_ID)
                .single()
            if (error) throw error
            if (data) setIsShopOpen(data.is_open ?? true)
        } catch (err) {
            console.error("Error fetching shop status:", err)
        }
    }

    const handleToggleShop = async () => {
        if (isTogglingShop) return
        const newStatus = !isShopOpen
        setIsTogglingShop(true)
        try {
            const { error } = await supabase
                .from('shops')
                .update({ is_open: newStatus })
                .eq('id', SHOP_ID)
            if (error) throw error
            setIsShopOpen(newStatus)
        } catch (err) {
            console.error("Error updating shop status:", err)
            alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะร้านค้า")
        } finally {
            setIsTogglingShop(false)
        }
    }

    useEffect(() => {
        try {
            const user = sessionStorage.getItem('user')
            if (user) {
                const parsed = JSON.parse(user)
                setUserName(parsed.name || parsed.email || "ร้านค้า")
            }
        } catch { }

        fetchShopStatus()
        fetchOrders();

        // ฟังการเปลี่ยนแปลงของออเดอร์
        const ordersChannel = supabase.channel('dashboard-orders-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchOrders();
            })
            .subscribe();

        // ฟังการเปลี่ยนแปลงของสถานะร้านค้า
        const shopChannel = supabase.channel('shop-status-dashboard')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'shops',
                filter: `id=eq.${SHOP_ID}`
            }, (payload) => {
                if (payload.new && typeof payload.new.is_open === 'boolean') {
                    setIsShopOpen(payload.new.is_open)
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(ordersChannel);
            supabase.removeChannel(shopChannel);
        };
    }, [])

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id, 
                    created_at, 
                    total_price, 
                    status, 
                    payment_slip_url,
                    order_items (*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) {
                const formattedOrders = data.map(order => {
                    const items = order.order_items || [];
                    const firstItemName = items.length > 0 ? items[0].file_name : "ไม่มีไฟล์";
                    const fileNameStr = items.length > 1 ? `${firstItemName} (และอีก ${items.length - 1} ไฟล์)` : firstItemName;

                    const dateStr = new Date(order.created_at).toISOString().split('T')[0].replace(/-/g, '');
                    const shortOrderCode = `ORD-${dateStr}-${order.id.split('-')[0].substring(0, 4).toUpperCase()}`;

                    const statusInfo = getStatusInfo(order.status);

                    return {
                        realId: order.id,
                        id: shortOrderCode,
                        date: new Date(order.created_at).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" }),
                        customer: "ลูกค้าทั่วไป",
                        fileName: fileNameStr,
                        price: order.total_price.toFixed(2),
                        status: order.status,
                        payment_slip_url: order.payment_slip_url,
                        fileUrl: items.length > 0 ? items[0].file_url : null,
                        items: items,
                        ...statusInfo
                    }
                });
                setOrders(formattedOrders);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const todayOrders = orders.filter(o => o.date === new Date().toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" }));
    const todayRevenue = todayOrders.filter(o => o.status === "รับแล้ว").reduce((sum, order) => sum + parseFloat(order.price), 0);
    const pendingOrdersCount = orders.filter(o => o.status === "กำลังดำเนินการ" || o.status === "รอตรวจสอบสลิป").length;

    const dynamicStatsCards = [
        {
            label: "รายได้วันนี้",
            value: `฿ ${todayRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: "from-[#E0F7FA] to-[#B2EBF2]",
            iconColor: "text-[#06B6D4]",
            change: "เฉพาะออเดอร์ที่รับแล้ว",
            changeUp: true,
        },
        {
            label: "ออเดอร์ทั้งหมด",
            value: orders.length.toString(),
            icon: ShoppingBag,
            color: "from-[#FFF9C4] to-[#FFF176]",
            iconColor: "text-[#F9A825]",
            change: "รวมยกเลิก",
            changeUp: true,
        },
        {
            label: "ออเดอร์รอดำเนินการ",
            value: pendingOrdersCount.toString(),
            icon: Clock,
            color: "from-[#F3E5F5] to-[#E1BEE7]",
            iconColor: "text-[#AB47BC]",
            change: "รอจัดทำ",
            changeUp: false,
        },
    ]

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
                    <Link href="/shop/chat" className="relative p-2 text-gray-400 hover:text-[#06B6D4] transition-colors">
                        <MessageSquare size={22} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                    </Link>

                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-[#e5e7eb] shadow-sm">
                        <div className="flex flex-col text-right">
                            <span className="text-xs font-medium text-[#90a4ae]">สถานะร้านค้า</span>
                            <span className={`text-sm font-bold ${isShopOpen ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {isShopOpen ? 'เปิดร้านค้า' : 'ปิดร้านค้า'}
                            </span>
                        </div>
                        <button
                            onClick={handleToggleShop}
                            disabled={isTogglingShop}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06B6D4] disabled:opacity-70 ${isShopOpen ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        >
                            {isTogglingShop ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : (
                                <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isShopOpen ? 'translate-x-6' : 'translate-x-0'}`} />
                            )}
                        </button>
                    </div>

                    <MerchantProfile />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-6 mb-8">
                {dynamicStatsCards.map((card) => {
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
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ─── Orders Management ─── */}
            <div className="bg-white rounded-2xl border border-[#eaf6f8] shadow-sm mb-8 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f4f5]">
                    <div>
                        <h2 className="text-xl font-bold text-[#455a64]">รายการคำสั่งซื้อ</h2>
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
                                <th className="text-left px-8 py-5 text-[11px] font-bold text-[#90a4ae] uppercase tracking-wider">การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0f4f5]">
                            {orders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE).map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-[#fafeff] transition-colors duration-150 group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col whitespace-nowrap">
                                            <span className="text-[15px] font-bold text-[#06B6D4] mb-1">{order.id}</span>
                                            <span className="text-[13px] text-[#90a4ae]">{order.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#E0F7FA] flex items-center justify-center text-[#06B6D4] text-xs font-black shadow-sm group-hover:scale-105 transition-transform">
                                                {order.customer.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-[#455a64] font-bold leading-tight mb-1">{order.customer}</span>
                                                <div className="flex flex-col gap-1.5 mt-0.5">
                                                    {order.items?.map((item: any, idx: number) => (
                                                        item.file_url ? (
                                                            <button
                                                                key={idx}
                                                                onClick={() => setPreviewFile({ url: item.file_url, name: item.file_name })}
                                                                className="flex items-center gap-1.5 group/file cursor-pointer hover:scale-[1.02] transition-transform origin-left text-left"
                                                                title={`คลิกเพื่อดูไฟล์: ${item.file_name}`}
                                                            >
                                                                <div className="w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-md bg-gray-50 flex items-center justify-center text-[#90a4ae] group-hover/file:bg-[#06B6D4] group-hover/file:text-white transition-colors shadow-sm border border-gray-100">
                                                                    <Download size={9} />
                                                                </div>
                                                                <span className="text-[11px] text-[#455a64] font-medium group-hover/file:text-[#06B6D4] transition-all truncate max-w-[150px]">{item.file_name}</span>
                                                            </button>
                                                        ) : (
                                                            <div key={idx} className="flex items-center gap-1.5 text-gray-400 opacity-60">
                                                                <div className="w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-md bg-gray-50 flex items-center justify-center border border-gray-100">
                                                                    <FileText size={9} />
                                                                </div>
                                                                <span className="text-[11px] italic truncate max-w-[150px]">{item.file_name || "ไม่มีไฟล์"}</span>
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="text-sm font-black text-[#455a64]">฿{order.price}</span>
                                    </td>
                                    <td className="px-8 py-8">
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
                                    <td className="px-8 py-8">
                                        <div className="flex items-center justify-start gap-2.5">
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
                                            {order.status !== "ยกเลิก" && order.status !== "รับแล้ว" ? (
                                                <button
                                                    onClick={() => openUpdateModal(order)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-[#06B6D4] text-white rounded-xl text-xs font-bold hover:scale-105 hover:bg-[#0891b2] transition-all shadow-md shadow-[#06B6D4]/20"
                                                >
                                                    อัปเดตสถานะ
                                                    <ChevronRight size={14} />
                                                </button>
                                            ) : (
                                                <span className={`px-4 py-2 rounded-xl text-xs font-bold ${order.status === "ยกเลิก"
                                                    ? "bg-rose-50 text-rose-400"
                                                    : "bg-emerald-50 text-emerald-500"
                                                    }`}>
                                                    {order.status === "ยกเลิก" ? "ยกเลิกแล้ว" : "สำเร็จแล้ว"}
                                                </span>
                                            )}
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
                                    disabled={selectedOrder.status !== "ตรวจสอบสลิป"}
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

                                    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                        {selectedOrder.items?.map((item: any, index: number) => (
                                            <div key={item.id || index} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-8 h-8 bg-sky-50 text-sky-500 rounded-lg flex items-center justify-center shrink-0">
                                                        <FileText size={16} />
                                                    </div>
                                                    {item.file_url ? (
                                                        <button
                                                            onClick={() => setPreviewFile({ url: item.file_url, name: item.file_name })}
                                                            className="flex-1 text-sm font-bold text-[#455a64] truncate hover:text-[#06B6D4] hover:underline decoration-2 underline-offset-4 transition-all flex items-center gap-2 group/modal-file text-left"
                                                            title={item.file_name}
                                                        >
                                                            <span>{item.file_name}</span>
                                                            <Download size={14} className="opacity-0 group-hover/modal-file:opacity-100 transition-opacity" />
                                                        </button>
                                                    ) : (
                                                        <p className="flex-1 text-sm font-bold text-[#455a64] truncate" title={item.file_name}>
                                                            {item.file_name}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                                                        <span className="text-[10px] font-bold text-[#90a4ae] uppercase">จำนวนหน้า</span>
                                                        <span className="text-xs font-bold text-[#455a64]">{item.page_count} หน้า</span>
                                                    </div>
                                                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                                                        <span className="text-[10px] font-bold text-[#90a4ae] uppercase">ประเภท</span>
                                                        <span className="text-xs font-bold text-[#455a64]">{item.document_type || 'A4'}</span>
                                                    </div>
                                                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                                                        <span className="text-[10px] font-bold text-[#90a4ae] uppercase">สีการพิมพ์</span>
                                                        <span className="text-xs font-bold text-[#455a64]">{item.document_detail || 'ขาว-ดำ'}</span>
                                                    </div>
                                                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                                                        <span className="text-[10px] font-bold text-[#90a4ae] uppercase">การเข้าเล่ม</span>
                                                        <span className="text-xs font-bold text-[#455a64] truncate" title={item.extra_option}>{item.extra_option || '-'}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-3 border-t border-gray-200/60">
                                                    <p className="text-xs font-semibold text-gray-500">จำนวน: {item.quantity} ชุด</p>
                                                    <p className="text-sm font-black text-[#06B6D4]">฿{item.total_price?.toFixed(2) || '0.00'}</p>
                                                </div>
                                            </div>
                                        ))}
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
                                <div className="aspect-[3/4] rounded-2xl bg-gray-100 border border-gray-200 flex flex-col items-center justify-center gap-3 overflow-hidden group">
                                    {selectedOrder.payment_slip_url ? (
                                        <img
                                            src={selectedOrder.payment_slip_url}
                                            alt="สลิปการโอนเงิน"
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform">
                                                <Receipt size={32} />
                                            </div>
                                            <p className="text-sm font-medium text-gray-400 italic">ยังไม่มีสลิปการโอนเงิน</p>
                                        </>
                                    )}
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
                        หน้า {currentPage} จาก {Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE))} ({orders.length} รายการ)
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage <= 1}
                            className="px-4 py-2 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-xs font-medium text-[#90a4ae] hover:bg-[#06B6D4] hover:text-white hover:border-[#06B6D4] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#f8fafc] disabled:hover:text-[#90a4ae] disabled:hover:border-[#e5e7eb]"
                        >
                            ก่อนหน้า
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(Math.ceil(orders.length / ORDERS_PER_PAGE), p + 1))}
                            disabled={currentPage >= Math.ceil(orders.length / ORDERS_PER_PAGE)}
                            className="px-4 py-2 bg-[#f8fafc] border border-[#e5e7eb] rounded-xl text-xs font-medium text-[#455a64] hover:bg-[#06B6D4] hover:text-white hover:border-[#06B6D4] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#f8fafc] disabled:hover:text-[#455a64] disabled:hover:border-[#e5e7eb]"
                        >
                            ถัดไป
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Charts Section (recharts) ─── */}
            <DashboardCharts orders={orders} />

            {/* File Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="p-4 border-b flex items-center justify-between bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#E0F7FA] flex items-center justify-center text-[#06B6D4]">
                                    <FileText size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-bold text-[#455a64] truncate max-w-[300px] md:max-w-[500px]">
                                        {previewFile.name}
                                    </h3>
                                    <p className="text-[11px] text-[#90a4ae] font-medium">แสดงตัวอย่างไฟล์งาน</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href={previewFile.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#455a64] bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shrink-0"
                                >
                                    <Eye size={14} />
                                    เปิดในแท็บใหม่
                                </a>
                                <button
                                    onClick={() => setPreviewFile(null)}
                                    className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-gray-50 overflow-hidden relative flex items-center justify-center">
                            {(previewFile.url.toLowerCase().includes('.pdf') || previewFile.name.toLowerCase().endsWith('.pdf')) ? (
                                <iframe
                                    src={`${previewFile.url}#toolbar=0&navpanes=0&scrollbar=1`}
                                    className="w-full h-full border-0"
                                    title="PDF Preview"
                                />
                            ) : (
                                <div className="p-4 w-full h-full flex items-center justify-center">
                                    <img
                                        src={previewFile.url}
                                        alt="Preview"
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-sm bg-white"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div >
    )
}

// ─── Dashboard Charts Component ───────────────────────────────────────────────
const PIE_COLORS = ["#06B6D4", "#f472b6", "#fbbf24", "#34d399", "#a78bfa"];

function DashboardCharts({ orders }: { orders: any[] }) {
    // Daily revenue data (last 7 days, excluding cancelled)
    const dailyData = useMemo(() => {
        const days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return {
                key: d.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" }),
                label: d.toLocaleDateString("th-TH", { month: "short", day: "numeric" }),
            };
        });

        return days.map(day => {
            const dayOrders = orders.filter(o => o.date === day.key && o.status !== "ยกเลิก");
            const revenue = dayOrders.reduce((sum: number, o: any) => sum + parseFloat(o.price || "0"), 0);
            return { label: day.label, revenue };
        });
    }, [orders]);

    // Status pie data
    const statusData = useMemo(() => {
        const map: Record<string, number> = {};
        orders.forEach(o => {
            map[o.status] = (map[o.status] || 0) + 1;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [orders]);

    const fmt = (n: number) => n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#eaf6f8] shadow-sm p-6">
                <h3 className="text-[#455a64] font-bold text-[15px] flex items-center gap-2 mb-6">
                    <TrendingUp size={18} className="text-[#06B6D4]" />
                    รายได้รายวัน (บาท)
                </h3>
                {dailyData.every(d => d.revenue === 0) ? (
                    <div className="flex flex-col items-center justify-center h-[260px] text-gray-300">
                        <ShoppingCart size={36} strokeWidth={1} />
                        <p className="text-sm mt-2">ยังไม่มีข้อมูลรายได้</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={dailyData} barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `฿${v.toLocaleString()}`} />
                            <Tooltip formatter={(v: any) => [`฿${fmt(v)}`, "รายได้"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                            <Bar dataKey="revenue" fill="#06B6D4" radius={[6, 6, 0, 0]} name="รายได้ (บาท)" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Status Pie Chart */}
            <div className="bg-white rounded-2xl border border-[#eaf6f8] shadow-sm p-6 flex flex-col">
                <h3 className="text-[#455a64] font-bold text-[15px] flex items-center gap-2 mb-4">
                    <ShoppingCart size={18} className="text-pink-400" />
                    สัดส่วนสถานะ
                </h3>
                {statusData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 text-gray-300">
                        <ShoppingCart size={36} strokeWidth={1} />
                        <p className="text-sm mt-2">ยังไม่มีข้อมูล</p>
                    </div>
                ) : (
                    <>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                                    {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(v: any) => v} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-2 space-y-1.5">
                            {statusData.map((d, i) => (
                                <div key={d.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                        <span className="text-gray-600 text-[12px]">{d.name}</span>
                                    </div>
                                    <span className="font-bold text-[#1e293b] text-[12px]">{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
