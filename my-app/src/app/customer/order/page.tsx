"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────
// FormRow component
// ─────────────────────────────────────────────────────────────
function FormRow({
    label, value, onChange, options, placeholder,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string; price?: number }[];
    placeholder: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!options || options.length === 0) return null;

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className={`flex flex-col md:flex-row md:items-center gap-2 md:gap-4 group relative ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
            <label className="w-40 text-sm font-semibold text-gray-600 shrink-0 group-hover:text-[#06B6D4] transition-colors duration-200">
                {label}
            </label>
            <div className="flex-1 relative w-full">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between bg-white border text-sm rounded-xl px-4 py-3 shadow-sm transition-all duration-200
                        ${isOpen ? 'border-[#06B6D4] ring-2 ring-[#06B6D4]/20' : 'border-gray-200 hover:border-[#06B6D4] hover:shadow-md'}`}
                >
                    <div className="flex items-center gap-3">
                        <span className={selectedOption ? "text-gray-800 font-bold" : "text-gray-400 font-medium"}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                        {selectedOption && selectedOption.price !== undefined && selectedOption.price > 0 && (
                            <span className="text-[11px] font-bold text-[#06B6D4] bg-[#E0F3F7] px-2 py-0.5 rounded-md hidden md:inline-block">
                                +{selectedOption.price} ฿
                            </span>
                        )}
                    </div>
                    <span className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2.5 text-sm flex items-center justify-between rounded-lg hover:bg-[#F0FAFB] transition-colors
                                    ${value === opt.value ? 'bg-[#F0FAFB] text-[#06B6D4] font-bold' : 'text-gray-700 font-medium'}`}
                                >
                                    <span>{opt.label}</span>
                                    {opt.price !== undefined ? (
                                        opt.price > 0 ? (
                                            <span className="text-xs font-bold text-[#06B6D4] bg-white border border-[#E0F3F7] shadow-sm px-2 py-1 rounded-md">
                                                +{opt.price} ฿
                                            </span>
                                        ) : (
                                            <span className="text-[11px] font-medium text-gray-400">
                                                (ฟรี)
                                            </span>
                                        )
                                    ) : null}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────
export default function OrderPage() {
    const { addToCart } = useCart();

    const [services, setServices] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);

    // Dynamic options state based on DB schema
    const [documentColor, setDocumentColor] = useState("");
    const [documentSide, setDocumentSide] = useState("");
    const [documentSize, setDocumentSize] = useState("");
    const [documentThickness, setDocumentThickness] = useState("");
    const [extraOption, setExtraOption] = useState("");
    const [quantity, setQuantity] = useState(1);

    // PDF page state
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingCount, setIsLoadingCount] = useState(false);

    // Toast state
    const [showToast, setShowToast] = useState(false);

    // Fetch services on mount
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .eq('status', 'ใช้งาน')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                if (data) setServices(data);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };
        fetchServices();
    }, []);

    const selectedService = services.find(s => s.category === selectedCategory);

    // Form logic handling and price mapping
    const findPrice = (list: any[], name: string) => {
        const option = list?.find((o: any) => o.name === name);
        return Number(option?.price) || 0;
    };

    let unitPrice = Number(selectedService?.base_price) || 0;
    if (selectedService) {
        unitPrice += findPrice(selectedService.options?.colors, documentColor);
        unitPrice += findPrice(selectedService.options?.sides, documentSide);
        unitPrice += findPrice(selectedService.options?.sizes, documentSize);
        unitPrice += findPrice(selectedService.options?.thickness, documentThickness);
    }

    const extraPrice = selectedService ? findPrice(selectedService.options?.special, extraOption) : 0;

    // Some units calculate by page, others just by piece
    const baseAmount = selectedService?.unit === 'ต่อหน้า' && pageCount > 0 ? pageCount * quantity : quantity;
    const totalPriceNum = selectedFile ? (unitPrice * baseAmount) + (extraPrice * quantity) : 0;
    const totalPrice = isNaN(totalPriceNum) ? "0.00" : totalPriceNum.toFixed(2);

    // Options for dropdowns
    const serviceOptions = services.map(s => ({ value: s.id, label: `${s.category} (เริ่มต้น ${s.base_price || 0}฿)` }));

    const mapToDropdown = (list: any[] = []) => list.map((opt: any) => {
        const p = Number(opt.price) || 0;
        return {
            value: opt.name,
            label: opt.name,
            price: p
        };
    });

    const colorOptionsItems = mapToDropdown(selectedService?.options?.colors);
    const sideOptionsItems = mapToDropdown(selectedService?.options?.sides);
    const sizeOptionsItems = mapToDropdown(selectedService?.options?.sizes);
    const thicknessOptionsItems = mapToDropdown(selectedService?.options?.thickness);

    const specialOptionsItems = [
        ...mapToDropdown(selectedService?.options?.special),
        { value: "none", label: "ไม่มีเพิ่มเติม", price: 0 }
    ];

    // Check validity
    const isColorValid = !selectedService?.options?.colors?.length || documentColor !== "";
    const isSideValid = !selectedService?.options?.sides?.length || documentSide !== "";
    const isSizeValid = !selectedService?.options?.sizes?.length || documentSize !== "";
    const isThicknessValid = !selectedService?.options?.thickness?.length || documentThickness !== "";
    const isSpecialValid = !selectedService?.options?.special?.length || extraOption !== "";

    const isFormComplete = Boolean(
        selectedFile &&
        selectedCategory &&
        isColorValid &&
        isSideValid &&
        isSizeValid &&
        isThicknessValid &&
        isSpecialValid
    );

    const missingFields = [
        !selectedFile && "อัปโหลดไฟล์",
        !selectedCategory && "ประเภทสินค้า",
        selectedCategory && !isColorValid && "สี/ขาวดำ",
        selectedCategory && !isSideValid && "หน้าเดียว/หน้าหลัง",
        selectedCategory && !isSizeValid && "ขนาดเอกสาร",
        selectedCategory && !isThicknessValid && "ความหนารวมถึงพื้นผิว",
        selectedCategory && !isSpecialValid && "ตัวเลือกเพิ่มเติม",
    ].filter(Boolean) as string[];

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        // Reset dependent options
        setDocumentColor("");
        setDocumentSide("");
        setDocumentSize("");
        setDocumentThickness("");
        setExtraOption("");
        setQuantity(1);
    };

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
        if (!isFormComplete || !selectedFile || !selectedService) return;

        const detailParts = [documentColor, documentSide, documentThickness].filter(Boolean);

        addToCart({
            id: `${Date.now()}-${Math.random()}`,
            fileName: selectedFile.name,
            fileUrl: fileUrl ?? undefined,   // keep URL alive for checkout preview
            documentType: selectedService.name,
            documentDetail: detailParts.length > 0 ? detailParts.join(", ") : "-",
            documentSize: documentSize || "-",
            quantity,
            extraOption: extraOption === "none" || !extraOption ? "ไม่มีเพิ่มเติม" : extraOption,
            pageCount,
            totalPrice: totalPriceNum,
        });

        // รีเซ็ตฟอร์ม (ไม่ revoke fileUrl เพราะ checkout ยังต้องใช้)
        setSelectedFile(null);
        setFileUrl(null);
        setSelectedCategory("");
        setDocumentColor("");
        setDocumentSide("");
        setDocumentSize("");
        setDocumentThickness("");
        setExtraOption("");
        setQuantity(1);
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
        <div className="bg-[#F8FAFC] py-8 px-8 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-[#E0F3F7] overflow-hidden">
                    {/* top bar */}
                    <div className="h-1.5 bg-gradient-to-r from-[#06B6D4] via-[#67e8f9] to-[#06B6D4]" />

                    <div className="p-8">
                        <h1 className="text-lg font-semibold text-gray-700 mb-7">เริ่มสั่งพิมพ์</h1>

                        <div className="flex flex-col lg:flex-row gap-8">
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

                                {/* Category Selection */}
                                <FormRow
                                    label="ประเภทสินค้า"
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    placeholder="เลือกประเภทสินค้า"
                                    options={Array.from(new Set(services.map(s => s.category))).map(c => ({ value: c as string, label: c as string }))}
                                />

                                {/* Dynamic Sub-options */}
                                {selectedCategory && (
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <FormRow label="สี / ขาวดำ" value={documentColor} onChange={setDocumentColor}
                                            placeholder="เลือกประเภทสี" options={colorOptionsItems} />

                                        <FormRow label="หน้าเดียว/สองหน้า" value={documentSide} onChange={setDocumentSide}
                                            placeholder="เลือกรายละเอียดหน้า" options={sideOptionsItems} />

                                        <FormRow label="ประเภทกระดาษ" value={documentThickness} onChange={setDocumentThickness}
                                            placeholder="เลือกประเภทกระดาษ" options={thicknessOptionsItems} />

                                        <FormRow label="ขนาดเอกสาร" value={documentSize} onChange={setDocumentSize}
                                            placeholder="เลือกขนาดเอกสาร" options={sizeOptionsItems} />

                                        <FormRow label="ตัวเลือกเพิ่มเติม" value={extraOption} onChange={setExtraOption}
                                            placeholder="เลือกออปชันเสริม" options={specialOptionsItems} />
                                    </div>
                                )}

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
                                            onFocus={(e) => e.target.value === '0' && e.target.select()}
                                            className="flex-1 border border-[#D9D9D9] rounded-xl px-4 py-2.5 text-sm text-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] transition-all duration-200 font-semibold" />
                                        <button onClick={() => setQuantity(q => q + 1)}
                                            className="w-9 h-9 rounded-xl border border-[#D9D9D9] text-gray-400 hover:border-[#06B6D4] hover:text-white hover:bg-[#06B6D4] active:scale-90 transition-all duration-150 flex items-center justify-center font-bold text-lg">+</button>
                                    </div>
                                </div>

                                {/* Total price */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gradient-to-br from-[#E0F3F7] to-[#F0FAFB] rounded-2xl border border-[#06B6D4]/30 shadow-sm">
                                    <div className="space-y-1">
                                        <span className="block text-sm font-bold text-gray-600">ยอดรวมทั้งหมด</span>
                                        {selectedService?.unit === 'ต่อหน้า' && (
                                            <span className="block text-xs text-[#06B6D4] font-medium">* คิดราคาตามจำนวนหน้าเอกสาร</span>
                                        )}
                                    </div>
                                    <div className="flex items-end md:items-center gap-3 self-end md:self-auto">
                                        <div className="bg-white text-[#06B6D4] font-bold text-3xl rounded-xl px-6 py-3 min-w-[130px] text-center tracking-wide shadow-sm border border-[#06B6D4]/20">
                                            {totalPrice}
                                        </div>
                                        <span className="text-sm text-gray-400 font-bold mb-1">บาท</span>
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
                                <div className="flex items-center justify-end gap-4 mt-2">
                                    <button onClick={() => window.history.back()}
                                        className="px-8 py-3 text-sm bg-white text-gray-500 font-bold rounded-xl border border-[#D9D9D9] hover:bg-[#E0F3F7] hover:text-[#06B6D4] hover:border-[#06B6D4] active:scale-95 transition-all duration-200">
                                        ย้อนกลับ
                                    </button>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!isFormComplete}
                                        title={!isFormComplete ? `กรุณากรอก: ${missingFields.join(", ")}` : ""}
                                        className={`px-8 py-3 text-sm font-bold rounded-xl active:scale-95 transition-all duration-200 shadow-md flex items-center gap-2 ${isFormComplete
                                            ? "bg-gradient-to-r from-[#06B6D4] to-[#0891b2] text-white hover:shadow-[#06B6D4]/40 hover:shadow-lg cursor-pointer"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                                            }`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                        </svg>
                                        เพิ่มลงตะกร้า
                                    </button>
                                </div>
                            </div>

                            {/* ── Right column: Preview ── */}
                            <div className="w-full lg:w-72 flex flex-col">
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
                                <div className="flex-1 border-2 border-[#06B6D4]/40 rounded-2xl overflow-hidden flex items-center justify-center bg-[#F8FAFC] min-h-[400px] lg:min-h-[500px] hover:border-[#06B6D4] transition-colors duration-300">
                                    {isPdf && iframeSrc ? (
                                        <iframe
                                            key={`pdf-p${currentPage}`}
                                            src={iframeSrc}
                                            className="w-full h-full border-0 min-h-[400px] lg:min-h-[500px]"
                                            title={`PDF หน้า ${currentPage}`}
                                        />
                                    ) : isImage && fileUrl ? (
                                        <img src={fileUrl} alt="ตัวอย่าง" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <div className="w-full h-full p-3 flex items-center justify-center">
                                            <div className="w-full h-full bg-[#EBEBEB] rounded-xl flex flex-col items-center justify-center gap-3">
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                                                    stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <polyline points="21 15 16 10 5 21" />
                                                </svg>
                                                <span className="text-xs text-gray-400 font-medium">ตัวอย่าง</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Page navigation */}
                                {isPdf && pageCount > 1 && (
                                    <>
                                        <div className="mt-4 flex items-center justify-between bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="w-9 h-9 rounded-lg border border-[#D9D9D9] flex items-center justify-center text-gray-400 hover:border-[#06B6D4] hover:text-[#06B6D4] hover:bg-[#E0F3F7] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="15 18 9 12 15 6" />
                                                </svg>
                                            </button>
                                            <span className="text-xs text-gray-500 font-bold tracking-wide">
                                                หน้า <span className="text-[#06B6D4] text-sm">{currentPage}</span> / {pageCount}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                                                disabled={currentPage === pageCount}
                                                className="w-9 h-9 rounded-lg border border-[#D9D9D9] flex items-center justify-center text-gray-400 hover:border-[#06B6D4] hover:text-[#06B6D4] hover:bg-[#E0F3F7] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Page dots — max 10 pages */}
                                        {pageCount <= 10 && (
                                            <div className="mt-3 flex justify-center gap-1.5 flex-wrap">
                                                {Array.from({ length: pageCount }, (_, i) => i + 1).map(p => (
                                                    <button key={p} onClick={() => setCurrentPage(p)}
                                                        className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all ${currentPage === p
                                                            ? "bg-[#06B6D4] text-white shadow-sm shadow-[#06B6D4]/30"
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
