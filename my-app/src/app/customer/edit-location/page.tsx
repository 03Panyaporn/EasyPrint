"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function EditLocationPage() {
    const router = useRouter();

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="bg-white rounded-[40px] shadow-[0_10px_50px_rgba(0,0,0,0.05)] border border-[#eaf6f8] p-16">
                <h1 className="text-4xl font-bold text-[#455a64] mb-12">แก้ไขที่อยู่</h1>

                <form className="space-y-10">
                    {/* Row 1 */}
                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-3">
                            <label className="text-xl font-bold text-[#455a64] block">ชื่อ</label>
                            <input
                                type="text"
                                defaultValue="สมชาย"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-2xl p-4 text-lg focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xl font-bold text-[#455a64] block">นามสกุล</label>
                            <input
                                type="text"
                                defaultValue="ใจดี"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-2xl p-4 text-lg focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-3 gap-12">
                        <div className="space-y-3">
                            <label className="text-xl font-bold text-[#455a64] block">ชื่อสถานที่</label>
                            <input
                                type="text"
                                defaultValue="บ้าน"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-2xl p-4 text-lg focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xl font-bold text-[#455a64] block">บ้านเลขที่</label>
                            <input
                                type="text"
                                defaultValue="111"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-2xl p-4 text-lg focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xl font-bold text-[#455a64] block">หมู่</label>
                            <input
                                type="text"
                                defaultValue="1"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-2xl p-4 text-lg focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-3 gap-12">
                        <div className="space-y-3">
                            <label className="text-xl font-bold text-[#455a64] block">ถนน (ไม่มีใช้ - )</label>
                            <input
                                type="text"
                                defaultValue="-"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-2xl p-4 text-lg focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xl font-bold text-[#455a64] block">ตำบล</label>
                            <input
                                type="text"
                                defaultValue="แสนสุข"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-2xl p-4 text-lg focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xl font-bold text-[#455a64] block">อำเภอ</label>
                            <input
                                type="text"
                                defaultValue="แสนดี"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-2xl p-4 text-lg focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Row 4 */}
                    <div className="grid grid-cols-3 gap-12">
                        <div className="space-y-3">
                            <label className="text-xl font-bold text-[#455a64] block">จังหวัด</label>
                            <div className="relative">
                                <select defaultValue="chonburi" className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-2xl p-4 text-lg focus:ring-2 focus:ring-[#06B6D4] outline-none appearance-none transition-all cursor-pointer">
                                    <option value="">เลือกจังหวัด</option>
                                    <option value="bangkok">กรุงเทพมหานคร</option>
                                    <option value="chonburi">ชลบุรี</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L7 7L13 1" stroke="#455A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xl font-bold text-[#455a64] block">รหัสไปรษณีย์</label>
                            <input
                                type="text"
                                defaultValue="11111"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-2xl p-4 text-lg focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xl font-bold text-[#455a64] block">เบอร์โทร</label>
                            <input
                                type="text"
                                defaultValue="0812345678"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-2xl p-4 text-lg focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-8 pt-12">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-[#e0e0e0] text-[#a0a0a0] px-20 py-5 rounded-[40px] text-2xl font-bold shadow-sm hover:bg-gray-300 transition-all"
                        >
                            ย้อนกลับ
                        </button>
                        <button
                            type="submit"
                            className="bg-[#06B6D4] text-white px-20 py-5 rounded-[40px] text-2xl font-bold shadow-[0_10px_30px_rgba(6,182,212,0.3)] hover:bg-[#08a2bc] transition-all"
                        >
                            บันทึกที่อยู่
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
