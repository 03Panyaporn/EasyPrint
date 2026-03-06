"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Plus, Edit2, Trash2, FileText, Settings, Loader2, X, Pencil, Check } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ServicesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("ทั้งหมด")
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Delete Modal / Toast State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)

    // Category Management State
    const [editingCategory, setEditingCategory] = useState<string | null>(null)
    const [editCategoryName, setEditCategoryName] = useState("")
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
    const [isCategoryDeleteModalOpen, setIsCategoryDeleteModalOpen] = useState(false)

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            if (data) {
                setServices(data)
            }
        } catch (error) {
            console.error("Error fetching services:", error)
        } finally {
            setLoading(false)
        }
    }

    // Filter Logic
    const filteredServices = services.filter(service => {
        const matchesSearch = service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.category?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesTab = activeTab === "ทั้งหมด" || service.category === activeTab
        return matchesSearch && matchesTab
    })

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
    }

    // ─── CATEGORY MANAGEMENT ───
    const defaultTabs = ["ทั้งหมด", "เอกสาร", "รูปภาพ", "โปสเตอร์", "นามบัตร"]

    const handleEditCategory = async (oldName: string) => {
        const newName = editCategoryName.trim()
        if (!newName || newName === oldName) {
            setEditingCategory(null)
            return
        }
        try {
            const { error } = await supabase
                .from('services')
                .update({ category: newName, name: newName })
                .eq('category', oldName)
            if (error) throw error
            setServices(prev => prev.map(s => s.category === oldName ? { ...s, category: newName, name: newName } : s))
            if (activeTab === oldName) setActiveTab(newName)
            setToastMessage(`เปลี่ยนชื่อประเภท "${oldName}" เป็น "${newName}" เรียบร้อย`)
            setShowToast(true)
            setTimeout(() => setShowToast(false), 3000)
        } catch (error: any) {
            console.error('Error renaming category:', error.message)
            alert('เกิดข้อผิดพลาด: ' + error.message)
        } finally {
            setEditingCategory(null)
        }
    }

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return
        setIsDeleting(true)
        try {
            // Delete all services in this category
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('category', categoryToDelete)
            if (error) throw error
            setServices(prev => prev.filter(s => s.category !== categoryToDelete))
            if (activeTab === categoryToDelete) setActiveTab('ทั้งหมด')
            setToastMessage(`ลบประเภท "${categoryToDelete}" และบริการทั้งหมดเรียบร้อย`)
            setShowToast(true)
            setTimeout(() => setShowToast(false), 3000)
        } catch (error: any) {
            console.error('Error deleting category:', error.message)
            alert('เกิดข้อผิดพลาด: ' + error.message)
        } finally {
            setIsDeleting(false)
            setIsCategoryDeleteModalOpen(false)
            setCategoryToDelete(null)
        }
    }

    const handleDeleteClick = (id: string) => {
        setServiceToDelete(id)
        setIsDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!serviceToDelete) return
        setIsDeleting(true)

        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', serviceToDelete)

            if (error) throw error

            // Update local state after successful delete
            setServices(prev => prev.filter(service => service.id !== serviceToDelete))
            setToastMessage('ลบสินค้าเรียบร้อยแล้ว!')
            setShowToast(true)
            setTimeout(() => {
                setShowToast(false)
            }, 3000)
        } catch (error: any) {
            console.error("Error deleting service:", error.message)
            alert("เกิดข้อผิดพลาดในการลบ: " + error.message)
        } finally {
            setIsDeleting(false)
            setIsDeleteModalOpen(false)
            setServiceToDelete(null)
        }
    }

    const cancelDelete = () => {
        setIsDeleteModalOpen(false)
        setServiceToDelete(null)
    }

    const handleToggleStatus = async (serviceId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ปิดใช้งาน' ? 'ใช้งาน' : 'ปิดใช้งาน'
        try {
            const { error } = await supabase
                .from('services')
                .update({ status: newStatus })
                .eq('id', serviceId)
            if (error) throw error
            setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: newStatus } : s))
        } catch (error: any) {
            console.error('Error toggling status:', error.message)
        }
    }

    const getCategoryIcon = (category: string) => {
        if (category === 'งานหลังพิมพ์') return Settings;
        return FileText;
    }

    return (
        <div className="p-8 pb-20 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#455a64] tracking-tight mb-2">
                        บริการและราคา
                    </h1>
                    <p className="text-[#90a4ae] text-base">
                        เพิ่มบริการและปรับราคาของสินค้า
                    </p>
                </div>

                <Link
                    href="/shop/services/add"
                    className="flex items-center gap-2 bg-[#7DD3E1] hover:bg-[#68C5D5] text-white px-4 py-2 mt-4 md:mt-2 rounded-xl font-medium transition-all shadow-sm hover:shadow transform hover:-translate-y-0.5 w-full md:w-auto justify-center text-sm"
                >
                    <Plus size={18} />
                    <span>เพิ่มสินค้าใหม่</span>
                </Link>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#eaf6f8] overflow-hidden flex flex-col min-h-[400px]">

                {/* Search and Tabs */}
                <div className="p-6 border-b border-[#eaf6f8] space-y-4">
                    <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">

                        {/* Search Bar */}
                        <div className="relative group w-full md:w-96">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-[#90a4ae] group-focus-within:text-[#06B6D4] transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="ค้นหาสินค้าหรือบริการ..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full bg-[#FAFAFA] border border-[#E0E0E0] rounded-2xl py-3 pl-12 pr-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4] transition-all placeholder:text-[#9EA3B0]"
                            />
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            {(() => {
                                const extraCategories = services
                                    .map(s => s.category)
                                    .filter((cat): cat is string => !!cat && !defaultTabs.includes(cat));
                                const uniqueExtras = [...new Set(extraCategories)];
                                const allTabs = [...defaultTabs, ...uniqueExtras];
                                return allTabs.map((tab) => {
                                    const isCustom = !defaultTabs.includes(tab);
                                    const isEditing = editingCategory === tab;

                                    if (isEditing) {
                                        return (
                                            <div key={tab} className="flex items-center gap-1 bg-white border-2 border-[#06B6D4] rounded-xl px-2 py-1 shadow-sm">
                                                <input
                                                    type="text"
                                                    value={editCategoryName}
                                                    onChange={(e) => setEditCategoryName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleEditCategory(tab);
                                                        if (e.key === 'Escape') setEditingCategory(null);
                                                    }}
                                                    className="w-24 text-sm text-[#455a64] bg-transparent border-none outline-none font-medium"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleEditCategory(tab)}
                                                    className="p-1 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                                                >
                                                    <Check size={14} strokeWidth={3} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingCategory(null)}
                                                    className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={tab} className="relative group/tab flex items-center">
                                            <button
                                                onClick={() => handleTabChange(tab)}
                                                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab
                                                    ? "text-[#455a64] bg-[#F8FAFC]"
                                                    : "text-[#90a4ae] hover:text-[#455a64] hover:bg-gray-50"
                                                    } ${isCustom ? 'pr-14' : ''}`}
                                            >
                                                {tab}
                                            </button>
                                            {isCustom && (
                                                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover/tab:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingCategory(tab);
                                                            setEditCategoryName(tab);
                                                        }}
                                                        className="p-1 text-[#90a4ae] hover:text-[#06B6D4] hover:bg-[#E0F7FA] rounded-md transition-all"
                                                        title="แก้ไขชื่อประเภท"
                                                    >
                                                        <Pencil size={12} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCategoryToDelete(tab);
                                                            setIsCategoryDeleteModalOpen(true);
                                                        }}
                                                        className="p-1 text-[#90a4ae] hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all"
                                                        title="ลบประเภท"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center p-12 space-y-4">
                            <Loader2 className="animate-spin text-[#06B6D4]" size={40} />
                            <p className="text-[#90a4ae] font-medium">กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#eaf6f8] bg-[#F8FAFC]">
                                    <th className="px-6 py-4 text-xs font-bold text-[#90a4ae] uppercase tracking-wider">ชื่อบริการ</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#90a4ae] uppercase tracking-wider text-center">หมวดหมู่</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#90a4ae] uppercase tracking-wider text-center">ราคาเริ่มต้น</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#90a4ae] uppercase tracking-wider text-center">หน่วย</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#90a4ae] uppercase tracking-wider text-center">สถานะ</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#90a4ae] uppercase tracking-wider text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#eaf6f8]">
                                {filteredServices.length > 0 ? (
                                    filteredServices.map((service) => {
                                        const Icon = getCategoryIcon(service.category);
                                        return (
                                            <tr key={service.id} className="hover:bg-[#F8FAFC] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-[#E0F7FA] flex items-center justify-center text-[#06B6D4]">
                                                            <Icon size={20} strokeWidth={2} />
                                                        </div>
                                                        <span className="font-bold text-[#455a64]">{service.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#64748b]">
                                                        {service.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {(() => {
                                                        const colors = service.options?.colors || [];
                                                        if (colors.length > 0) {
                                                            return (
                                                                <div className="flex flex-col gap-1.5 w-[140px] mx-auto opacity-90">
                                                                    {colors.map((c: any, idx: number) => {
                                                                        const price = Number(c.price) + Number(service.base_price || 0);
                                                                        return (
                                                                            <div key={idx} className="flex items-center justify-between text-[13px] bg-white border border-[#E0F7FA] px-3 py-1.5 rounded-lg shadow-sm">
                                                                                <span className="font-semibold text-[#455a64] flex items-center gap-1.5">
                                                                                    <div className={`w-2 h-2 rounded-full ${c.name === 'สี' ? 'bg-amber-400' : 'bg-gray-800'}`}></div>
                                                                                    {c.name}
                                                                                </span>
                                                                                <span className="font-bold text-[#06B6D4]">{price} ฿</span>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            );
                                                        }
                                                        return <span className="font-bold text-[#455a64]">{Number(service.base_price || 0).toFixed(2)} ฿</span>;
                                                    })()}
                                                </td>
                                                <td className="px-6 py-4 text-center text-[#90a4ae] text-sm">
                                                    {service.unit}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                checked={(service.status || 'ใช้งาน') !== 'ปิดใช้งาน'}
                                                                onChange={() => handleToggleStatus(service.id, service.status || 'ใช้งาน')}
                                                            />
                                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                                                        </label>
                                                        <span className={`text-xs font-medium ${(service.status || 'ใช้งาน') === 'ปิดใช้งาน' ? 'text-gray-400' : 'text-emerald-600'}`}>
                                                            {(service.status || 'ใช้งาน') === 'ปิดใช้งาน' ? 'ปิดใช้งาน' : 'ใช้งาน'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/shop/services/edit/${service.id}`} className="p-2 text-[#90a4ae] hover:text-[#06B6D4] hover:bg-[#E0F7FA] rounded-xl transition-colors block">
                                                            <Edit2 size={18} />
                                                        </Link>
                                                        <button onClick={() => handleDeleteClick(service.id)} className="p-2 text-[#ff8a8a] hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-[#90a4ae]">
                                            ไม่พบข้อมูลสินค้าที่คุณกำลังค้นหา
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Info Text */}
                <div className="p-6 border-t border-[#eaf6f8] flex flex-col md:flex-row items-center justify-between gap-4 mt-auto">
                    <span className="text-sm text-[#90a4ae]">
                        แสดง {filteredServices.length} รายการ
                    </span>
                </div>
            </div>

            {/* ── Delete Confirmation Modal ── */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-[#455a64]">ยืนยันการลบสินค้า?</h3>
                            <p className="text-sm text-[#90a4ae]">
                                การดำเนินการนี้ไม่สามารถย้อนกลับได้ คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้ออกจากระบบ?
                            </p>
                            <div className="flex w-full gap-3 mt-6">
                                <button
                                    onClick={cancelDelete}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all disabled:opacity-50"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all shadow-md shadow-red-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isDeleting ? <Loader2 size={18} className="animate-spin" /> : "ลบสินค้า"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Category Delete Confirmation Modal ── */}
            {isCategoryDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-2">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-[#455a64]">ลบประเภท "{categoryToDelete}"?</h3>
                            <p className="text-sm text-[#90a4ae]">
                                บริการทั้งหมดในประเภทนี้จะถูกลบออกไปด้วย คุณแน่ใจหรือไม่?
                            </p>
                            <div className="flex w-full gap-3 mt-6">
                                <button
                                    onClick={() => { setIsCategoryDeleteModalOpen(false); setCategoryToDelete(null); }}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all disabled:opacity-50"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleDeleteCategory}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all shadow-md shadow-red-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isDeleting ? <Loader2 size={18} className="animate-spin" /> : "ลบประเภท"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Success Toast ── */}
            <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                <div className="flex items-center gap-3 bg-white border border-green-200 shadow-xl rounded-2xl px-5 py-3.5">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700">{toastMessage || 'ดำเนินการเรียบร้อยแล้ว!'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
