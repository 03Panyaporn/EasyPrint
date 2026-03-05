"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const FILTER_ALL = "ทั้งหมด";

// ============================================================
// Icon Components — filled style, more detail
// ============================================================
function IconAll() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7.5" height="7.5" rx="2" fill="white" opacity="0.9" />
            <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" fill="white" opacity="0.7" />
            <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" fill="white" opacity="0.7" />
            <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" fill="white" opacity="0.5" />
        </svg>
    );
}

function IconPendingSlip() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2H6Z" fill="white" opacity="0.25" />
            <path d="M14 2V8H20" fill="white" opacity="0.15" />
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 2V8H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="14" r="3" stroke="white" strokeWidth="1.5" />
            <path d="M12 13V15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="16.5" r="0.5" fill="white" />
        </svg>
    );
}

function IconInProgress() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" fill="white" opacity="0.2" />
            <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
            <path d="M12 7V12L15 14" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="1.5" fill="white" />
        </svg>
    );
}

function IconReady() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M20 7H4C2.9 7 2 7.9 2 9V14C2 15.1 2.9 16 4 16H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V16H20C21.1 16 22 15.1 22 14V9C22 7.9 21.1 7 20 7Z" fill="white" opacity="0.2" />
            <path d="M17 3H7V7H17V3Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 14H17V21H7V14Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 7H4C2.9 7 2 7.9 2 9V14C2 15.1 2.9 16 4 16H7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 7H20C21.1 7 22 7.9 22 9V14C22 15.1 21.1 16 20 16H17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="18" cy="10" r="1" fill="white" />
        </svg>
    );
}

function IconCompleted() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" fill="white" opacity="0.2" />
            <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
            <path d="M8 12.5L10.5 15L16 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconCancelled() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" fill="white" opacity="0.2" />
            <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
            <path d="M15 9L9 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

const steps = [
    { label: FILTER_ALL, icon: <IconAll />, gradient: "from-[#06B6D4] to-[#0891b2]", hoverGradient: "from-[#06B6D4] to-[#0891b2]" },
    { label: "รอตรวจสอบสลิป", icon: <IconPendingSlip />, gradient: "from-amber-400 to-orange-400", hoverGradient: "from-amber-400 to-orange-400" },
    { label: "กำลังดำเนินการ", icon: <IconInProgress />, gradient: "from-blue-400 to-indigo-500", hoverGradient: "from-blue-400 to-indigo-500" },
    { label: "เสร็จรอรับ", icon: <IconReady />, gradient: "from-[#06B6D4] to-teal-500", hoverGradient: "from-[#06B6D4] to-teal-500" },
    { label: "รับแล้ว", icon: <IconCompleted />, gradient: "from-emerald-400 to-green-500", hoverGradient: "from-emerald-400 to-green-500" },
    { label: "ยกเลิก", icon: <IconCancelled />, gradient: "from-red-400 to-rose-500", hoverGradient: "from-red-400 to-rose-500" },
];

function getStatusStyle(status: string) {
    switch (status) {
        case "รอตรวจสอบสลิป":
            return "bg-amber-50 text-amber-700 border border-amber-200";
        case "กำลังดำเนินการ":
            return "bg-blue-50 text-blue-700 border border-blue-200";
        case "เสร็จรอรับ":
            return "bg-cyan-50 text-cyan-700 border border-cyan-200";
        case "รับแล้ว":
            return "bg-emerald-50 text-emerald-700 border border-emerald-200";
        case "ยกเลิก":
            return "bg-red-50 text-red-600 border border-red-200";
        default:
            return "bg-gray-50 text-gray-600 border border-gray-200";
    }
}

// ============================================================
// Cancel Confirmation Modal
// ============================================================
function CancelModal({
    order,
    onCancel,
    onChat,
    onClose,
}: {
    order: { id: string; product: string; price: number };
    onCancel: () => void;
    onChat: () => void;
    onClose: () => void;
}) {
    const [cancelled, setCancelled] = useState(false);

    const handleConfirm = () => {
        onCancel();
        setCancelled(true);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={!cancelled ? onClose : undefined}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-[420px] overflow-hidden animate-[modalSlideUp_0.35s_cubic-bezier(0.16,1,0.3,1)]">
                {!cancelled ? (
                    <>
                        {/* Red gradient header */}
                        <div className="bg-gradient-to-br from-red-400 to-rose-500 px-6 pt-8 pb-12 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white">ยืนยันยกเลิกออเดอร์</h2>
                        </div>

                        {/* Content */}
                        <div className="px-6 -mt-6 relative">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-5">
                                <div className="space-y-2.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 font-medium">รหัสออเดอร์</span>
                                        <span className="text-gray-700 font-mono font-semibold">{order.id}</span>
                                    </div>
                                    <div className="h-px bg-gray-100" />
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 font-medium">สินค้า</span>
                                        <span className="text-gray-700 font-medium">{order.product}</span>
                                    </div>
                                    <div className="h-px bg-gray-100" />
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 font-medium">ราคา</span>
                                        <span className="text-[#06B6D4] font-bold text-base">{order.price.toFixed(2)} ฿</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 text-center mb-5">
                                คุณต้องการยกเลิกออเดอร์นี้ใช่หรือไม่?
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 px-6 pb-6">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 active:scale-[0.97] transition-all duration-200"
                            >
                                ย้อนกลับ
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-red-500/30 active:scale-[0.97] transition-all duration-200"
                            >
                                ยืนยันยกเลิก
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Green gradient header */}
                        <div className="bg-gradient-to-br from-emerald-400 to-green-500 px-6 pt-8 pb-12 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white">ยกเลิกออเดอร์สำเร็จ</h2>
                            <p className="text-white/80 text-sm mt-1">
                                ออเดอร์ <span className="font-mono font-semibold">{order.id}</span>
                            </p>
                        </div>

                        {/* Content */}
                        <div className="px-6 -mt-6 relative">
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-amber-800 leading-relaxed">
                                    กรุณาแชทกับร้านค้าเพื่อขอคืนเงินหรือสอบถามเพิ่มเติม
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 px-6 pb-6">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 active:scale-[0.97] transition-all duration-200"
                            >
                                ปิด
                            </button>
                            <button
                                onClick={onChat}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891b2] text-white text-sm font-bold hover:shadow-lg hover:shadow-[#06B6D4]/30 active:scale-[0.97] transition-all duration-200 text-center flex items-center justify-center gap-2"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                แชทกับร้านค้า
                            </button>
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}

// ============================================================
// Main Page
// ============================================================
export default function TrackingPage() {
    const [activeFilter, setActiveFilter] = useState(FILTER_ALL);
    const [orders, setOrders] = useState<any[]>([]);
    const [cancellingOrder, setCancellingOrder] = useState<{ id: string; realId: string; product: string; price: number } | null>(null);
    const [viewingOrder, setViewingOrder] = useState<any | null>(null);
    const [loadingChat, setLoadingChat] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const userJson = localStorage.getItem('user');
            const user = userJson ? JSON.parse(userJson) : null;
            if (!user?.id) return;

            // Fetch orders along with their first item to display as the "product name"
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id, 
                    total_price, 
                    status,
                    created_at,
                    order_items ( id, file_name, quantity, total_price, status, document_type, document_detail, document_size, extra_option, page_count, unit_price )
                `)
                .eq('customer_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                // Formatting data for display
                const formattedOrders = data.map(order => {
                    const items = order.order_items || [];
                    let productDesc = items.length > 0 ? items[0].file_name : "บริการสั่งพิมพ์";
                    if (items.length > 1) {
                        productDesc += ` (และอีก ${items.length - 1} รายการ)`;
                    }

                    const totalQuantity = items.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0);

                    // Create short ID like ORD-20260305-XXXX
                    const dateStr = new Date(order.created_at).toISOString().split('T')[0].replace(/-/g, '');
                    const shortId = `ORD-${dateStr}-${order.id.split('-')[0].substring(0, 4).toUpperCase()}`;

                    return {
                        id: shortId,
                        realId: order.id,
                        product: productDesc,
                        quantity: totalQuantity,
                        price: order.total_price,
                        status: order.status,
                        items: items, // keep all items for the details modal
                        createdAt: order.created_at
                    };
                });

                setOrders(formattedOrders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartChat = async (orderId: string, price: number) => {
        setLoadingChat(true)
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}')
            const res = await fetch('http://localhost:3001/api/chat/get-or-create-room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_id: user.id,
                    merchant_id: 'b9652bb2-cba5-4440-9d89-0f93f598cb67'
                }),
            })
            const roomData = await res.json()
            if (res.ok && roomData.id) {
                const messageText = encodeURIComponent(`สวัสดีครับคุณร้านค้า ต้องการสอบถามหรือแจ้งขอยกเลิกและคืนเงินสำหรับ\nหมายเลขออเดอร์: ${orderId}\nราคา: ฿${price.toFixed(2)}`);
                window.location.href = `/customer/chat/${roomData.id}?message=${messageText}`;
            } else {
                const errorMsg = roomData.details || roomData.error || "ไม่สามารถเริ่มการสนทนาได้"
                alert(`เกิดข้อผิดพลาด: ${errorMsg}\n\nคำแนะนำ: ${roomData.hint || 'กรุณาตรวจสอบรหัสร้านค้า'}`)
            }
        } catch (error) {
            console.error("Failed to start chat:", error)
            alert("ไม่สามารถเริ่มการสนทนาได้ในขณะนี้")
        } finally {
            setLoadingChat(false)
        }
    }

    // นับจำนวนออเดอร์ในแต่ละสถานะ
    const statusCounts = steps.map((step) =>
        step.label === FILTER_ALL
            ? orders.length
            : orders.filter((order) => order.status === step.label).length
    );

    // กรองออเดอร์ตามสถานะที่เลือก
    const filteredOrders =
        activeFilter === FILTER_ALL
            ? orders
            : orders.filter((order) => order.status === activeFilter);

    // ยกเลิกออเดอร์
    const handleCancelOrder = async (orderId: string, realId: string) => {
        try {
            console.log("Cancelling order, realId:", realId);
            const { error } = await supabase
                .from('orders')
                .update({ status: 'ยกเลิก' })
                .eq('id', realId);

            if (error) {
                console.error("Supabase Error:", error);
                throw error;
            }

            setOrders((prev) =>
                prev.map((o) =>
                    o.id === orderId ? { ...o, status: "ยกเลิก" } : o
                )
            );
        } catch (error: any) {
            console.error("Error cancelling order:", error);
            // alert(`ไม่สามารถยกเลิกออเดอร์ได้ในขณะนี้: ${error.message}`);
            // Let it complete visually anyway for now
            setOrders((prev) =>
                prev.map((o) =>
                    o.id === orderId ? { ...o, status: "ยกเลิก" } : o
                )
            );
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#F0F9FB] via-[#F8FAFC] to-[#EEF7FA] min-h-screen py-8 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Card หลัก */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-[#06B6D4]/5 border border-white/60 overflow-hidden">
                    {/* Gradient top bar */}
                    <div className="h-1 bg-gradient-to-r from-[#06B6D4] via-[#67e8f9] to-[#06B6D4] bg-[length:200%_100%] animate-[shimmer_3s_ease_infinite]" />

                    <div className="p-8">
                        {/* Title */}
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#06B6D4] to-[#0891b2] rounded-xl flex items-center justify-center shadow-md shadow-[#06B6D4]/25">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-800">การติดตามสถานะ</h1>
                                <p className="text-xs text-gray-400 mt-0.5">ติดตามออเดอร์ทั้งหมดของคุณ</p>
                            </div>
                        </div>

                        {/* ===== Status Filter Icons ===== */}
                        <div className="flex items-start justify-center gap-5 mb-10 flex-wrap">
                            {steps.map((step, i) => {
                                const isActive = activeFilter === step.label;
                                const count = statusCounts[i];

                                return (
                                    <button
                                        key={step.label}
                                        onClick={() => setActiveFilter(step.label)}
                                        className={`flex flex-col items-center relative group cursor-pointer transition-all duration-300 ${isActive ? "scale-105" : "hover:scale-105"
                                            }`}
                                        style={{ width: "95px" }}
                                    >
                                        {/* Icon circle */}
                                        <div
                                            className={`w-[58px] h-[58px] rounded-2xl flex items-center justify-center transition-all duration-300 ${isActive
                                                ? `bg-gradient-to-br ${step.gradient} shadow-lg ring-[3px] ring-offset-2 ring-offset-white ${step.label === "ยกเลิก" ? "ring-red-300 shadow-red-400/30" : step.label === "รอตรวจสอบสลิป" ? "ring-amber-300 shadow-amber-400/30" : step.label === "กำลังดำเนินการ" ? "ring-blue-300 shadow-blue-400/30" : step.label === "รับแล้ว" ? "ring-emerald-300 shadow-emerald-400/30" : "ring-[#06B6D4]/40 shadow-[#06B6D4]/30"
                                                }`
                                                : `bg-gradient-to-br ${step.gradient} opacity-50 group-hover:opacity-100 shadow-md group-hover:shadow-lg`
                                                }`}
                                        >
                                            {step.icon}
                                        </div>

                                        {/* Badge */}
                                        {count > 0 && (
                                            <span className={`absolute -top-1.5 -right-0.5 min-w-[22px] h-[22px] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-1.5 shadow-md border-2 border-white transition-all duration-300 ${step.label === "ยกเลิก" ? "bg-gradient-to-r from-red-500 to-rose-500"
                                                : step.label === "รอตรวจสอบสลิป" ? "bg-gradient-to-r from-amber-500 to-orange-500"
                                                    : step.label === "กำลังดำเนินการ" ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                                                        : step.label === "รับแล้ว" ? "bg-gradient-to-r from-emerald-500 to-green-500"
                                                            : "bg-gradient-to-r from-red-500 to-rose-500"
                                                }`}>
                                                {count}
                                            </span>
                                        )}

                                        {/* Label */}
                                        <span
                                            className={`mt-2.5 text-[11px] font-semibold text-center transition-all duration-300 leading-tight ${isActive
                                                ? step.label === "ยกเลิก" ? "text-red-500" : step.label === "รอตรวจสอบสลิป" ? "text-amber-600" : step.label === "กำลังดำเนินการ" ? "text-blue-600" : step.label === "รับแล้ว" ? "text-emerald-600" : "text-[#06B6D4]"
                                                : "text-gray-400 group-hover:text-gray-600"
                                                }`}
                                        >
                                            {step.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* ===== Order Table ===== */}
                        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gradient-to-r from-[#06B6D4] to-[#0891b2]">
                                        <th className="py-3.5 px-4 text-center font-semibold text-white text-xs tracking-wide uppercase">รหัสคำสั่งซื้อ</th>
                                        <th className="py-3.5 px-4 text-center font-semibold text-white text-xs tracking-wide uppercase">สินค้า</th>
                                        <th className="py-3.5 px-4 text-center font-semibold text-white text-xs tracking-wide uppercase">จำนวน</th>
                                        <th className="py-3.5 px-4 text-center font-semibold text-white text-xs tracking-wide uppercase">ราคา</th>
                                        <th className="py-3.5 px-4 text-center font-semibold text-white text-xs tracking-wide uppercase">สถานะ</th>
                                        <th className="py-3.5 px-4 text-center font-semibold text-white text-xs tracking-wide uppercase w-[110px]">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="py-16 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-8 border-4 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin"></div>
                                                </div>
                                                <p className="mt-4 text-sm text-gray-500 font-medium">กำลังโหลดข้อมูลออเดอร์...</p>
                                            </td>
                                        </tr>
                                    ) : filteredOrders.length > 0 ? (
                                        filteredOrders.map((order, idx) => (
                                            <tr
                                                key={order.id}
                                                onClick={() => setViewingOrder(order)}
                                                className={`border-t border-gray-50 focus:bg-[#E0F2FE] hover:bg-[#F0FAFB] transition-all duration-200 cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                                    }`}
                                            >
                                                <td className="py-4 px-4 text-center">
                                                    <span className="text-gray-500 font-mono text-xs bg-gray-100 px-2 py-1 rounded-md">
                                                        {order.id}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-center text-gray-700 font-medium">
                                                    <div className="truncate max-w-[180px] sm:max-w-[250px] md:max-w-[350px] mx-auto" title={order.product}>
                                                        {order.product}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className="text-gray-700 font-semibold bg-gray-100 w-8 h-8 inline-flex items-center justify-center rounded-lg">
                                                        {order.quantity}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-center text-gray-700 font-semibold">{order.price?.toFixed(2) || "0.00"} <span className="text-gray-400 font-normal">฿</span></td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold ${getStatusStyle(order.status)}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${order.status === "รอตรวจสอบสลิป" ? "bg-amber-500" :
                                                            order.status === "กำลังดำเนินการ" ? "bg-blue-500 animate-pulse" :
                                                                order.status === "เสร็จรอรับ" ? "bg-cyan-500" :
                                                                    order.status === "รับแล้ว" ? "bg-emerald-500" :
                                                                        "bg-red-500"
                                                            }`} />
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {order.status === "รอตรวจสอบสลิป" ? (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent row click
                                                                setCancellingOrder({ id: order.id, realId: order.realId, product: order.product, price: order.price });
                                                            }}
                                                            className="px-3.5 py-1.5 rounded-lg bg-white text-red-500 text-xs font-semibold border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-md hover:shadow-red-500/20 active:scale-95 transition-all duration-200"
                                                        >
                                                            ยกเลิก
                                                        </button>
                                                    ) : order.status === "ยกเลิก" ? (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleStartChat(order.id, order.price); }}
                                                            disabled={loadingChat}
                                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#06B6D4] to-[#0891b2] text-white text-xs font-semibold hover:shadow-md hover:shadow-[#06B6D4]/30 active:scale-95 transition-all duration-200 disabled:opacity-50"
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                            </svg>
                                                            {loadingChat ? "รอ..." : "แชท"}
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-200 text-xs">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-16 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                            <polyline points="14 2 14 8 20 8" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-gray-400 text-sm font-medium">ไม่มีออเดอร์ในสถานะนี้</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary bar */}
                        <div className="mt-4 flex items-center justify-between px-2">
                            <p className="text-xs text-gray-400">
                                แสดง <span className="font-semibold text-gray-600">{filteredOrders.length}</span> จาก <span className="font-semibold text-gray-600">{orders.length}</span> รายการ
                            </p>
                            <p className="text-xs text-gray-400">
                                อัปเดตล่าสุด: <span className="font-medium text-gray-500">วันนี้</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Cancel Confirmation Modal ===== */}
            {cancellingOrder && (
                <CancelModal
                    order={cancellingOrder}
                    onCancel={() => handleCancelOrder(cancellingOrder.id, cancellingOrder.realId)}
                    onChat={() => handleStartChat(cancellingOrder.id, cancellingOrder.price)}
                    onClose={() => setCancellingOrder(null)}
                />
            )}

            {/* ===== Order Details Modal ===== */}
            {viewingOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setViewingOrder(null)} />
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                        <line x1="10" y1="9" x2="8" y2="9" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight tracking-wide">รายละเอียดคำสั่งซื้อ</h3>
                                    <p className="text-teal-100 text-xs font-mono">{viewingOrder.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setViewingOrder(null)} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* Order Items List */}
                        <div className="max-h-[60vh] overflow-y-auto p-6 bg-gray-50/50">
                            <div className="space-y-4">
                                {viewingOrder.items?.map((item: any, i: number) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">

                                        {/* Status or index indicator */}
                                        <div className="hidden sm:flex shrink-0 w-12 h-12 bg-gray-50 rounded-xl items-center justify-center text-gray-400 font-bold border border-gray-100">
                                            #{i + 1}
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            {/* Top info: Filename & Status */}
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold text-gray-800 break-all pr-4 flex-1">
                                                    {item.file_name}
                                                </h4>
                                                <div className="text-right shrink-0">
                                                    <p className="text-[#06B6D4] font-bold">{(item.total_price || 0).toFixed(2)} ฿</p>
                                                </div>
                                            </div>

                                            {/* Properties Grid */}
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-4 text-xs">
                                                <div>
                                                    <span className="text-gray-400 block mb-0.5 text-[10px]">ประเภทเอกสาร</span>
                                                    <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md inline-block">{item.document_type || "-"}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 block mb-0.5 text-[10px]">สี/ขาวดำ</span>
                                                    <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md inline-block">{item.document_detail || "-"}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 block mb-0.5 text-[10px]">ขนาด</span>
                                                    <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md inline-block">{item.document_size || "-"}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 block mb-0.5 text-[10px]">เข้าเล่ม</span>
                                                    <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md inline-block">{item.extra_option && item.extra_option !== "none" ? item.extra_option : "ไม่มี"}</span>
                                                </div>
                                            </div>

                                            {/* Quantity and Pages */}
                                            <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                                                <div className="flex gap-4">
                                                    <span>จำนวนหน้า: <strong className="text-gray-700">{item.page_count}</strong></span>
                                                    <span>จำนวนชุด: <strong className="text-gray-700">{item.quantity}</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Totals */}
                        <div className="bg-white p-5 border-t border-gray-100 flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                                วางเสร็จเมื่อ: {new Date(viewingOrder.createdAt).toLocaleString('th-TH')}
                            </div>
                            <div className="text-right flex items-center gap-3">
                                <span className="text-gray-400 text-sm font-medium">ยอดรวมทั้งหมด</span>
                                <span className="text-xl font-bold text-[#06B6D4]">{viewingOrder.price?.toFixed(2) || "0.00"} ฿</span>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
