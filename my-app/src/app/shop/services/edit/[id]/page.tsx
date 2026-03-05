"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { ChevronRight, Plus, Trash2, Calculator, Settings2, Check, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function EditServicePage() {
    const router = useRouter()
    const params = useParams()
    const serviceId = params.id as string

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [showToast, setShowToast] = useState(false)

    // ─── FORM STATES ───
    const [category, setCategory] = useState("เอกสาร")
    const [priceUnit, setPriceUnit] = useState("ต่อหน้า")
    const [basePrice, setBasePrice] = useState(2)
    const [minQuantity, setMinQuantity] = useState(1)

    // Dynamic Options Lists
    const [colorOptions, setColorOptions] = useState<{ name: string, price: number }[]>([])
    const [sideOptions, setSideOptions] = useState<{ name: string, price: number }[]>([])
    const [sizeOptions, setSizeOptions] = useState<{ name: string, price: number }[]>([])
    const [thicknessOptions, setThicknessOptions] = useState<{ name: string, price: number }[]>([])
    const [specialOptions, setSpecialOptions] = useState<{ name: string, price: number }[]>([])

    // File Settings
    const [fileTypes, setFileTypes] = useState<string[]>([])
    const [maxFileSize, setMaxFileSize] = useState(10)
    const [maxFiles, setMaxFiles] = useState(5)
    const [filePreview, setFilePreview] = useState(true)

    useEffect(() => {
        if (serviceId) {
            fetchServiceData()
        }
    }, [serviceId])

    const fetchServiceData = async () => {
        try {
            setFetching(true)
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('id', serviceId)
                .single()

            if (error) throw error

            if (data) {
                setCategory(data.category || "เอกสาร")
                setPriceUnit(data.unit || "ต่อหน้า")
                setBasePrice(data.base_price || 0)
                setMinQuantity(data.min_quantity || 1)

                if (data.options) {
                    setColorOptions(data.options.colors || [])
                    setSideOptions(data.options.sides || [])
                    setSizeOptions(data.options.sizes || [])
                    setThicknessOptions(data.options.thickness || [])
                    setSpecialOptions(data.options.special || [])
                }

                if (data.file_settings) {
                    setFileTypes(data.file_settings.allowed_types || [])
                    setMaxFileSize(data.file_settings.max_size_mb || 10)
                    setMaxFiles(data.file_settings.max_files || 5)
                    setFilePreview(data.file_settings.preview_enabled ?? true)
                }
            }
        } catch (error) {
            console.error("Error fetching service detail:", error)
            alert("ไม่สามารถดึงข้อมูลสินค้าได้")
        } finally {
            setFetching(false)
        }
    }

    // ─── HANDLERS FOR DYNAMIC LISTS ───
    const addItem = (setter: any) => {
        setter((prev: any) => [...prev, { name: "ใหม่", price: 0 }])
    }

    const removeItem = (setter: any, index: number) => {
        setter((prev: any) => prev.filter((_: any, i: number) => i !== index))
    }

    const updateItem = (setter: any, index: number, field: string, value: any) => {
        setter((prev: any) => prev.map((item: any, i: number) =>
            i === index ? { ...item, [field]: value } : item
        ))
    }

    const toggleFileType = (type: string) => {
        setFileTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        )
    }

    // ─── SUBMIT HANDLER ───
    const handleUpdateService = async () => {
        setLoading(true)
        try {
            const userJson = sessionStorage.getItem('user')
            const user = userJson ? JSON.parse(userJson) : null

            if (!user?.id) {
                alert("กรุณาเข้าสู่ระบบก่อนดำเนินการ")
                return
            }

            const { error } = await supabase
                .from('services')
                .update({
                    name: category,
                    category: category,
                    base_price: basePrice,
                    unit: priceUnit,
                    min_quantity: minQuantity,
                    options: {
                        colors: colorOptions,
                        sides: sideOptions,
                        sizes: sizeOptions,
                        thickness: thicknessOptions,
                        special: specialOptions
                    },
                    file_settings: {
                        allowed_types: fileTypes,
                        max_size_mb: maxFileSize,
                        max_files: maxFiles,
                        preview_enabled: filePreview
                    }
                })
                .eq('id', serviceId)

            if (error) throw error

            setShowToast(true)
            setTimeout(() => {
                router.push("/shop/services")
            }, 1500)
        } catch (error: any) {
            console.error("Error updating service:", error.message)
            alert("เกิดข้อผิดพลาด: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    // ─── SUMMARY CALCULATION (Mock) ───
    const [calcQty, setCalcQty] = useState(1)
    const [selectedExtras, setSelectedExtras] = useState<string[]>([])

    const toggleExtra = (name: string) => {
        setSelectedExtras(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        )
    }

    const extrasTotal = specialOptions
        .filter(opt => selectedExtras.includes(opt.name))
        .reduce((sum, opt) => sum + Number(opt.price), 0)

    const totalPrice = (basePrice * calcQty) + extrasTotal

    if (fetching) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-[#06B6D4]" size={40} />
                <p className="text-[#90a4ae] font-medium">กำลังโหลดข้อมูล...</p>
            </div>
        )
    }

    return (
        <div className="p-8 pb-32 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Header section */}
            <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-[#90a4ae] font-medium">
                    <Link href="/shop/services" className="hover:text-[#06B6D4] transition-colors">
                        บริการและราคา
                    </Link>
                    <ChevronRight size={16} />
                    <span className="text-[#455a64]">แก้ไขสินค้า</span>
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#455a64] tracking-tight mb-2">
                        แก้ไขสินค้า
                    </h1>
                    <p className="text-[#90a4ae] text-base">
                        ปรับปรุงข้อมูลและราคาสำหรับสินค้านี้
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Form Left Column */}
                <div className="flex-1 bg-[#E8F6F8] rounded-[32px] p-6 md:p-10 space-y-10 border border-[#eaf6f8] shadow-sm">

                    {/* 1. ข้อมูลสินค้า */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-[#455a64]">ข้อมูลสินค้า</h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-[#455a64] mb-2">
                                    ประเภทสินค้า <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-4">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="flex-1 rounded-2xl border-none p-4 text-[#455a64] bg-white shadow-sm focus:ring-2 focus:ring-[#06B6D4]/30 outline-none transition-all"
                                    >
                                        <option>เอกสาร</option>
                                        <option>โปสเตอร์</option>
                                        <option>รูปภาพ</option>
                                        <option>นามบัตร</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. รายละเอียดประเภทสินค้า */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-[#455a64]">รายละเอียดประเภทสินค้า</h2>

                        {/* สี / ขาวดำ block */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaf6f8] space-y-4">
                            <div className="flex items-center justify-between border-b border-[#eaf6f8] pb-4">
                                <h3 className="font-bold text-[#455a64]">สี / ขาวดำ</h3>
                                <button
                                    onClick={() => addItem(setColorOptions)}
                                    className="flex items-center gap-1 text-sm font-medium text-[#06B6D4] hover:text-[#0891b2] transition-colors rounded-full px-3 py-1 hover:bg-[#E0F7FA]"
                                >
                                    <Plus size={16} />
                                    <span>เพิ่ม</span>
                                </button>
                            </div>
                            <div className="space-y-3 pt-2">
                                {colorOptions.map((opt, idx) => (
                                    <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#eaf6f8]">
                                        <input
                                            type="text"
                                            value={opt.name}
                                            onChange={(e) => updateItem(setColorOptions, idx, 'name', e.target.value)}
                                            className="font-medium text-[#455a64] flex-1 bg-transparent border-none focus:ring-0 outline-none"
                                        />
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                value={opt.price}
                                                onChange={(e) => updateItem(setColorOptions, idx, 'price', e.target.value)}
                                                onFocus={(e) => e.target.value === '0' && e.target.select()}
                                                className="w-24 text-right rounded-xl border border-[#E0E0E0] p-2 text-[#455a64] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]"
                                            />
                                            <span className="text-[#90a4ae] text-sm">บาท</span>
                                            <button
                                                onClick={() => removeItem(setColorOptions, idx)}
                                                className="p-2 text-[#ff8a8a] hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* หน้าเดียว / สองหน้า block */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaf6f8] space-y-4">
                            <div className="flex items-center justify-between border-b border-[#eaf6f8] pb-4">
                                <h3 className="font-bold text-[#455a64]">หน้าเดียว / สองหน้า</h3>
                                <button
                                    onClick={() => addItem(setSideOptions)}
                                    className="flex items-center gap-1 text-sm font-medium text-[#06B6D4] hover:text-[#0891b2] transition-colors rounded-full px-3 py-1 hover:bg-[#E0F7FA]"
                                >
                                    <Plus size={16} />
                                    <span>เพิ่ม</span>
                                </button>
                            </div>
                            <div className="space-y-3 pt-2">
                                {sideOptions.map((opt, idx) => (
                                    <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#eaf6f8]">
                                        <input
                                            type="text"
                                            value={opt.name}
                                            onChange={(e) => updateItem(setSideOptions, idx, 'name', e.target.value)}
                                            className="font-medium text-[#455a64] flex-1 bg-transparent border-none focus:ring-0 outline-none"
                                        />
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                value={opt.price}
                                                onChange={(e) => updateItem(setSideOptions, idx, 'price', e.target.value)}
                                                onFocus={(e) => e.target.value === '0' && e.target.select()}
                                                className="w-24 text-right rounded-xl border border-[#E0E0E0] p-2 text-[#455a64] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]"
                                            />
                                            <span className="text-[#90a4ae] text-sm">บาท</span>
                                            <button
                                                onClick={() => removeItem(setSideOptions, idx)}
                                                className="p-2 text-[#ff8a8a] hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ขนาดเอกสาร block */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaf6f8] space-y-4">
                            <div className="flex items-center justify-between border-b border-[#eaf6f8] pb-4">
                                <h3 className="font-bold text-[#455a64]">ขนาดเอกสาร</h3>
                                <button
                                    onClick={() => addItem(setSizeOptions)}
                                    className="flex items-center gap-1 text-sm font-medium text-[#06B6D4] hover:text-[#0891b2] transition-colors rounded-full px-3 py-1 hover:bg-[#E0F7FA]"
                                >
                                    <Plus size={16} />
                                    <span>เพิ่ม</span>
                                </button>
                            </div>
                            <div className="space-y-3 pt-2">
                                {sizeOptions.map((opt, idx) => (
                                    <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#eaf6f8]">
                                        <input
                                            type="text"
                                            value={opt.name}
                                            onChange={(e) => updateItem(setSizeOptions, idx, 'name', e.target.value)}
                                            className="font-medium text-[#455a64] flex-1 bg-transparent border-none focus:ring-0 outline-none"
                                        />
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                value={opt.price}
                                                onChange={(e) => updateItem(setSizeOptions, idx, 'price', e.target.value)}
                                                onFocus={(e) => e.target.value === '0' && e.target.select()}
                                                className="w-24 text-right rounded-xl border border-[#E0E0E0] p-2 text-[#455a64] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]"
                                            />
                                            <span className="text-[#90a4ae] text-sm">บาท</span>
                                            <button
                                                onClick={() => removeItem(setSizeOptions, idx)}
                                                className="p-2 text-[#ff8a8a] hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ประเภทกระดาษ block */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaf6f8] space-y-4">
                            <div className="flex items-center justify-between border-b border-[#eaf6f8] pb-4">
                                <h3 className="font-bold text-[#455a64]">ประเภทกระดาษ</h3>
                                <button
                                    onClick={() => addItem(setThicknessOptions)}
                                    className="flex items-center gap-1 text-sm font-medium text-[#06B6D4] hover:text-[#0891b2] transition-colors rounded-full px-3 py-1 hover:bg-[#E0F7FA]"
                                >
                                    <Plus size={16} />
                                    <span>เพิ่ม</span>
                                </button>
                            </div>
                            <div className="space-y-3 pt-2">
                                {thicknessOptions.map((opt, idx) => (
                                    <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#eaf6f8]">
                                        <input
                                            type="text"
                                            value={opt.name}
                                            onChange={(e) => updateItem(setThicknessOptions, idx, 'name', e.target.value)}
                                            className="font-medium text-[#455a64] flex-1 bg-transparent border-none focus:ring-0 outline-none"
                                        />
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                value={opt.price}
                                                onChange={(e) => updateItem(setThicknessOptions, idx, 'price', e.target.value)}
                                                onFocus={(e) => e.target.value === '0' && e.target.select()}
                                                className="w-24 text-right rounded-xl border border-[#E0E0E0] p-2 text-[#455a64] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]"
                                            />
                                            <span className="text-[#90a4ae] text-sm">บาท</span>
                                            <button
                                                onClick={() => removeItem(setThicknessOptions, idx)}
                                                className="p-2 text-[#ff8a8a] hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. Option พิเศษ */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-[#455a64]">Option พิเศษ</h2>
                        <p className="text-sm text-[#90a4ae]">ราคา Option พิเศษจะคิดต่อรอบและไม่มีผลคูณต่อหน่วย</p>

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaf6f8] space-y-4">
                            <div className="flex items-center justify-between border-b border-[#eaf6f8] pb-4">
                                <h3 className="font-bold text-[#fbc02d]">3. Option พิเศษ</h3>
                                <button
                                    onClick={() => addItem(setSpecialOptions)}
                                    className="flex items-center gap-1 text-sm font-medium text-[#fbc02d] hover:text-[#f9a825] transition-colors rounded-full px-3 py-1 hover:bg-yellow-50"
                                >
                                    <Plus size={16} />
                                    <span>เพิ่ม Option</span>
                                </button>
                            </div>
                            <div className="space-y-3 pt-2">
                                {specialOptions.map((opt, idx) => (
                                    <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#eaf6f8]">
                                        <input
                                            type="text"
                                            value={opt.name}
                                            onChange={(e) => updateItem(setSpecialOptions, idx, 'name', e.target.value)}
                                            className="font-medium text-[#455a64] flex-1 bg-transparent border-none focus:ring-0 outline-none"
                                        />
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                value={opt.price}
                                                onChange={(e) => updateItem(setSpecialOptions, idx, 'price', e.target.value)}
                                                className="w-24 text-right rounded-xl border border-[#E0E0E0] p-2 text-[#455a64] focus:outline-none focus:border-[#fbc02d] focus:ring-1 focus:ring-[#fbc02d]"
                                            />
                                            <span className="text-[#90a4ae] text-sm">บาท</span>
                                            <button
                                                onClick={() => removeItem(setSpecialOptions, idx)}
                                                className="p-2 text-[#ff8a8a] hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 4. การตั้งราคา */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-[#455a64]">การตั้งราคา</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border border-[#eaf6f8] shadow-sm">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#455a64]">
                                    หน่วยราคา <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={priceUnit}
                                    onChange={(e) => setPriceUnit(e.target.value)}
                                    className="w-full rounded-2xl border border-[#E0E0E0] p-4 text-[#455a64] bg-[#FAFAFA] focus:ring-2 focus:ring-[#06B6D4]/30 outline-none transition-all"
                                >
                                    <option>ต่อหน้า</option>
                                    <option>ต่อแผ่น</option>
                                    <option>ต่อชิ้น</option>
                                    <option>ต่อตารางเมตร</option>
                                    <option>ราคาเหมา</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#455a64]">
                                    ราคาพื้นฐาน (บาท) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={basePrice}
                                    onChange={(e) => setBasePrice(Number(e.target.value))}
                                    className="w-full rounded-2xl border border-[#E0E0E0] p-4 text-[#455a64] bg-[#FAFAFA] focus:ring-2 focus:ring-[#06B6D4]/30 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2 md:col-start-2">
                                <label className="block text-sm font-bold text-[#455a64]">
                                    จำนวนขั้นต่ำ
                                </label>
                                <input
                                    type="number"
                                    value={minQuantity}
                                    onChange={(e) => setMinQuantity(Number(e.target.value))}
                                    className="w-full rounded-2xl border border-[#E0E0E0] p-4 text-[#455a64] bg-[#FAFAFA] focus:ring-2 focus:ring-[#06B6D4]/30 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 5. การตั้งค่าไฟล์ */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaf6f8] space-y-6">
                        <div className="border-b border-[#eaf6f8] pb-4">
                            <h2 className="text-xl font-bold text-[#e91e63]">5. การตั้งค่าไฟล์</h2>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-[#455a64]">
                                ประเภทไฟล์ที่รองรับ
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {['PDF', 'DOCX', 'JPG', 'PNG', 'AI', 'PSD'].map((type, i) => (
                                    <button
                                        key={type}
                                        onClick={() => toggleFileType(type)}
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${fileTypes.includes(type)
                                            ? "bg-[#e91e63] text-white shadow-md shadow-[#e91e63]/20"
                                            : "bg-[#F8FAFC] text-[#90a4ae] hover:bg-[#E0E0E0]"
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#455a64]">
                                    ขนาดไฟล์สูงสุด (MB)
                                </label>
                                <input
                                    type="number"
                                    value={maxFileSize}
                                    onChange={(e) => setMaxFileSize(Number(e.target.value))}
                                    className="w-full rounded-2xl border border-[#E0E0E0] p-3 text-[#455a64] bg-[#FAFAFA] focus:ring-2 focus:ring-[#e91e63]/30 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#455a64]">
                                    จำนวนไฟล์สูงสุด
                                </label>
                                <input
                                    type="number"
                                    value={maxFiles}
                                    onChange={(e) => setMaxFiles(Number(e.target.value))}
                                    className="w-full rounded-2xl border border-[#E0E0E0] p-3 text-[#455a64] bg-[#FAFAFA] focus:ring-2 focus:ring-[#e91e63]/30 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#fce4ec] rounded-2xl border border-[#f8bbd0]/50">
                            <div>
                                <p className="font-bold text-[#e91e63]">แสดงตัวอย่างก่อนพิมพ์</p>
                                <p className="text-xs text-[#e91e63]/70 mt-1">ให้ลูกค้าสามารถดูตัวอย่างไฟล์ได้</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={filePreview}
                                    onChange={(e) => setFilePreview(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-white peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#e91e63] after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e91e63] peer-checked:after:bg-white shadow-sm ring-1 ring-inset ring-[#e91e63]/20"></div>
                            </label>
                        </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-6 flex justify-center gap-4">
                        <Link
                            href="/shop/services"
                            className="bg-white border text-gray-600 border-gray-200 hover:bg-gray-50 px-12 py-4 rounded-full font-bold text-lg shadow-sm transition-all flex items-center gap-2"
                        >
                            ยกเลิก
                        </Link>
                        <button
                            onClick={handleUpdateService}
                            disabled={loading}
                            className="bg-gradient-to-r from-[#06B6D4] to-[#0891b2] hover:from-[#0891b2] hover:to-[#0e7490] text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg shadow-[#06B6D4]/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                            {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                        </button>
                    </div>
                </div>

                {/* Right Column / Sticky Summary */}
                <div className="w-full lg:w-[350px] space-y-6">
                    <div className="sticky top-6">
                        {/* Summary Card */}
                        <div className="bg-gradient-to-b from-[#f8f6ff] to-white rounded-[32px] p-6 shadow-[-10px_20px_40px_rgba(139,92,246,0.06)] border border-[#eedeef] relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-50 z-0" />

                            <div className="relative z-10 flex items-center gap-3 mb-6 pb-4 border-b border-[#eedeef]">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                    <Calculator size={20} strokeWidth={2.5} />
                                </div>
                                <h3 className="font-bold text-[#455a64] text-lg">ตัวอย่างการคำนวณราคา</h3>
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-[#455a64]">จำนวน</label>
                                    <input
                                        type="number"
                                        value={calcQty}
                                        onChange={(e) => setCalcQty(Number(e.target.value))}
                                        className="w-full rounded-xl border border-[#eedeef] p-3 text-[#455a64] bg-white focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-bold text-[#455a64]">Option พิเศษ</label>
                                    <div className="space-y-2">
                                        {specialOptions.map((opt, i) => (
                                            <label
                                                key={i}
                                                className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#eedeef] cursor-pointer hover:border-purple-200 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={selectedExtras.includes(opt.name)}
                                                        onChange={() => toggleExtra(opt.name)}
                                                    />
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center border border-[#eedeef] transition-colors ${selectedExtras.includes(opt.name) ? "bg-purple-500 border-purple-500" : "bg-white"}`}>
                                                        {selectedExtras.includes(opt.name) && <Check size={12} className="text-white" />}
                                                    </div>
                                                    <span className="text-[#455a64] text-sm">{opt.name}</span>
                                                </div>
                                                <span className="text-green-500 text-sm font-bold">+{opt.price} บาท</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#eedeef]">
                                    <div>
                                        <span className="block font-bold text-[#455a64]">งานด่วน</span>
                                        <span className="text-[11px] text-[#90a4ae]">+50 บาท</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-[#E0E0E0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                                    </label>
                                </div>

                                <div className="pt-4 border-t border-dashed border-[#eedeef] space-y-3">
                                    <div className="flex justify-between text-[#78909c] text-sm">
                                        <span>ราคาต่อหน่วย</span>
                                        <span>{basePrice.toFixed(2)} บาท</span>
                                    </div>
                                    <div className="flex justify-between text-[#78909c] text-sm">
                                        <span>จำนวน</span>
                                        <span>x {calcQty}</span>
                                    </div>
                                    <div className="flex justify-between text-[#455a64] text-sm font-bold">
                                        <span>ยอดรวม</span>
                                        <span>{(basePrice * calcQty).toFixed(2)} บาท</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[#eedeef] flex justify-between items-end">
                                    <span className="font-bold text-[#455a64]">ราคาทั้งหมด</span>
                                    <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-[#7e57c2]">
                                        {totalPrice.toFixed(2)} ฿
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Settings Summary Small Card */}
                        <div className="mt-4 bg-white rounded-[24px] p-5 shadow-sm border border-[#eaf6f8] space-y-3 relative overflow-hidden">
                            <h4 className="font-bold text-[#06B6D4] text-sm flex items-center gap-2">
                                <Settings2 size={16} />
                                สรุปการตั้งค่า
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-[#78909c]">
                                    <span>Option ทั้งหมด</span>
                                    <span className="font-bold text-[#455a64] bg-gray-100 px-2 py-0.5 rounded-md">{specialOptions.length}</span>
                                </div>
                                <div className="flex justify-between text-xs text-[#78909c]">
                                    <span>ประเภทไฟล์รองรับ</span>
                                    <span className="font-bold text-[#455a64] bg-gray-100 px-2 py-0.5 rounded-md">{fileTypes.length}</span>
                                </div>
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
                        <p className="text-sm font-semibold text-gray-700">อัปเดตข้อมูลบริการเรียบร้อยแล้ว!</p>
                    </div>
                </div>
            </div>
        </div >
    )
}
