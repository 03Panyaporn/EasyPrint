"use client";

import { useState } from "react";

// ============================================================
// Navbar Component - ปรับให้มีลูกเล่นมากขึ้น
// ============================================================
function Navbar() {
    return (
        <nav className="bg-white border-b border-[#D9D9D9] px-8 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-white/95">
            {/* โลโก้ EASYPRINT */}
            <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#0891b2] flex items-center justify-center shadow-md group-hover:shadow-[#06B6D4]/40 group-hover:scale-105 transition-all duration-300">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                    </svg>
                </div>
                <span className="text-[#06B6D4] font-bold text-xl tracking-wide group-hover:text-[#0891b2] transition-colors duration-200">EASYPRINT</span>
            </div>

            {/* เมนูนำทางกลาง */}
            <div className="flex items-center gap-8 text-gray-500 font-medium text-sm">
                {[
                    { label: "หน้าหลัก", href: "/customer", active: false },
                    { label: "สั่งพิมพ์", href: "/customer/order", active: true },
                    { label: "แชท", href: "/customer/chat", active: false },
                    { label: "ติดตามสถานะ", href: "/customer/order-status", active: false },
                ].map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className={`relative py-1 transition-colors duration-200 ${item.active
                            ? "text-[#06B6D4] font-semibold"
                            : "hover:text-[#06B6D4]"
                            }`}
                    >
                        {item.label}
                        {/* เส้นใต้ active tab */}
                        {item.active && (
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#06B6D4] to-[#0891b2] rounded-full" />
                        )}
                        {/* เส้นใต้ hover สำหรับ tab อื่น */}
                        {!item.active && (
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#06B6D4] rounded-full transition-all duration-300 group-hover:w-full hover:w-full" />
                        )}
                    </a>
                ))}
            </div>

            {/* ไอคอนและปุ่มด้านขวา */}
            <div className="flex items-center gap-3">

                {/* ปุ่มที่อยู่ */}
                <div className="relative group">
                    <button className="w-10 h-10 rounded-2xl bg-[#E0F3F7] border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] shadow-sm cursor-pointer">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                    </button>
                    {/* Tooltip */}
                    <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                        ที่อยู่จัดส่ง
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                    </div>
                </div>

                {/* ปุ่มตะกร้า */}
                <div className="relative group">
                    <button className="w-10 h-10 rounded-2xl bg-[#E0F3F7] border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] shadow-sm cursor-pointer">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                    </button>
                    {/* Badge จำนวนสินค้า */}
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] min-h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-1 shadow-sm">
                        0
                    </span>
                    {/* Tooltip */}
                    <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                        ตะกร้าสินค้า
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                    </div>
                </div>

                {/* ปุ่มออกจากระบบ - slide arrow effect */}
                <button className="group flex items-center gap-2 border border-[#D9D9D9] rounded-full px-4 py-2 text-sm text-gray-500 hover:border-red-400 hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all duration-200 shadow-sm">
                    <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="group-hover:translate-x-0.5 transition-transform duration-200"
                    >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span className="group-hover:tracking-wide transition-all duration-200">ออกจากระบบ</span>
                </button>
            </div>
        </nav>
    );
}

// ============================================================
// Footer Component
// ============================================================
function Footer() {
    return (
        <footer className="bg-[#0f2a38] text-white pt-10 pb-6 px-12">
            <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#0891b2] flex items-center justify-center shadow-sm">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 6 2 18 2 18 9" />
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                <rect x="6" y="14" width="12" height="8" />
                            </svg>
                        </div>
                        <span className="text-[#06B6D4] font-bold text-lg">EASYPRINT</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        ประสบการณ์ใหม่สำหรับการสั่งพิมพ์งานออนไลน์<br />
                        เพื่อความสะดวกสบาย พร้อมการแจ้งเตือน
                    </p>
                    <div className="flex gap-3">
                        {[
                            <path key="phone" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.41C1.61 3.26 2.39 2.26 3.52 2H6.5a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.55 9.5a16 16 0 0 0 6.91 6.91l.78-.78a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
                            <>
                                <path key="mail1" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline key="mail2" points="22,6 12,13 2,6" />
                            </>,
                            <path key="chat" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
                        ].map((icon, i) => (
                            <button key={i} className="group w-9 h-9 rounded-xl border border-gray-600 flex items-center justify-center text-gray-400 hover:text-[#06B6D4] hover:border-[#06B6D4] hover:bg-[#06B6D4]/10 hover:scale-110 active:scale-95 transition-all duration-200">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {icon}
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="text-[#06B6D4] font-semibold uppercase tracking-widest text-xs mb-4">PLATFORM</h4>
                    <ul className="space-y-2.5 text-gray-400 text-sm">
                        {["ออเดอร์ที่กำหนด", "รายบริการสำหรับ", "ติดตามสถานะ", "การช่วยเหลือ"].map((item) => (
                            <li key={item}>
                                <a href="#" className="hover:text-[#06B6D4] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 group">
                                    <span className="w-0 group-hover:w-3 h-px bg-[#06B6D4] transition-all duration-200 rounded-full" />
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-[#06B6D4] font-semibold uppercase tracking-widest text-xs mb-4">COMPANY</h4>
                    <ul className="space-y-2.5 text-gray-400 text-sm">
                        {["Our Vision", "Privacy Policy", "Terms of Use"].map((item) => (
                            <li key={item}>
                                <a href="#" className="hover:text-[#06B6D4] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 group">
                                    <span className="w-0 group-hover:w-3 h-px bg-[#06B6D4] transition-all duration-200 rounded-full" />
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-700 text-center text-gray-500 text-xs">
                © 2026 EasyPrint. All rights reserved.
            </div>
        </footer>
    );
}

// ============================================================
// Dropdown Row Component
// ============================================================
function FormRow({ label, value, onChange, options, placeholder }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
}) {
    return (
        <div className="flex items-center gap-4 group">
            <label className="w-36 text-sm font-medium text-gray-400 shrink-0 group-hover:text-[#06B6D4] transition-colors duration-200">{label}</label>
            <div className="flex-1 relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-gradient-to-r from-[#06B6D4] to-[#0891b2] text-white text-sm rounded-xl px-4 py-2.5 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/40 shadow-sm hover:shadow-[#06B6D4]/30 hover:shadow-md transition-all duration-200"
                >
                    <option value="" className="bg-white text-gray-700">{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-white text-gray-700">{opt.label}</option>
                    ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white text-xs opacity-80">▾</div>
            </div>
        </div>
    );
}

// ============================================================
// หน้าหลัก (Main Page Component)
// ============================================================
export default function OrderPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [documentType, setDocumentType] = useState("");
    const [documentDetail, setDocumentDetail] = useState("");
    const [documentSize, setDocumentSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [extraOption, setExtraOption] = useState("");

    const pricePerPage = 15;
    const totalPrice = (pricePerPage * quantity).toFixed(2);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) setSelectedFile(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setSelectedFile(file);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">

            {/* Status Bar */}
            <div className="bg-gradient-to-r from-[#E0F3F7] to-[#F0FAFB] py-1.5 px-6 flex items-center gap-2.5">
                <div className="w-10 h-5 bg-[#06B6D4] rounded-full flex items-center px-0.5 shadow-inner cursor-pointer hover:bg-[#0891b2] transition-colors duration-200">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                </div>
                <span className="text-sm text-gray-500">สถานะร้านค้า : <span className="text-[#06B6D4] font-semibold">เปิดบริการ</span></span>
            </div>

            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 py-8 px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Card หลัก */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E0F3F7] overflow-hidden">
                        {/* แถบสีบนของ Card */}
                        <div className="h-1.5 bg-gradient-to-r from-[#06B6D4] via-[#67e8f9] to-[#06B6D4] bg-[length:200%_100%] animate-[shimmer_3s_ease_infinite]" />

                        <div className="p-8">
                            <h1 className="text-lg font-semibold text-gray-700 mb-7">เริ่มสั่งพิมพ์</h1>

                            <div className="flex gap-8">
                                {/* คอลัมน์ซ้าย: ฟอร์ม */}
                                <div className="flex-1 flex flex-col gap-5">

                                    {/* Upload Zone */}
                                    <label
                                        htmlFor="file-upload"
                                        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${dragOver
                                            ? "border-[#06B6D4] bg-[#E0F3F7] scale-[1.01] shadow-md shadow-[#06B6D4]/20"
                                            : "border-[#D9D9D9] hover:border-[#06B6D4] hover:bg-[#F8FAFC] hover:shadow-sm"
                                            }`}
                                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={handleDrop}
                                    >
                                        <div className={`w-14 h-14 mb-3 rounded-2xl flex items-center justify-center transition-all duration-300 ${dragOver ? "bg-[#06B6D4] shadow-lg shadow-[#06B6D4]/40" : "bg-[#E0F3F7]"
                                            }`}>
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={dragOver ? "white" : "#06B6D4"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="16 16 12 12 8 16" />
                                                <line x1="12" y1="12" x2="12" y2="21" />
                                                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                            </svg>
                                        </div>
                                        {selectedFile ? (
                                            <div className="text-center">
                                                <p className="text-sm font-semibold text-[#06B6D4]">✓ {selectedFile.name}</p>
                                                <p className="text-xs text-gray-400 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm font-semibold text-gray-600 mb-1">อัปโหลดที่นี่</p>
                                                <p className="text-xs text-gray-400">PDF, Doc, PNG, JPG (max 50 MB)</p>
                                            </>
                                        )}
                                        <input id="file-upload" type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleFileChange} />
                                    </label>

                                    {/* Form rows */}
                                    <FormRow label="ประเภทเอกสาร" value={documentType} onChange={setDocumentType} placeholder="เลือกประเภทเอกสาร" options={[
                                        { value: "bw", label: "ถ่ายเอกสารขาวดำ" },
                                        { value: "color", label: "ถ่ายเอกสารสี" },
                                        { value: "photo", label: "รูปภาพ" },
                                        { value: "poster", label: "โปสเตอร์" },
                                        { value: "card", label: "นามบัตร" },
                                    ]} />

                                    <FormRow label="รายละเอียดเอกสาร" value={documentDetail} onChange={setDocumentDetail} placeholder="รายละเอียดเอกสาร (หน้าหลัง, หน้าเดียว)" options={[
                                        { value: "single", label: "หน้าเดียว" },
                                        { value: "double", label: "หน้าหลัง (สองด้าน)" },
                                    ]} />

                                    <FormRow label="ขนาด" value={documentSize} onChange={setDocumentSize} placeholder="เลือกขนาดเอกสาร" options={[
                                        { value: "A4", label: "A4" },
                                        { value: "A3", label: "A3" },
                                        { value: "A5", label: "A5" },
                                    ]} />

                                    {/* จำนวน */}
                                    <div className="flex items-center gap-4 group">
                                        <label className="w-36 text-sm font-medium text-gray-400 shrink-0 group-hover:text-[#06B6D4] transition-colors duration-200">จำนวน(ชุด)</label>
                                        <div className="flex-1 flex items-center gap-2">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-9 h-9 rounded-xl border border-[#D9D9D9] text-gray-400 hover:border-[#06B6D4] hover:text-[#06B6D4] hover:bg-[#E0F3F7] active:scale-90 transition-all duration-150 flex items-center justify-center font-bold text-lg"
                                            >−</button>
                                            <input
                                                type="number" min={1} value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                                className="flex-1 border border-[#D9D9D9] rounded-xl px-4 py-2.5 text-sm text-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] transition-all duration-200 font-semibold"
                                            />
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-9 h-9 rounded-xl border border-[#D9D9D9] text-gray-400 hover:border-[#06B6D4] hover:text-white hover:bg-[#06B6D4] active:scale-90 transition-all duration-150 flex items-center justify-center font-bold text-lg"
                                            >+</button>
                                        </div>
                                    </div>

                                    <FormRow label="ตัวเลือกเพิ่มเติม" value={extraOption} onChange={setExtraOption} placeholder="เลือกตัวเลือกเพิ่มเติม" options={[
                                        { value: "staple_corner", label: "เย็บมุมซ้ายบน" },
                                        { value: "spiral", label: "เข้าเล่มสันห่วง" },
                                        { value: "glue", label: "เข้าเล่มสันกาว" },
                                        { value: "none", label: "ไม่มีเพิ่มเติม" },
                                    ]} />

                                    {/* ราคารวม */}
                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#E0F3F7] to-[#F0FAFB] rounded-2xl border border-[#06B6D4]/20">
                                        <span className="w-36 text-sm font-semibold text-gray-600">ราคารวม</span>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white text-[#06B6D4] font-bold text-2xl rounded-xl px-6 py-2 min-w-[110px] text-center tracking-wide shadow-sm border border-[#06B6D4]/20">
                                                {totalPrice}
                                            </div>
                                            <span className="text-sm text-gray-400 font-medium">บาท</span>
                                        </div>
                                    </div>

                                    {/* ปุ่ม */}
                                    <div className="flex items-center justify-center gap-6 mt-10 pl-16">
                                        <button
                                            onClick={() => window.history.back()}
                                            className="px-8 py-2 text-sm bg-white text-gray-500 font-medium rounded-full border border-[#D9D9D9] hover:bg-[#E0F3F7] hover:text-[#06B6D4] hover:border-[#06B6D4] active:scale-95 transition-all duration-200 shadow-sm"
                                        >
                                            ย้อนกลับ
                                        </button>
                                        <button className="px-8 py-2 text-sm bg-gradient-to-r from-[#06B6D4] to-[#0891b2] text-white font-semibold rounded-full active:scale-95 transition-all duration-200 shadow-md hover:shadow-[#06B6D4]/40 hover:shadow-xl flex items-center gap-2">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                            </svg>
                                            เพิ่มลงตะกร้า
                                        </button>
                                    </div>
                                </div>

                                {/* คอลัมน์ขวา: Preview */}
                                <div className="w-56 flex flex-col">
                                    <p className="text-sm text-gray-600 font-semibold mb-3">แสดงตัวอย่าง</p>
                                    <div className="flex-1 border-2 border-[#06B6D4]/40 rounded-2xl overflow-hidden flex items-center justify-center bg-[#F8FAFC] min-h-[320px] hover:border-[#06B6D4] transition-colors duration-300">
                                        {selectedFile && selectedFile.type.startsWith("image/") ? (
                                            <img src={URL.createObjectURL(selectedFile)} alt="ตัวอย่าง" className="w-full h-full object-contain p-3" />
                                        ) : (
                                            <div className="w-full h-full p-3 flex items-center justify-center">
                                                <div className="w-full h-full bg-[#EBEBEB] rounded-xl flex items-center justify-center">
                                                    <span className="text-sm text-gray-400">ตัวอย่าง</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
