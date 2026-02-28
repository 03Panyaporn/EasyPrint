"use client";

import { useState } from "react";


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
        <div className="bg-[#F8FAFC] py-8 px-8">
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
                                    <button
                                        onClick={() => console.log('เพิ่มลงตะกร้า')}
                                        className="px-8 py-2 text-sm bg-gradient-to-r from-[#06B6D4] to-[#0891b2] text-white font-semibold rounded-full active:scale-95 transition-all duration-200 shadow-md hover:shadow-[#06B6D4]/40 hover:shadow-xl flex items-center gap-2">
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
        </div>
    );
}
