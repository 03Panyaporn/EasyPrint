"use client"

import { useState, useEffect } from "react"
import {
    Search,
    Clock,
    FileText,
    User,
    Download,
    Eye,
    Receipt,
    Printer,
    ChevronRight,
    Trash2,
    X,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

const statusSequence = [
    { label: "รอตรวจสอบสลิป", color: "bg-[#FFF9C4] text-[#F9A825]", progress: 10 },
    { label: "กำลังดำเนินการ", color: "bg-[#E0F7FA] text-[#06B6D4]", progress: 40 },
    { label: "เสร็จรอรับ", color: "bg-[#E8F5E9] text-[#4CAF50]", progress: 80 },
    { label: "รับแล้ว", color: "bg-[#F5F5F5] text-[#9E9E9E]", progress: 100 },
]

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

export default function OrdersPage() {
    const [userName, setUserName] = useState("ร้านค้า")
    const [orders, setOrders] = useState<any[]>([])
    const [filterStatus, setFilterStatus] = useState("ทั้งหมด")

    const filteredOrders = filterStatus === "ทั้งหมด"
        ? orders
        : orders.filter(o => o.status === filterStatus)

    // Modal states
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [isSlipModalOpen, setIsSlipModalOpen] = useState(false)
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const [previewFile, setPreviewFile] = useState<{ url: string, name: string } | null>(null)

    useEffect(() => {
        try {
            const user = localStorage.getItem('user')
            if (user) {
                const parsed = JSON.parse(user)
                setUserName(parsed.name || parsed.email || "ร้านค้า")
            }
        } catch { }

        // Fetch Initial
        fetchOrders();

        // Realtime Subscription
        const channel = supabase.channel('shop-orders-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
                fetchOrders(); // Refresh
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
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
                        customer: "ลูกค้าทั่วไป", // We don't have user table joined yet
                        fileName: fileNameStr,
                        price: order.total_price.toFixed(2),
                        status: order.status,
                        payment_slip_url: order.payment_slip_url,
                        fileUrl: items.length > 0 ? items[0].file_url : null,
                        items: items, // keep all items for details
                        ...statusInfo
                    }
                });
                setOrders(formattedOrders);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Handler functions
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

    const confirmCancelOrder = async () => {
        if (!selectedOrder) return

        try {
            await supabase.from('orders').update({ status: 'ยกเลิก' }).eq('id', selectedOrder.realId)
            fetchOrders(); // refresh data automatically via realtime or this manual call
        } catch (e) {
            console.error(e)
        }
        closeAllModals()
    }

    const handleUpdateStatus = async () => {
        if (!selectedOrder) return
        if (selectedOrder.status === "รอตรวจสอบสลิป") return // Strict guard
        const currentIndex = statusSequence.findIndex(s => s.label === selectedOrder.status)
        if (currentIndex !== -1 && currentIndex < statusSequence.length - 1) {
            const nextStatus = statusSequence[currentIndex + 1]
            try {
                await supabase.from('orders').update({ status: nextStatus.label }).eq('id', selectedOrder.realId)
                fetchOrders();
            } catch (e) { console.error(e) }
        }
        closeAllModals()
    }

    const handleVerifySlip = async () => {
        if (!selectedOrder) return

        const nextStatus = statusSequence[1] // "กำลังดำเนินการ"
        try {
            await supabase.from('orders').update({ status: nextStatus.label }).eq('id', selectedOrder.realId)
            fetchOrders();
        } catch (e) { console.error(e) }
        closeAllModals()
    }

    // Dynamic Stats Logic
    const stats = [
        {
            label: "ทั้งหมด",
            value: orders.length.toString(),
            unit: "ออเดอร์",
            color: "bg-[#EEF2FF]",
            textColor: "text-[#6366F1]",
            countBg: "bg-[#E0E7FF]",
        },
        {
            label: "รอตรวจสอบสลิป",
            value: orders.filter(o => o.status === "รอตรวจสอบสลิป").length.toString(),
            unit: "ออเดอร์",
            color: "bg-[#FFF9C4]",
            textColor: "text-[#F9A825]",
            countBg: "bg-[#FFF59D]",
        },
        {
            label: "กำลังดำเนินการ",
            value: orders.filter(o => o.status === "กำลังดำเนินการ").length.toString(),
            unit: "ออเดอร์",
            color: "bg-[#E0F7FA]",
            textColor: "text-[#06B6D4]",
            countBg: "bg-[#B2EBF2]",
        },
        {
            label: "เสร็จรอรับ",
            value: orders.filter(o => o.status === "เสร็จรอรับ").length.toString(),
            unit: "ออเดอร์",
            color: "bg-[#E8F5E9]",
            textColor: "text-[#4CAF50]",
            countBg: "bg-[#C8E6C9]",
        },
        {
            label: "รับแล้ว",
            value: orders.filter(o => o.status === "รับแล้ว").length.toString(),
            unit: "ออเดอร์",
            color: "bg-[#F5F5F5]",
            textColor: "text-[#9E9E9E]",
            countBg: "bg-[#E0E0E0]",
        },
        {
            label: "ยกเลิก",
            value: orders.filter(o => o.status === "ยกเลิก").length.toString(),
            unit: "ออเดอร์",
            color: "bg-[#FCE4EC]",
            textColor: "text-[#E91E63]",
            countBg: "bg-[#F8BBD0]",
        },
    ]

    return (
        <div className="p-8 pb-16 bg-[#F8FAFC] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#455a64]">รายการคำสั่งซื้อ</h1>
                    <p className="text-[13px] text-gray-500 mt-1">จัดการคำสั่งซื้อของลูกค้า ทั้งหมด</p>
                </div>

                <div className="flex items-center gap-4 px-2 border-l border-[#e5e7eb] pl-6">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-[#455a64]">Shop EasyPrint</p>
                        <p className="text-xs text-[#90a4ae]">{userName}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#06B6D4] flex items-center justify-center text-white shadow-md">
                        <User size={20} />
                    </div>
                </div>
            </div>

            {/* Status Summary Cards */}
            <div className="grid grid-cols-6 gap-4 mb-10">
                {stats.map((card) => (
                    <div
                        key={card.label}
                        onClick={() => setFilterStatus(card.label)}
                        className={`rounded-[24px] p-5 shadow-sm border transition-all cursor-pointer group hover:-translate-y-1 ${filterStatus === card.label
                            ? `${card.color} border-transparent ring-2 ring-offset-2 ring-transparent shadow-md`
                            : 'bg-white border-[#f0f4f5] hover:shadow-md'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className={`text-[13px] font-bold ${filterStatus === card.label ? card.textColor : 'text-[#90a4ae]'}`}>
                                {card.label}
                            </span>
                            <div className={`w-8 h-8 ${card.countBg} ${card.textColor} rounded-lg flex items-center justify-center text-sm font-bold shadow-sm group-hover:scale-110 transition-transform`}>
                                {card.value}
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-3xl font-black ${filterStatus === card.label ? card.textColor : 'text-[#455a64]'}`}>
                                {card.value}
                            </span>
                            <span className={`text-base font-bold ${filterStatus === card.label ? card.textColor : 'text-[#455a64]'}`}>
                                {card.unit}
                            </span>
                        </div>
                    </div>
                ))}

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
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[24px] border border-[#f0f4f5] shadow-sm overflow-hidden">
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
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                                {/* Assuming ShoppingBag is imported or defined */}
                                                {/* <ShoppingBag size={32} /> */}
                                                <FileText size={32} /> {/* Using FileText as a placeholder */}
                                            </div>
                                            <p className="text-[#90a4ae] text-sm font-medium">ไม่พบรายการออเดอร์ในส่วนนี้</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-[#fafeff] transition-colors group">
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
                                                                    <span className="text-[11px] text-[#455a64] font-medium group-hover/file:text-[#06B6D4] transition-all truncate max-w-[180px]">{item.file_name}</span>
                                                                </button>
                                                            ) : (
                                                                <div key={idx} className="flex items-center gap-1.5 text-gray-400 opacity-60">
                                                                    <div className="w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-md bg-gray-50 flex items-center justify-center border border-gray-100">
                                                                        <FileText size={9} />
                                                                    </div>
                                                                    <span className="text-[11px] italic truncate max-w-[180px]">{item.file_name || "ไม่มีไฟล์"}</span>
                                                                </div>
                                                            )
                                                        ))}
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
                                            <div className="flex items-center justify-start gap-2.5">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => openDetailsModal(order)}
                                                        className="p-2 text-[#90a4ae] hover:bg-emerald-100 hover:text-emerald-500 rounded-xl transition-all"
                                                        title="รายละเอียดออเดอร์"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openSlipModal(order)}
                                                        className="p-2 text-[#90a4ae] hover:bg-amber-100 hover:text-amber-500 rounded-xl transition-all"
                                                        title="สลิปโอนเงิน"
                                                    >
                                                        <Receipt size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openPrintModal(order)}
                                                        className="p-2 text-[#90a4ae] hover:bg-sky-100 hover:text-[#06B6D4] rounded-xl transition-all"
                                                        title="พิมพ์"
                                                    >
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
                                )))}
                        </tbody>
                    </table>
                </div>

                {/* Footer and Pagination */}
                <div className="px-8 py-6 border-t border-[#f0f4f5] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[12px] text-[#90a4ae] font-medium italic">
                        การเปลี่ยนสถานะจะแจ้งเตือนลูกค้าโดยอัตโนมัติผ่านทางหน้าเว็บ
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-5 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-xs font-bold text-[#90a4ae] hover:bg-gray-50 transition-all disabled:opacity-50">
                            ก่อนหน้า
                        </button>
                        <button className="px-5 py-2.5 bg-[#06B6D4]/5 border border-[#06B6D4]/20 rounded-xl text-xs font-bold text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white transition-all">
                            ถัดไป
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {
                isUpdateModalOpen && selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-[480px] rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 relative">
                            <button
                                onClick={closeAllModals}
                                className="absolute -top-3 -right-3 z-[60] w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-[#90a4ae] hover:text-rose-500 hover:scale-110 transition-all border border-[#f0f4f5] group/close"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center justify-between p-6">
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-bold text-[#455a64]">อัปเดตสถานะออเดอร์</h3>
                                    <p className="text-sm text-[#90a4ae] mt-1">ออเดอร์เลขที่ {selectedOrder.id}</p>
                                </div>
                                <div className="w-12 h-12 bg-[#E0F7FA] rounded-2xl flex items-center justify-center text-[#06B6D4]">
                                    <Clock size={24} />
                                </div>
                            </div>

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

                                        {/* Moving Slip Preview here, below Step 1 text */}
                                        {selectedOrder.status === "รอตรวจสอบสลิป" && (
                                            <div
                                                onClick={() => openSlipModal(selectedOrder)}
                                                className="ml-11 bg-[#FFF9C4] shadow-sm rounded-2xl p-4 border border-gray-100 flex items-center gap-4 group cursor-pointer hover:bg-gray-100 transition-all"
                                            >
                                                <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform overflow-hidden flex-shrink-0">
                                                    {selectedOrder.payment_slip_url ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={selectedOrder.payment_slip_url} alt="slip" className="w-full h-full object-cover" />
                                                    ) : <Receipt size={24} />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-[11px] font-bold text-[#90a4ae] uppercase tracking-wider mb-0.5">หลักฐานการโอนเงิน</p>
                                                    <p className="text-xs text-[#455a64] font-medium">รอการตรวจสอบสลิป... (คลิกดูภาพใหญ่)</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
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

                                <div className="mt-8 bg-[#f5fbfe] border border-[#e1f5fe] rounded-2xl p-4 flex gap-3">
                                    <div className="w-6 h-6 bg-[#06B6D4]/10 text-[#06B6D4] rounded-full flex items-center justify-center flex-shrink-0">
                                        <FileText size={14} />
                                    </div>
                                    <p className="text-xs text-[#78909c] leading-relaxed">
                                        เมื่อคุณกดยืนยัน ระบบจะบันทึกข้อมูลและส่งการแจ้งเตือนความคืบหน้าให้ {selectedOrder.customer} ทราบทันที
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 flex items-center gap-3">
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={selectedOrder.status !== "รอตรวจสอบสลิป"} // Can only cancel if checking slip
                                    className={`flex-1 px-6 py-3 border rounded-2xl text-sm font-bold transition-all ${selectedOrder.status !== "รอตรวจสอบสลิป"
                                        ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
                                        : "border-[#e5e7eb] text-rose-500 hover:bg-rose-50"}`}
                                >
                                    {selectedOrder.status === "รอตรวจสอบสลิป" ? "สลิปไม่ถูกต้อง" :
                                        selectedOrder.status === "ยกเลิก" ? "ถูกยกเลิกแล้ว" : "ยืนยันแล้วยกเลิกไม่ได้"}
                                </button>
                                <button
                                    onClick={selectedOrder.status === "รอตรวจสอบสลิป" ? handleVerifySlip : handleUpdateStatus}
                                    disabled={selectedOrder.status === "ยกเลิก"}
                                    className={`flex-1 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg ${selectedOrder.status === "รอตรวจสอบสลิป"
                                        ? "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20"
                                        : selectedOrder.status === "ยกเลิก"
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                            : "bg-[#06B6D4] text-white hover:bg-[#0891b2] shadow-[#06B6D4]/20"
                                        }`}
                                >
                                    {selectedOrder.status === "รอตรวจสอบสลิป" ? "ตรวจสอบเรียบร้อย" :
                                        selectedOrder.status === "ยกเลิก" ? "ถูกยกเลิกแล้ว" : "ยืนยันการอัปเดต"}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Details Modal */}
            {
                isDetailsModalOpen && selectedOrder && (
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

                                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-dashed border-gray-200">
                                        <p className="text-sm font-bold text-[#90a4ae]">ราคาสุทธิ</p>
                                        <p className="text-2xl font-black text-[#06B6D4]">฿{selectedOrder.price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Payment Slip Modal */}
            {
                isSlipModalOpen && selectedOrder && (
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
                                        <div className="relative w-full h-full">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={selectedOrder.payment_slip_url} alt="Slip" className="w-full h-full object-contain bg-black/5" />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform">
                                                <Receipt size={32} />
                                            </div>
                                            <p className="text-sm font-medium text-gray-400 italic">ไม่พบรูปภาพสลิป</p>
                                        </>
                                    )}
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={handleCancelOrder}
                                        disabled={selectedOrder.status !== "รอตรวจสอบสลิป"}
                                        className={`flex-1 py-3.5 border rounded-2xl text-sm font-bold transition-all ${selectedOrder.status !== "รอตรวจสอบสลิป"
                                            ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                                            : "border-[#e5e7eb] text-rose-500 hover:bg-rose-50"
                                            }`}
                                    >
                                        สลิปไม่ถูกต้อง
                                    </button>
                                    <button
                                        onClick={handleVerifySlip}
                                        disabled={selectedOrder.status !== "รอตรวจสอบสลิป"}
                                        className={`flex-[2] py-3.5 rounded-2xl text-sm font-bold transition-all shadow-lg ${selectedOrder.status !== "รอตรวจสอบสลิป"
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                            : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20"
                                            }`}
                                    >
                                        {selectedOrder.status === "รอตรวจสอบสลิป" ? "ตรวจสอบเรียบร้อย" : "ตรวจสอบแล้ว"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Print Modal */}
            {
                isPrintModalOpen && selectedOrder && (
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
                                        disabled={selectedOrder.status === "รอตรวจสอบสลิป"}
                                        className={`flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${selectedOrder.status === "รอตรวจสอบสลิป"
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                            : "bg-[#455a64] text-white hover:bg-[#37474f] shadow-gray-200"
                                            }`}
                                    >
                                        <Printer size={18} />
                                        {selectedOrder.status === "รอตรวจสอบสลิป" ? "ต้องตรวจสอบสลิปก่อนเริ่มพิมพ์" : "ยืนยันส่งพิมพ์"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

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
        </div>
    )
}
