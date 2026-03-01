"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TYPE_COLOR: Record<string, string> = {
    "ถ่ายเอกสารขาวดำ": "bg-gray-100 text-gray-600",
    "ถ่ายเอกสารสี": "bg-blue-50 text-blue-600",
    "รูปภาพ": "bg-purple-50 text-purple-600",
    "โปสเตอร์": "bg-pink-50 text-pink-600",
    "นามบัตร": "bg-green-50 text-green-600",
};

export default function CartPage() {
    const { cartItems, cartCount, selectedIds, selectedItems, removeFromCart, clearCart, toggleSelect, selectAll, clearSelection } = useCart();
    const router = useRouter();

    const grandTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const selectedTotal = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const allSelected = cartItems.length > 0 && selectedIds.size === cartItems.length;

    const handleCheckout = () => {
        if (selectedItems.length === 0) return;
        router.push("/customer/checkout");
    };

    return (
        <div className="bg-[#F8FAFC] min-h-screen py-8 px-8">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#0891b2] flex items-center justify-center shadow-md">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-700">ตะกร้าสินค้า</h1>
                            <p className="text-xs text-gray-400">{cartCount} รายการ</p>
                        </div>
                    </div>

                    {cartItems.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 rounded-full px-3 py-1.5 transition-all duration-200 hover:bg-red-50"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                            </svg>
                            ล้างตะกร้า
                        </button>
                    )}
                </div>

                {/* Empty State */}
                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E0F3F7] overflow-hidden">
                        <div className="h-1.5 bg-gradient-to-r from-[#06B6D4] via-[#67e8f9] to-[#06B6D4]" />
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-20 h-20 rounded-3xl bg-[#E0F3F7] flex items-center justify-center">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                            </div>
                            <p className="text-gray-500 font-medium">ตะกร้าว่างเปล่า</p>
                            <p className="text-sm text-gray-400">เพิ่มสินค้าที่ต้องการสั่งพิมพ์ก่อนนะ</p>
                            <Link href="/customer/order"
                                className="mt-2 px-6 py-2.5 bg-gradient-to-r from-[#06B6D4] to-[#0891b2] text-white text-sm font-semibold rounded-full shadow-md hover:shadow-[#06B6D4]/40 hover:shadow-xl transition-all duration-200 active:scale-95">
                                เริ่มสั่งพิมพ์
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">

                        {/* Select all bar */}
                        <div className="bg-white rounded-2xl border border-[#E0F3F7] shadow-sm px-5 py-3 flex items-center justify-between">
                            <label className="flex items-center gap-3 cursor-pointer select-none group">
                                <div
                                    onClick={() => allSelected ? clearSelection() : selectAll()}
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 cursor-pointer
                                        ${allSelected ? "bg-[#06B6D4] border-[#06B6D4]" : "border-gray-300 group-hover:border-[#06B6D4]"}`}
                                >
                                    {allSelected && (
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-600">เลือกทั้งหมด ({cartItems.length} รายการ)</span>
                            </label>
                            {selectedIds.size > 0 && (
                                <span className="text-xs text-[#06B6D4] font-semibold bg-[#E0F3F7] px-3 py-1 rounded-full">
                                    เลือกแล้ว {selectedIds.size} รายการ • {selectedTotal.toFixed(2)} บาท
                                </span>
                            )}
                        </div>

                        {/* Cart Items */}
                        <div className="flex flex-col gap-3">
                            {cartItems.map((item, idx) => {
                                const isSelected = selectedIds.has(item.id);
                                return (
                                    <div
                                        key={item.id}
                                        className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-200 cursor-pointer
                                            ${isSelected
                                                ? "border-[#06B6D4] shadow-[#06B6D4]/15 shadow-md"
                                                : "border-[#E0F3F7] hover:shadow-md hover:border-[#06B6D4]/30"}`}
                                        onClick={() => toggleSelect(item.id)}
                                    >
                                        <div className="p-5 flex items-start gap-4">

                                            {/* Checkbox */}
                                            <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 shrink-0
                                                ${isSelected ? "bg-[#06B6D4] border-[#06B6D4]" : "border-gray-300"}`}>
                                                {isSelected && (
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </div>

                                            {/* Index badge */}
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#0891b2] flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                                                {idx + 1}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-700 truncate" title={item.fileName}>
                                                    📄 {item.fileName}
                                                </p>
                                                <div className="mt-2 flex flex-wrap gap-1.5">
                                                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${TYPE_COLOR[item.documentType] ?? "bg-[#E0F3F7] text-[#06B6D4]"}`}>
                                                        {item.documentType}
                                                    </span>
                                                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E0F3F7] text-[#06B6D4]">
                                                        {item.documentDetail}
                                                    </span>
                                                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-500">
                                                        {item.documentSize}
                                                    </span>
                                                    {item.extraOption !== "ไม่มีเพิ่มเติม" && (
                                                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-500">
                                                            {item.extraOption}
                                                        </span>
                                                    )}
                                                    {item.pageCount > 0 && (
                                                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                                            {item.pageCount} หน้า
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-3 flex items-center gap-4">
                                                    <span className="text-xs text-gray-400">
                                                        จำนวน <span className="font-semibold text-gray-600">{item.quantity}</span> ชุด
                                                    </span>
                                                    <span className="text-xs text-gray-300">│</span>
                                                    <span className="text-xs text-gray-400">
                                                        ราคา <span className="font-bold text-[#06B6D4] text-sm">{item.totalPrice.toFixed(2)}</span> บาท
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Remove button */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                                                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-200 shrink-0"
                                                title="ลบออกจากตะกร้า"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-[#E0F3F7] overflow-hidden">
                            <div className="h-1.5 bg-gradient-to-r from-[#06B6D4] via-[#67e8f9] to-[#06B6D4]" />
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-500">จำนวนสินค้าทั้งหมด</span>
                                    <span className="text-sm font-semibold text-gray-700">{cartCount} รายการ</span>
                                </div>
                                {selectedIds.size > 0 && (
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-[#06B6D4]">รายการที่เลือก</span>
                                        <span className="text-sm font-semibold text-[#06B6D4]">{selectedIds.size} รายการ</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between border-t border-dashed border-gray-100 pt-3 mt-2">
                                    <span className="text-base font-bold text-gray-700">ราคารวมทั้งหมด</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-2xl font-bold text-[#06B6D4]">{grandTotal.toFixed(2)}</span>
                                        <span className="text-sm text-gray-400 font-medium">บาท</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between">
                            <Link href="/customer/order"
                                className="flex items-center gap-2 px-6 py-2.5 text-sm text-[#06B6D4] border border-[#06B6D4]/40 rounded-full hover:bg-[#E0F3F7] transition-all duration-200 font-medium">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                เพิ่มรายการอีก
                            </Link>

                            <button
                                onClick={handleCheckout}
                                disabled={selectedIds.size === 0}
                                className={`px-8 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 active:scale-95 flex items-center gap-2
                                    ${selectedIds.size > 0
                                        ? "bg-gradient-to-r from-[#06B6D4] to-[#0891b2] text-white shadow-md hover:shadow-[#06B6D4]/40 hover:shadow-xl cursor-pointer"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"}`}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                สั่งซื้อที่เลือก
                                {selectedIds.size > 0 && (
                                    <span className="ml-1 bg-white/25 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                                        {selectedIds.size}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Hint when nothing selected */}
                        {selectedIds.size === 0 && (
                            <p className="text-center text-xs text-gray-400">กรุณาเลือกสินค้าที่ต้องการสั่งซื้อก่อน</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
