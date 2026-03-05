"use client";

import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

// ─── File Preview Modal ───────────────────────────────────────────────────────
function FilePreviewModal({ item, onClose }: { item: CartItem; onClose: () => void }) {
    const [currentPage, setCurrentPage] = useState(1);
    const isPdf = item.fileName.toLowerCase().endsWith(".pdf");
    const totalPages = item.pageCount > 0 ? item.pageCount : 1;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden flex flex-col"
                style={{ maxHeight: "90vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-700 truncate">{item.fileName}</p>
                        {totalPages > 1 && (
                            <p className="text-xs text-gray-400 mt-0.5">{totalPages} หน้า</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all shrink-0 ml-3"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Preview area */}
                <div className="flex-1 overflow-hidden bg-gray-50 flex items-center justify-center" style={{ minHeight: 400 }}>
                    {item.fileUrl ? (
                        isPdf ? (
                            <iframe
                                key={`modal-pdf-${currentPage}`}
                                src={`${item.fileUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-full border-0"
                                style={{ height: 580 }}
                                scrolling="no"
                                title={`หน้า ${currentPage}`}
                            />
                        ) : (
                            <img
                                src={item.fileUrl}
                                alt={item.fileName}
                                className="max-w-full max-h-[580px] object-contain p-4"
                            />
                        )
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <p className="text-sm">ไม่มีตัวอย่างไฟล์</p>
                        </div>
                    )}
                </div>

                {/* Page navigation (PDF only, multi-page) */}
                {isPdf && totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-white">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#06B6D4] hover:text-[#06B6D4] hover:bg-[#E0F3F7] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>

                        {/* Page dots (max 10) */}
                        {totalPages <= 10 ? (
                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button key={p} onClick={() => setCurrentPage(p)}
                                        className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all ${currentPage === p ? "bg-[#06B6D4] text-white" : "bg-[#E0F3F7] text-[#06B6D4] hover:bg-[#06B6D4]/20"}`}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <span className="text-sm text-gray-500">
                                หน้า <span className="font-bold text-[#06B6D4]">{currentPage}</span> / {totalPages}
                            </span>
                        )}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#06B6D4] hover:text-[#06B6D4] hover:bg-[#E0F3F7] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Checkout Page ───────────────────────────────────────────────────────
export default function CheckoutPage() {
    const { selectedItems, clearCart, clearSelection } = useCart();
    const router = useRouter();

    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const [wantReceipt, setWantReceipt] = useState<"yes" | "no" | null>(null);
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [previewItem, setPreviewItem] = useState<CartItem | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const grandTotal = selectedItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const isReady = proofFile !== null && wantReceipt !== null && agreedTerms && !isSubmitting;

    const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setProofFile(file);
        setProofPreview(URL.createObjectURL(file));
    };

    const handleConfirm = async () => {
        if (!isReady || !proofFile) return;
        setIsSubmitting(true);

        try {
            // Get user
            const userJson = sessionStorage.getItem('user');
            const user = userJson ? JSON.parse(userJson) : null;

            if (!user?.id) {
                alert("กรุณาเข้าสู่ระบบก่อนชำระเงิน");
                setIsSubmitting(false);
                return;
            }

            // 1. Upload payment slip picture to storage bucket 'slips'
            const fileExt = proofFile.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `receipts/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('slips')
                .upload(filePath, proofFile);

            if (uploadError) throw uploadError;

            // Get public URL of the uploaded image
            const { data: { publicUrl } } = supabase.storage
                .from('slips')
                .getPublicUrl(filePath);

            // 2. Insert into orders table
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    customer_id: user.id,
                    merchant_id: 'b9652bb2-cba5-4440-9d89-0f93f598cb67', // Hardcoded merchant for now
                    total_price: grandTotal,
                    payment_slip_url: publicUrl,
                    want_receipt: wantReceipt === 'yes',
                    status: 'รอตรวจสอบสลิป'
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            // 3. Upload all document files and get their public URLs
            const orderItemsInsertData = await Promise.all(selectedItems.map(async (item) => {
                let finalFileUrl = item.fileUrl; // fallback

                if (item.file) {
                    const docExt = item.file.name.split('.').pop();
                    const docFileName = `doc_${Date.now()}_${Math.random().toString(36).substring(7)}.${docExt}`;
                    const docFilePath = `receipts/${docFileName}`;

                    const { error: docUploadError } = await supabase.storage
                        .from('slips') // reusing the 'slips' bucket for simplicity as it likely has public access
                        .upload(docFilePath, item.file);

                    if (!docUploadError) {
                        const { data: { publicUrl: docPublicUrl } } = supabase.storage
                            .from('slips')
                            .getPublicUrl(docFilePath);
                        finalFileUrl = docPublicUrl;
                    } else {
                        console.error(`Error uploading ${item.fileName}:`, docUploadError);
                    }
                }

                return {
                    order_id: orderData.id,
                    file_name: item.fileName,
                    file_url: finalFileUrl,
                    document_type: item.documentType,
                    document_detail: item.documentDetail,
                    document_size: item.documentSize,
                    extra_option: item.extraOption,
                    page_count: item.pageCount,
                    quantity: item.quantity,
                    unit_price: item.totalPrice / item.quantity,
                    total_price: item.totalPrice
                };
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItemsInsertData);

            if (itemsError) throw itemsError;

            // If everything is successful, clear cart and redirect
            clearSelection();
            clearCart();
            router.push("/customer/tracking");

        } catch (error: any) {
            console.error("Order submission error:", error);
            alert("เกิดข้อผิดพลาดในการสั่งซื้อ: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (selectedItems.length === 0) {
        return (
            <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 font-medium mb-3">ไม่มีรายการที่เลือก</p>
                    <button onClick={() => router.push("/customer/cart")}
                        className="px-6 py-2 bg-[#06B6D4] text-white text-sm rounded-full">
                        กลับตะกร้า
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* ── File Preview Modal ── */}
            {previewItem && (
                <FilePreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
            )}

            <div className="bg-[#F8FAFC] min-h-screen py-8 px-8">
                <div className="max-w-3xl mx-auto flex flex-col gap-5">

                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#0891b2] flex items-center justify-center shadow-md">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-700">ชำระเงิน</h1>
                            <p className="text-xs text-gray-400">{selectedItems.length} รายการ</p>
                        </div>
                    </div>

                    {/* ── Card รายการสินค้า + QR (รวมกรอบเดียว) ── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E0F3F7] overflow-hidden">
                        <div className="h-1.5 bg-gradient-to-r from-[#06B6D4] via-[#67e8f9] to-[#06B6D4]" />
                        <div className="p-6">

                            {/* ── รายการสินค้า ── */}
                            <h2 className="text-sm font-bold text-gray-700 mb-4">รายการสินค้าทั้งหมด</h2>
                            <div className="flex flex-col gap-3">
                                {selectedItems.map((item, idx) => (
                                    <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-gray-100">

                                        {/* Index */}
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#06B6D4] to-[#0891b2] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                                            {idx + 1}
                                        </div>

                                        {/* Thumbnail — คลิกเพื่อเปิด modal */}
                                        <button
                                            onClick={() => item.fileUrl && setPreviewItem(item)}
                                            className={`w-16 h-16 rounded-xl overflow-hidden border shrink-0 flex items-center justify-center transition-all duration-200
                                                ${item.fileUrl
                                                    ? "border-[#06B6D4]/40 bg-[#E0F3F7] cursor-pointer hover:ring-2 hover:ring-[#06B6D4] hover:scale-105 hover:shadow-md"
                                                    : "border-gray-200 bg-gray-100 cursor-default"}`}
                                            title={item.fileUrl ? "คลิกเพื่อดูไฟล์" : ""}
                                        >
                                            {item.fileUrl ? (
                                                item.fileName.toLowerCase().endsWith(".pdf") ? (
                                                    // PDF thumbnail: scale iframe ลง — parent overflow:hidden clip scrollbar ออก
                                                    <div style={{
                                                        width: 64, height: 90,
                                                        overflow: "hidden",
                                                        position: "relative",
                                                        borderRadius: 6,
                                                    }}>
                                                        <iframe
                                                            src={`${item.fileUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                                            style={{
                                                                width: 640,
                                                                height: 900,
                                                                transform: "scale(0.1)",
                                                                transformOrigin: "top left",
                                                                pointerEvents: "none",
                                                                border: 0,
                                                            }}
                                                            scrolling="no"
                                                            title={item.fileName}
                                                        />
                                                    </div>
                                                ) : (
                                                    // Image thumbnail: แสดงรูปจริง
                                                    <img src={item.fileUrl} alt={item.fileName} className="w-full h-full object-cover" />
                                                )
                                            ) : (
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                    <polyline points="14 2 14 8 20 8" />
                                                </svg>
                                            )}
                                        </button>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-700 truncate" title={item.fileName}>
                                                {item.fileName}
                                            </p>

                                            <div className="mt-1.5 flex flex-wrap gap-1">
                                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E0F3F7] text-[#06B6D4] font-semibold">{item.documentType}</span>
                                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-semibold">{item.documentDetail}</span>
                                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500 font-semibold">{item.documentSize}</span>
                                                {item.extraOption !== "ไม่มีเพิ่มเติม" && (
                                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 font-semibold">{item.extraOption}</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1.5">
                                                {item.pageCount > 0 && <span>{item.pageCount} หน้า • </span>}
                                                จำนวน <span className="font-semibold text-gray-600">{item.quantity}</span> ชุด
                                            </p>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right shrink-0">
                                            <p className="text-base font-bold text-[#06B6D4]">{item.totalPrice.toFixed(2)}</p>
                                            <p className="text-xs text-gray-400">บาท</p>
                                        </div>
                                    </div>
                                ))}
                                {/* ไม่มี row ยอดรวม ซ้ำกัน — แสดงใน QR card แล้ว */}
                            </div>

                            {/* ── ระยะห่าง + Divider ── */}
                            <div className="mt-8 mb-8 border-t border-dashed border-gray-200" />

                            {/* ── การชำระเงิน ── */}
                            <h2 className="text-sm font-bold text-gray-700 mb-4">การชำระเงิน</h2>
                            <div className="flex gap-6 items-start">

                                {/* QR Code */}
                                <div className="flex flex-col items-center gap-2 shrink-0">
                                    <div className="border-2 border-[#06B6D4]/30 rounded-2xl p-3 bg-white shadow-sm">
                                        <svg width="140" height="140" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="160" height="160" fill="white" />
                                            <rect x="10" y="10" width="50" height="50" rx="4" fill="none" stroke="#000" strokeWidth="6" />
                                            <rect x="20" y="20" width="30" height="30" rx="2" fill="#000" />
                                            <rect x="100" y="10" width="50" height="50" rx="4" fill="none" stroke="#000" strokeWidth="6" />
                                            <rect x="110" y="20" width="30" height="30" rx="2" fill="#000" />
                                            <rect x="10" y="100" width="50" height="50" rx="4" fill="none" stroke="#000" strokeWidth="6" />
                                            <rect x="20" y="110" width="30" height="30" rx="2" fill="#000" />
                                            <rect x="70" y="10" width="10" height="10" fill="#000" /><rect x="85" y="10" width="10" height="10" fill="#000" />
                                            <rect x="70" y="25" width="10" height="10" fill="#000" /><rect x="70" y="40" width="10" height="10" fill="#000" />
                                            <rect x="85" y="55" width="10" height="10" fill="#000" />
                                            <rect x="10" y="70" width="10" height="10" fill="#000" /><rect x="25" y="70" width="10" height="10" fill="#000" />
                                            <rect x="40" y="70" width="10" height="10" fill="#000" /><rect x="55" y="70" width="10" height="10" fill="#000" />
                                            <rect x="70" y="70" width="10" height="10" fill="#000" /><rect x="85" y="70" width="10" height="10" fill="#000" />
                                            <rect x="100" y="70" width="10" height="10" fill="#000" /><rect x="115" y="70" width="10" height="10" fill="#000" />
                                            <rect x="130" y="70" width="10" height="10" fill="#000" /><rect x="145" y="70" width="10" height="10" fill="#000" />
                                            <rect x="10" y="85" width="10" height="10" fill="#000" /><rect x="40" y="85" width="10" height="10" fill="#000" />
                                            <rect x="70" y="85" width="10" height="10" fill="#000" /><rect x="100" y="85" width="10" height="10" fill="#000" />
                                            <rect x="130" y="85" width="10" height="10" fill="#000" /><rect x="145" y="85" width="10" height="10" fill="#000" />
                                            <rect x="70" y="100" width="10" height="10" fill="#000" /><rect x="85" y="100" width="10" height="10" fill="#000" />
                                            <rect x="115" y="100" width="10" height="10" fill="#000" /><rect x="145" y="100" width="10" height="10" fill="#000" />
                                            <rect x="70" y="115" width="10" height="10" fill="#000" /><rect x="100" y="115" width="10" height="10" fill="#000" />
                                            <rect x="130" y="115" width="10" height="10" fill="#000" />
                                            <rect x="70" y="130" width="10" height="10" fill="#000" /><rect x="85" y="130" width="10" height="10" fill="#000" />
                                            <rect x="115" y="130" width="10" height="10" fill="#000" /><rect x="145" y="130" width="10" height="10" fill="#000" />
                                            <rect x="70" y="145" width="10" height="10" fill="#000" /><rect x="100" y="145" width="10" height="10" fill="#000" />
                                            <rect x="130" y="145" width="10" height="10" fill="#000" />
                                        </svg>
                                    </div>
                                    <p className="text-xs font-semibold text-gray-600">สแกน PromptPay</p>
                                    <p className="text-xs text-gray-400">099-XXX-XXXX</p>
                                </div>

                                {/* Price summary */}
                                <div className="flex-1">
                                    <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891b2] rounded-2xl p-5 text-white">
                                        <p className="text-xs font-semibold opacity-70 mb-3 uppercase tracking-wide">สรุปยอดชำระ</p>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="opacity-80">ค่าพิมพ์</span>
                                            <span className="font-semibold">{grandTotal.toFixed(2)} บาท</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-4 pb-3 border-b border-white/20">
                                            <span className="opacity-80">ค่าบริการ</span>
                                            <span className="font-semibold">0.00 บาท</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="font-bold">รวมทั้งหมด</span>
                                            <span className="text-2xl font-bold">{grandTotal.toFixed(2)} <span className="text-sm font-normal opacity-80">บาท</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ── Card อัปโหลดสลิป + ใบเสร็จ + ยืนยัน ── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E0F3F7] overflow-hidden">
                        <div className="h-1.5 bg-gradient-to-r from-[#06B6D4] via-[#67e8f9] to-[#06B6D4]" />
                        <div className="p-6 flex flex-col gap-5">

                            {/* Upload proof */}
                            <div>
                                <p className="text-sm font-bold text-gray-700 mb-3">หลักฐานการชำระเงิน <span className="text-red-400">*</span></p>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all duration-200
                                        ${proofFile ? "border-green-400 bg-green-50" : "border-[#D9D9D9] hover:border-[#06B6D4] hover:bg-[#F8FAFC]"}`}
                                >
                                    {proofPreview ? (
                                        <>
                                            <img src={proofPreview} alt="สลิป" className="w-14 h-14 rounded-xl object-cover border border-gray-200 shadow-sm" />
                                            <div>
                                                <p className="text-sm font-semibold text-green-600">✓ {proofFile?.name}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">คลิกเพื่อเปลี่ยนไฟล์</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-xl bg-[#E0F3F7] flex items-center justify-center shrink-0">
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-600">อัปโหลดสลิปการโอน</p>
                                                <p className="text-xs text-gray-400 mt-0.5">PNG, JPG (ไม่เกิน 10 MB)</p>
                                            </div>
                                        </>
                                    )}
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProofChange} />
                                </div>
                            </div>

                            {/* Receipt option */}
                            <div>
                                <p className="text-sm font-bold text-gray-700 mb-3">ต้องการรับใบเสร็จหรือไม่ <span className="text-red-400">*</span></p>
                                <div className="flex gap-3">
                                    {[
                                        { val: "yes" as const, label: "รับใบเสร็จ", icon: "🧾" },
                                        { val: "no" as const, label: "ไม่รับใบเสร็จ", icon: "✖" },
                                    ].map(({ val, label, icon }) => (
                                        <button key={val} onClick={() => setWantReceipt(val)}
                                            className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-150
                                                ${wantReceipt === val ? "border-[#06B6D4] bg-[#E0F3F7] text-[#06B6D4]" : "border-gray-200 text-gray-500 hover:border-[#06B6D4]/40"}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${wantReceipt === val ? "border-[#06B6D4]" : "border-gray-300"}`}>
                                                {wantReceipt === val && <div className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />}
                                            </div>
                                            {icon} {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Terms */}
                            <div onClick={() => setAgreedTerms(!agreedTerms)} className="flex items-start gap-3 cursor-pointer group">
                                <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all
                                    ${agreedTerms ? "bg-[#06B6D4] border-[#06B6D4]" : "border-gray-300 group-hover:border-[#06B6D4]"}`}>
                                    {agreedTerms && (
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    ยอมรับข้อตกลงทั้งหมด{" "}
                                    <span className="text-[#06B6D4] font-semibold underline">อ่านเงื่อนไขทั้งหมด</span>
                                    {" "}— ข้าพเจ้าได้โอนเงินตามจำนวนที่ระบุและยืนยันว่าข้อมูลถูกต้องครบถ้วน
                                </p>
                            </div>

                            {/* Hint */}
                            {!isReady && (
                                <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <p className="text-xs text-amber-700">
                                        กรุณา{[!proofFile && "อัปโหลดสลิป", !wantReceipt && "เลือกรับใบเสร็จ", !agreedTerms && "ยอมรับข้อตกลง"].filter(Boolean).join(", ")}ก่อน
                                    </p>
                                </div>
                            )}

                            {/* Confirm */}
                            <button onClick={handleConfirm} disabled={!isReady}
                                className={`w-full py-3.5 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition-all duration-200
                                    ${isReady
                                        ? "bg-gradient-to-r from-[#06B6D4] to-[#0891b2] text-white shadow-md hover:shadow-[#06B6D4]/40 hover:shadow-xl active:scale-[0.98] cursor-pointer"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        กำลังบันทึกข้อมูล...
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                        ยืนยันการชำระเงิน
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
