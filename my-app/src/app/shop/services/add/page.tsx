"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ChevronRight, Plus, Trash2, Calculator, Settings2, Check } from "lucide-react"

export default function AddServicePage() {
    return (
        <div className="p-8 pb-32 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Header section */}
            <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-[#90a4ae] font-medium">
                    <Link href="/shop/services" className="hover:text-[#06B6D4] transition-colors">
                        บริการและราคา
                    </Link>
                    <ChevronRight size={16} />
                    <span className="text-[#455a64]">เพิ่มสินค้าใหม่</span>
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#455a64] tracking-tight mb-2">
                        เพิ่มสินค้าใหม่
                    </h1>
                    <p className="text-[#90a4ae] text-base">
                        กำหนดบริการใหม่และราคา
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
                                    <select className="flex-1 rounded-2xl border-none p-4 text-[#455a64] bg-white shadow-sm focus:ring-2 focus:ring-[#06B6D4]/30 outline-none transition-all">
                                        <option>เอกสาร</option>
                                        <option>โปสเตอร์</option>
                                        <option>รูปภาพ</option>
                                        <option>นามบัตร</option>
                                    </select>
                                    <button className="flex items-center gap-2 bg-white text-[#455a64] px-6 py-4 rounded-2xl font-medium shadow-sm hover:text-[#06B6D4] hover:shadow-md transition-all">
                                        <Plus size={18} />
                                        <span>เพิ่ม</span>
                                    </button>
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
                                <button className="flex items-center gap-1 text-sm font-medium text-[#06B6D4] hover:text-[#0891b2] transition-colors rounded-full px-3 py-1 hover:bg-[#E0F7FA]">
                                    <Plus size={16} />
                                    <span>เพิ่ม</span>
                                </button>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#eaf6f8]">
                                    <span className="font-medium text-[#455a64] flex-1">ขาวดำ</span>
                                    <div className="flex items-center gap-3">
                                        <input type="number" defaultValue={0} className="w-24 text-right rounded-xl border border-[#E0E0E0] p-2 text-[#455a64] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]" />
                                        <span className="text-[#90a4ae] text-sm">บาท</span>
                                        <button className="p-2 text-[#ff8a8a] hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#eaf6f8]">
                                    <span className="font-medium text-[#455a64] flex-1">สี</span>
                                    <div className="flex items-center gap-3">
                                        <input type="number" defaultValue={3} className="w-24 text-right rounded-xl border border-[#E0E0E0] p-2 text-[#455a64] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]" />
                                        <span className="text-[#90a4ae] text-sm">บาท</span>
                                        <button className="p-2 text-[#ff8a8a] hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* หน้าเดียว / สองหน้า block */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaf6f8] space-y-4">
                            <div className="flex items-center justify-between border-b border-[#eaf6f8] pb-4">
                                <h3 className="font-bold text-[#455a64]">หน้าเดียว / สองหน้า</h3>
                                <button className="flex items-center gap-1 text-sm font-medium text-[#06B6D4] hover:text-[#0891b2] transition-colors rounded-full px-3 py-1 hover:bg-[#E0F7FA]">
                                    <Plus size={16} />
                                    <span>เพิ่ม</span>
                                </button>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#eaf6f8]">
                                    <span className="font-medium text-[#455a64] flex-1">หน้าเดียว</span>
                                    <div className="flex items-center gap-3">
                                        <input type="number" defaultValue={2} className="w-24 text-right rounded-xl border border-[#E0E0E0] p-2 text-[#455a64] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]" />
                                        <span className="text-[#90a4ae] text-sm">บาท</span>
                                        <button className="p-2 text-[#ff8a8a] hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#eaf6f8]">
                                    <span className="font-medium text-[#455a64] flex-1">สองหน้า</span>
                                    <div className="flex items-center gap-3">
                                        <input type="number" defaultValue={3} className="w-24 text-right rounded-xl border border-[#E0E0E0] p-2 text-[#455a64] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]" />
                                        <span className="text-[#90a4ae] text-sm">บาท</span>
                                        <button className="p-2 text-[#ff8a8a] hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ขนาดเอกสาร block */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaf6f8] space-y-4">
                            <div className="flex items-center justify-between border-b border-[#eaf6f8] pb-4">
                                <h3 className="font-bold text-[#455a64]">ขนาดเอกสาร</h3>
                                <button className="flex items-center gap-1 text-sm font-medium text-[#06B6D4] hover:text-[#0891b2] transition-colors rounded-full px-3 py-1 hover:bg-[#E0F7FA]">
                                    <Plus size={16} />
                                    <span>เพิ่ม</span>
                                </button>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#eaf6f8]">
                                    <span className="font-medium text-[#455a64] flex-1">A4</span>
                                    <div className="flex items-center gap-3">
                                        <input type="number" defaultValue={0} className="w-24 text-right rounded-xl border border-[#E0E0E0] p-2 text-[#455a64] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]" />
                                        <span className="text-[#90a4ae] text-sm">บาท</span>
                                        <button className="p-2 text-[#ff8a8a] hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#eaf6f8]">
                                    <span className="font-medium text-[#455a64] flex-1">A3</span>
                                    <div className="flex items-center gap-3">
                                        <input type="number" defaultValue={2} className="w-24 text-right rounded-xl border border-[#E0E0E0] p-2 text-[#455a64] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]" />
                                        <span className="text-[#90a4ae] text-sm">บาท</span>
                                        <button className="p-2 text-[#ff8a8a] hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ความหนากระดาษ block */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaf6f8] space-y-4">
                            <div className="flex items-center justify-between border-b border-[#eaf6f8] pb-4">
                                <h3 className="font-bold text-[#455a64]">ความหนากระดาษ</h3>
                                <button className="flex items-center gap-1 text-sm font-medium text-[#06B6D4] hover:text-[#0891b2] transition-colors rounded-full px-3 py-1 hover:bg-[#E0F7FA]">
                                    <Plus size={16} />
                                    <span>เพิ่ม</span>
                                </button>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#eaf6f8]">
                                    <span className="font-medium text-[#455a64] flex-1">กระดาษปกติ 80 แกรม</span>
                                    <div className="flex items-center gap-3">
                                        <input type="number" defaultValue={0} className="w-24 text-right rounded-xl border border-[#E0E0E0] p-2 text-[#455a64] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]" />
                                        <span className="text-[#90a4ae] text-sm">บาท</span>
                                        <button className="p-2 text-[#ff8a8a] hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#eaf6f8]">
                                    <span className="font-medium text-[#455a64] flex-1">กระดาษหนา 120 แกรม</span>
                                    <div className="flex items-center gap-3">
                                        <input type="number" defaultValue={5} className="w-24 text-right rounded-xl border border-[#E0E0E0] p-2 text-[#455a64] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]" />
                                        <span className="text-[#90a4ae] text-sm">บาท</span>
                                        <button className="p-2 text-[#ff8a8a] hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. การตั้งราคา */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-[#455a64]">การตั้งราคา</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border border-[#eaf6f8] shadow-sm">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#455a64]">
                                    หน่วยราคา <span className="text-red-500">*</span>
                                </label>
                                <select className="w-full rounded-2xl border border-[#E0E0E0] p-4 text-[#455a64] bg-[#FAFAFA] focus:ring-2 focus:ring-[#06B6D4]/30 outline-none transition-all">
                                    <option>ต่อหน้า</option>
                                    <option>ต่อชิ้น</option>
                                    <option>ต่อตารางเมตร</option>
                                    <option>ราคาเหมา</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#455a64]">
                                    ราคาพื้นฐาน (บาท) <span className="text-red-500">*</span>
                                </label>
                                <input type="number" defaultValue={2} className="w-full rounded-2xl border border-[#E0E0E0] p-4 text-[#455a64] bg-[#FAFAFA] focus:ring-2 focus:ring-[#06B6D4]/30 outline-none transition-all" />
                            </div>
                            <div className="space-y-2 md:col-start-2">
                                <label className="block text-sm font-bold text-[#455a64]">
                                    จำนวนขั้นต่ำ
                                </label>
                                <input type="number" defaultValue={1} className="w-full rounded-2xl border border-[#E0E0E0] p-4 text-[#455a64] bg-[#FAFAFA] focus:ring-2 focus:ring-[#06B6D4]/30 outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* 4. Option พิเศษ */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-[#455a64]">Option พิเศษ</h2>
                        <p className="text-sm text-[#90a4ae]">ราคา Option พิเศษจะคิดต่อรอบและไม่มีผลคูณต่อหน่วย</p>

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaf6f8] space-y-4">
                            <div className="flex items-center justify-between border-b border-[#eaf6f8] pb-4">
                                <h3 className="font-bold text-[#fbc02d]">4. Option พิเศษ</h3>
                                <button className="flex items-center gap-1 text-sm font-medium text-[#fbc02d] hover:text-[#f9a825] transition-colors rounded-full px-3 py-1 hover:bg-yellow-50">
                                    <Plus size={16} />
                                    <span>เพิ่ม Option</span>
                                </button>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#eaf6f8]">
                                    <span className="font-medium text-[#455a64] flex-1">เข้าเล่มเกลียว</span>
                                    <div className="flex items-center gap-3">
                                        <input type="number" defaultValue={50} className="w-24 text-right rounded-xl border border-[#E0E0E0] p-2 text-[#455a64] focus:outline-none focus:border-[#fbc02d] focus:ring-1 focus:ring-[#fbc02d]" />
                                        <span className="text-[#90a4ae] text-sm">บาท</span>
                                        <button className="p-2 text-[#ff8a8a] hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#eaf6f8]">
                                    <span className="font-medium text-[#455a64] flex-1">เคลือบบัตร</span>
                                    <div className="flex items-center gap-3">
                                        <input type="number" defaultValue={20} className="w-24 text-right rounded-xl border border-[#E0E0E0] p-2 text-[#455a64] focus:outline-none focus:border-[#fbc02d] focus:ring-1 focus:ring-[#fbc02d]" />
                                        <span className="text-[#90a4ae] text-sm">บาท</span>
                                        <button className="p-2 text-[#ff8a8a] hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
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
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${['PDF', 'DOCX', 'JPG'].includes(type)
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
                                <input type="number" defaultValue={10} className="w-full rounded-2xl border border-[#E0E0E0] p-3 text-[#455a64] bg-[#FAFAFA] focus:ring-2 focus:ring-[#e91e63]/30 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#455a64]">
                                    จำนวนไฟล์สูงสุด
                                </label>
                                <input type="number" defaultValue={5} className="w-full rounded-2xl border border-[#E0E0E0] p-3 text-[#455a64] bg-[#FAFAFA] focus:ring-2 focus:ring-[#e91e63]/30 outline-none transition-all" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#fce4ec] rounded-2xl border border-[#f8bbd0]/50">
                            <div>
                                <p className="font-bold text-[#e91e63]">แสดงตัวอย่างก่อนพิมพ์</p>
                                <p className="text-xs text-[#e91e63]/70 mt-1">ให้ลูกค้าสามารถดูตัวอย่างไฟล์ได้</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-white peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#e91e63] after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e91e63] peer-checked:after:bg-white shadow-sm ring-1 ring-inset ring-[#e91e63]/20"></div>
                            </label>
                        </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-6 flex justify-center">
                        <button className="bg-gradient-to-r from-[#06B6D4] to-[#0891b2] hover:from-[#0891b2] hover:to-[#0e7490] text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg shadow-[#06B6D4]/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                            เพิ่มสินค้า
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
                                    <input type="number" defaultValue={1} className="w-full rounded-xl border border-[#eedeef] p-3 text-[#455a64] bg-white focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100" />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-bold text-[#455a64]">Option พิเศษ</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#eedeef] cursor-pointer hover:border-purple-200 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded flex items-center justify-center border border-[#eedeef] text-white"></div>
                                                <span className="text-[#455a64] text-sm">เข้าเล่มเกลียว</span>
                                            </div>
                                            <span className="text-green-500 text-sm font-bold">+50 บาท</span>
                                        </label>
                                        <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#eedeef] cursor-pointer hover:border-purple-200 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded flex items-center justify-center border border-[#eedeef] text-white"></div>
                                                <span className="text-[#455a64] text-sm">เคลือบบัตร</span>
                                            </div>
                                            <span className="text-green-500 text-sm font-bold">+20 บาท</span>
                                        </label>
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
                                        <span>15.00 บาท</span>
                                    </div>
                                    <div className="flex justify-between text-[#78909c] text-sm">
                                        <span>จำนวน</span>
                                        <span>x 1</span>
                                    </div>
                                    <div className="flex justify-between text-[#455a64] text-sm font-bold">
                                        <span>ยอดรวม</span>
                                        <span>15.00 บาท</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[#eedeef] flex justify-between items-end">
                                    <span className="font-bold text-[#455a64]">ราคาทั้งหมด</span>
                                    <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-[#7e57c2]">
                                        15.00 ฿
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
                                    <span className="font-bold text-[#455a64] bg-gray-100 px-2 py-0.5 rounded-md">2</span>
                                </div>
                                <div className="flex justify-between text-xs text-[#78909c]">
                                    <span>ส่วนขยายค่าจัดส่ง</span>
                                    <span className="font-bold text-[#455a64] bg-gray-100 px-2 py-0.5 rounded-md">4</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    )
}
