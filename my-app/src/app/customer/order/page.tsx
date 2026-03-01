"use client";

import { useState, useCallback } from "react";
import { useCart } from "@/context/CartContext";

// ─────────────────────────────────────────────────────────────
// FormRow component
// ─────────────────────────────────────────────────────────────
function FormRow({
    label, value, onChange, options, placeholder,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
}) {
    return (
        <div className="flex items-center gap-4 group">
            <label className="w-36 text-sm font-medium text-gray-400 shrink-0 group-hover:text-[#06B6D4] transition-colors duration-200">
                {label}
            </label>
            <div className="flex-1 relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-gradient-to-r from-[#06B6D4] to-[#0891b2] text-white text-sm rounded-xl px-4 py-2.5 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/40 shadow-sm hover:shadow-[#06B6D4]/30 hover:shadow-md transition-all duration-200"
                >
                    <option value="" className="bg-white text-gray-700">{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-white text-gray-700">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white text-xs opacity-80">▾</div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────
export default function OrderPage() {
    const { addToCart } = useCart();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [documentType, setDocumentType] = useState("");
    const [documentDetail, setDocumentDetail] = useState("");
    const [documentSize, setDocumentSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [extraOption, setExtraOption] = useState("");

    // PDF page state
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingCount, setIsLoadingCount] = useState(false);

    // Toast state
    const [showToast, setShowToast] = useState(false);

    const pricePerPage = 15;
    const totalPrice = selectedFile ? (pricePerPage * quantity).toFixed(2) : "0.00";

    // ── ตรวจสอบว่าครบเงื่อนไขหรือไม่ ──────────────────────────
    const isFormComplete =
        selectedFile !== null &&
        documentType !== "" &&
        documentDetail !== "" &&
        documentSize !== "" &&
        extraOption !== "";

    // ── ฟิลด์ที่ยังขาด (สำหรับ tooltip) ──────────────────────
    const missingFields = [
        !selectedFile && "อัปโหลดไฟล์",
        !documentType && "ประเภทเอกสาร",
        !documentDetail && "รายละเอียดเอกสาร",
        !documentSize && "ขนาด",
        !extraOption && "ตัวเลือกเพิ่มเติม",
    ].filter(Boolean) as string[];

    // ── นับหน้า PDF ด้วย pdf-lib ─────────────────────────────
    const countPdfPages = useCallback(async (file: File) => {
        setIsLoadingCount(true);
        try {
            const { PDFDocument } = await import("pdf-lib");
            const buffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
            setPageCount(pdf.getPageCount());
        } catch {
            setPageCount(0);
        } finally {
            setIsLoadingCount(false);
        }
    }, []);

    // ── เลือกไฟล์ ─────────────────────────────────────────────
    const handleFile = (file: File) => {
        if (fileUrl) URL.revokeObjectURL(fileUrl);
        const url = URL.createObjectURL(file);
        setSelectedFile(file);
        setFileUrl(url);
        setCurrentPage(1);
        setPageCount(0);

        if (file.type === "application/pdf") {
            countPdfPages(file);
        } else if (file.type.startsWith("image/")) {
            setPageCount(1);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    // ── เพิ่มลงตะกร้า ─────────────────────────────────────────
    const handleAddToCart = () => {
        if (!isFormComplete || !selectedFile) return;

        const LABELS: Record<string, string> = {
            bw: "ถ่ายเอกสารขาวดำ", color: "ถ่ายเอกสารสี", photo: "รูปภาพ",
            poster: "โปสเตอร์", card: "นามบัตร",
            single: "หน้าเดียว", double: "หน้าหลัง (สองด้าน)",
            A4: "A4", A3: "A3", A5: "A5",
            staple_corner: "เย็บมุมซ้ายบน", spiral: "เข้าเล่มสันห่วง",
            glue: "เข้าเล่มสันกาว", none: "ไม่มีเพิ่มเติม",
        };

        addToCart({
            id: `${Date.now()}-${Math.random()}`,
            fileName: selectedFile.name,
            fileUrl: fileUrl ?? undefined,   // keep URL alive for checkout preview
            documentType: LABELS[documentType] ?? documentType,
            documentDetail: LABELS[documentDetail] ?? documentDetail,
            documentSize: LABELS[documentSize] ?? documentSize,
            quantity,
            extraOption: LABELS[extraOption] ?? extraOption,
            pageCount,
            totalPrice: pricePerPage * quantity,
        });

        // รีเซ็ตฟอร์ม (ไม่ revoke fileUrl เพราะ checkout ยังต้องใช้)
        setSelectedFile(null);
        setFileUrl(null);
        setDocumentType("");
        setDocumentDetail("");
        setDocumentSize("");
        setQuantity(1);
        setExtraOption("");
        setPageCount(0);
        setCurrentPage(1);

        // แสดง toast
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const isPdf = selectedFile?.type === "application/pdf";
    const isImage = selectedFile?.type.startsWith("image/");

    const iframeSrc = fileUrl
        ? `${fileUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0`
        : null;

    return (
        <div className="bg-[#F8FAFC] py-8 px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-[#E0F3F7] overflow-hidden">
                    {/* top bar */}
                    <div className="h-1.5 bg-gradient-to-r from-[#06B6D4] via-[#67e8f9] to-[#06B6D4]" />

                    <div className="p-8">
                        <h1 className="text-lg font-semibold text-gray-700 mb-7">เริ่มสั่งพิมพ์</h1>

                        <div className="flex gap-8">

                            {/* ── Left column ── */}
                            <div className="flex-1 flex flex-col gap-5">

                                {/* Upload zone */}
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
                                    <div className={`w-14 h-14 mb-3 rounded-2xl flex items-center justify-center transition-all duration-300 ${dragOver ? "bg-[#06B6D4] shadow-lg" : "bg-[#E0F3F7]"}`}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                                            stroke={dragOver ? "white" : "#06B6D4"} strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="16 16 12 12 8 16" />
                                            <line x1="12" y1="12" x2="12" y2="21" />
                                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                        </svg>
                                    </div>

                                    {selectedFile ? (
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-[#06B6D4]">✓ {selectedFile.name}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                            {isLoadingCount && (
                                                <p className="text-xs text-[#06B6D4] mt-1 animate-pulse">กำลังนับหน้า...</p>
                                            )}
                                            {pageCount > 0 && !isLoadingCount && (
                                                <span className="mt-2 inline-flex items-center gap-1.5 bg-[#E0F3F7] text-[#06B6D4] text-xs font-semibold px-3 py-1 rounded-full">
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                                                        stroke="currentColor" strokeWidth="2.5"
                                                        strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                        <polyline points="14 2 14 8 20 8" />
                                                    </svg>
                                                    {pageCount} หน้า
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-sm font-semibold text-gray-600 mb-1">อัปโหลดที่นี่</p>
                                            <p className="text-xs text-gray-400">PDF, PNG, JPG (max 50 MB)</p>
                                        </>
                                    )}
                                    <input
                                        id="file-upload" type="file" className="hidden"
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        onChange={handleInputChange}
                                    />
                                </label>

                                {/* Form rows */}
                                <FormRow label="ประเภทเอกสาร" value={documentType} onChange={setDocumentType}
                                    placeholder="เลือกประเภทเอกสาร" options={[
                                        { value: "bw", label: "ถ่ายเอกสารขาวดำ" },
                                        { value: "color", label: "ถ่ายเอกสารสี" },
                                        { value: "photo", label: "รูปภาพ" },
                                        { value: "poster", label: "โปสเตอร์" },
                                        { value: "card", label: "นามบัตร" },
                                    ]} />

                                <FormRow label="รายละเอียดเอกสาร" value={documentDetail} onChange={setDocumentDetail}
                                    placeholder="รายละเอียดเอกสาร" options={[
                                        { value: "single", label: "หน้าเดียว" },
                                        { value: "double", label: "หน้าหลัง (สองด้าน)" },
                                    ]} />

                                <FormRow label="ขนาด" value={documentSize} onChange={setDocumentSize}
                                    placeholder="เลือกขนาดเอกสาร" options={[
                                        { value: "A4", label: "A4" },
                                        { value: "A3", label: "A3" },
                                        { value: "A5", label: "A5" },
                                    ]} />

                                {/* Quantity */}
                                <div className="flex items-center gap-4 group">
                                    <label className="w-36 text-sm font-medium text-gray-400 shrink-0 group-hover:text-[#06B6D4] transition-colors duration-200">
                                        จำนวน(ชุด)
                                    </label>
                                    <div className="flex-1 flex items-center gap-2">
                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-9 h-9 rounded-xl border border-[#D9D9D9] text-gray-400 hover:border-[#06B6D4] hover:text-[#06B6D4] hover:bg-[#E0F3F7] active:scale-90 transition-all duration-150 flex items-center justify-center font-bold text-lg">−</button>
                                        <input type="number" min={1} value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                            className="flex-1 border border-[#D9D9D9] rounded-xl px-4 py-2.5 text-sm text-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] transition-all duration-200 font-semibold" />
                                        <button onClick={() => setQuantity(q => q + 1)}
                                            className="w-9 h-9 rounded-xl border border-[#D9D9D9] text-gray-400 hover:border-[#06B6D4] hover:text-white hover:bg-[#06B6D4] active:scale-90 transition-all duration-150 flex items-center justify-center font-bold text-lg">+</button>
                                    </div>
                                </div>

                                <FormRow label="ตัวเลือกเพิ่มเติม" value={extraOption} onChange={setExtraOption}
                                    placeholder="เลือกตัวเลือกเพิ่มเติม" options={[
                                        { value: "staple_corner", label: "เย็บมุมซ้ายบน" },
                                        { value: "spiral", label: "เข้าเล่มสันห่วง" },
                                        { value: "glue", label: "เข้าเล่มสันกาว" },
                                        { value: "none", label: "ไม่มีเพิ่มเติม" },
                                    ]} />

                                {/* Total price */}
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#E0F3F7] to-[#F0FAFB] rounded-2xl border border-[#06B6D4]/20">
                                    <span className="w-36 text-sm font-semibold text-gray-600">ราคารวม</span>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white text-[#06B6D4] font-bold text-2xl rounded-xl px-6 py-2 min-w-[110px] text-center tracking-wide shadow-sm border border-[#06B6D4]/20">
                                            {totalPrice}
                                        </div>
                                        <span className="text-sm text-gray-400 font-medium">บาท</span>
                                    </div>
                                </div>

                                {/* Missing fields hint */}
                                {!isFormComplete && missingFields.length > 0 && (
                                    <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                        <p className="text-xs text-amber-700">
                                            กรุณากรอกข้อมูลให้ครบก่อน: <span className="font-semibold">{missingFields.join(", ")}</span>
                                        </p>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex items-center justify-center gap-6 mt-4 pl-16">
                                    <button onClick={() => window.history.back()}
                                        className="px-8 py-2 text-sm bg-white text-gray-500 font-medium rounded-full border border-[#D9D9D9] hover:bg-[#E0F3F7] hover:text-[#06B6D4] hover:border-[#06B6D4] active:scale-95 transition-all duration-200 shadow-sm">
                                        ย้อนกลับ
                                    </button>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!isFormComplete}
                                        title={!isFormComplete ? `กรุณากรอก: ${missingFields.join(", ")}` : ""}
                                        className={`px-8 py-2 text-sm font-semibold rounded-full active:scale-95 transition-all duration-200 shadow-md flex items-center gap-2 ${isFormComplete
                                            ? "bg-gradient-to-r from-[#06B6D4] to-[#0891b2] text-white hover:shadow-[#06B6D4]/40 hover:shadow-xl cursor-pointer"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                                            }`}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                        </svg>
                                        เพิ่มลงตะกร้า
                                    </button>
                                </div>
                            </div>

                            {/* ── Right column: Preview ── */}
                            <div className="w-56 flex flex-col">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm text-gray-600 font-semibold">แสดงตัวอย่าง</p>
                                    {pageCount > 0 && (
                                        <span className="text-xs text-[#06B6D4] font-semibold bg-[#E0F3F7] px-2 py-0.5 rounded-full">
                                            {pageCount} หน้า
                                        </span>
                                    )}
                                </div>

                                {/* Preview box */}
                                <div className="flex-1 border-2 border-[#06B6D4]/40 rounded-2xl overflow-hidden flex items-center justify-center bg-[#F8FAFC] min-h-[320px] hover:border-[#06B6D4] transition-colors duration-300">
                                    {isPdf && iframeSrc ? (
                                        <iframe
                                            key={`pdf-p${currentPage}`}
                                            src={iframeSrc}
                                            className="w-full h-full border-0 min-h-[316px]"
                                            title={`PDF หน้า ${currentPage}`}
                                        />
                                    ) : isImage && fileUrl ? (
                                        <img src={fileUrl} alt="ตัวอย่าง" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <div className="w-full h-full p-3 flex items-center justify-center">
                                            <div className="w-full h-full bg-[#EBEBEB] rounded-xl flex flex-col items-center justify-center gap-2">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                                                    stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <polyline points="21 15 16 10 5 21" />
                                                </svg>
                                                <span className="text-xs text-gray-400">ตัวอย่าง</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Page navigation */}
                                {isPdf && pageCount > 1 && (
                                    <>
                                        <div className="mt-3 flex items-center justify-between">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="w-8 h-8 rounded-lg border border-[#D9D9D9] flex items-center justify-center text-gray-400 hover:border-[#06B6D4] hover:text-[#06B6D4] hover:bg-[#E0F3F7] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="15 18 9 12 15 6" />
                                                </svg>
                                            </button>
                                            <span className="text-xs text-gray-500 font-medium">
                                                หน้า <span className="text-[#06B6D4] font-bold">{currentPage}</span> / {pageCount}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                                                disabled={currentPage === pageCount}
                                                className="w-8 h-8 rounded-lg border border-[#D9D9D9] flex items-center justify-center text-gray-400 hover:border-[#06B6D4] hover:text-[#06B6D4] hover:bg-[#E0F3F7] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Page dots — max 10 pages */}
                                        {pageCount <= 10 && (
                                            <div className="mt-2 flex justify-center gap-1 flex-wrap">
                                                {Array.from({ length: pageCount }, (_, i) => i + 1).map(p => (
                                                    <button key={p} onClick={() => setCurrentPage(p)}
                                                        className={`w-5 h-5 rounded-md text-[9px] font-bold transition-all ${currentPage === p
                                                            ? "bg-[#06B6D4] text-white shadow-sm"
                                                            : "bg-[#E0F3F7] text-[#06B6D4] hover:bg-[#06B6D4]/20"
                                                            }`}>
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* ── Success Toast ── */}
            <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                <div className="flex items-center gap-3 bg-white border border-green-200 shadow-xl rounded-2xl px-5 py-3.5">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700">เพิ่มลงตะกร้าแล้ว!</p>
                        <p className="text-xs text-gray-400 mt-0.5">สามารถดูรายการได้ที่ตะกร้าสินค้า</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
