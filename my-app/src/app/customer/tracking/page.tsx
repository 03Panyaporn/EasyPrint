"use client";

import Link from "next/link";

const steps = [
    { label: "รับคำสั่งซื้อ", desc: "ระบบได้รับคำสั่งซื้อของคุณแล้ว", done: true },
    { label: "ตรวจสอบการชำระเงิน", desc: "กำลังตรวจสอบหลักฐานการชำระเงิน", done: true },
    { label: "กำลังพิมพ์", desc: "งานของคุณอยู่ในคิวการพิมพ์", done: false, active: true },
    { label: "เตรียมจัดส่ง", desc: "แพ็คและเตรียมส่งมอบ", done: false },
    { label: "เสร็จสิ้น", desc: "ส่งมอบเรียบร้อยแล้ว", done: false },
];

export default function TrackingPage() {
    return (
        <div className="bg-[#F8FAFC] min-h-screen py-8 px-8">
            <div className="max-w-2xl mx-auto flex flex-col gap-5">

                {/* Success Banner */}
                <div className="bg-white rounded-2xl shadow-sm border border-green-200 overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400" />
                    <div className="p-6 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-gray-700">ยืนยันคำสั่งซื้อสำเร็จ!</h1>
                            <p className="text-sm text-gray-400 mt-0.5">ขอบคุณที่ใช้บริการ EasyPrint — เราจะดำเนินการโดยเร็วที่สุด</p>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-xs text-gray-400">หมายเลขคำสั่งซื้อ</p>
                            <p className="text-sm font-bold text-[#06B6D4]">
                                #EP{Date.now().toString().slice(-6)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Timeline */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E0F3F7] overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-[#06B6D4] via-[#67e8f9] to-[#06B6D4]" />
                    <div className="p-6">
                        <h2 className="text-sm font-bold text-gray-700 mb-6">สถานะงานพิมพ์</h2>
                        <div className="flex flex-col gap-0">
                            {steps.map((step, idx) => (
                                <div key={idx} className="flex gap-4">
                                    {/* Dot & line */}
                                    <div className="flex flex-col items-center">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-all
                                            ${step.done
                                                ? "bg-[#06B6D4] border-[#06B6D4]"
                                                : (step as { label: string; desc: string; done: boolean; active?: boolean }).active
                                                    ? "bg-white border-[#06B6D4] shadow-md shadow-[#06B6D4]/20"
                                                    : "bg-gray-100 border-gray-200"}`}>
                                            {step.done ? (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            ) : (step as { label: string; desc: string; done: boolean; active?: boolean }).active ? (
                                                <div className="w-3 h-3 rounded-full bg-[#06B6D4] animate-pulse" />
                                            ) : (
                                                <div className="w-3 h-3 rounded-full bg-gray-300" />
                                            )}
                                        </div>
                                        {idx < steps.length - 1 && (
                                            <div className={`w-0.5 h-10 mt-1 ${step.done ? "bg-[#06B6D4]" : "bg-gray-200"}`} />
                                        )}
                                    </div>
                                    {/* Text */}
                                    <div className="pb-8">
                                        <p className={`text-sm font-semibold ${step.done ? "text-[#06B6D4]" : (step as { label: string; desc: string; done: boolean; active?: boolean }).active ? "text-gray-700" : "text-gray-400"}`}>
                                            {step.label}
                                            {(step as { label: string; desc: string; done: boolean; active?: boolean }).active && (
                                                <span className="ml-2 text-[10px] bg-[#E0F3F7] text-[#06B6D4] font-bold px-2 py-0.5 rounded-full">กำลังดำเนินการ</span>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Estimated time */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E0F3F7] p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E0F3F7] flex items-center justify-center shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700">เวลาโดยประมาณ</p>
                        <p className="text-xs text-gray-400">ภายใน 1–2 ชั่วโมงทำการ (เปิด 08:00 – 17:00 น.)</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Link href="/customer" className="flex-1 py-2.5 text-sm text-center text-[#06B6D4] border border-[#06B6D4]/40 rounded-full hover:bg-[#E0F3F7] transition-all duration-200 font-medium">
                        กลับหน้าหลัก
                    </Link>
                    <Link href="/customer/order" className="flex-1 py-2.5 text-sm text-center bg-gradient-to-r from-[#06B6D4] to-[#0891b2] text-white font-semibold rounded-full shadow-md hover:shadow-[#06B6D4]/40 hover:shadow-lg transition-all duration-200 active:scale-95">
                        สั่งพิมพ์เพิ่ม
                    </Link>
                </div>

            </div>
        </div>
    );
}
