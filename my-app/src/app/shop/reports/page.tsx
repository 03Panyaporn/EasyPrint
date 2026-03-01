"use client";

import { useState } from "react";
import {
    Search,
    Info,
    User,
    DollarSign,
    ShoppingCart,
    Hourglass,
    Download,
} from "lucide-react";

export default function ReportsPage() {
    return (
        <div className="p-8 pb-16 bg-[#F8FAFC] min-h-screen">
            {/* Header section matching notifications design */}
            <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
                <div className="flex-1 mr-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#455a64]">
                            รายงาน
                        </h1>
                        <p className="text-[13px] text-gray-500 mt-1">
                            ข้อมูลเชิงลึกเกี่ยวกับผลประกอบการร้านค้าของคุณ
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 px-2 border-l border-[#e5e7eb] pl-6">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-[#455a64]">
                            Shop EasyPrint
                        </p>
                        <p className="text-[11px] font-medium text-gray-400">Test User</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#06B6D4] flex items-center justify-center text-white shadow-md">
                        <User size={20} />
                    </div>
                </div>
            </div>

            {/* Reports Main Container */}
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Top Controls */}
                <div className="flex justify-end gap-3 mb-4">
                    <button className="bg-white border text-sm font-medium border-gray-200 text-gray-600 px-4 py-2.5 rounded-[10px] flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        ม.ค. 2026 - มิ.ย. 2026
                    </button>
                    <button className="bg-[#06B6D4] hover:bg-[#0891b2] text-white px-5 py-2.5 rounded-[10px] text-[13px] font-bold flex items-center gap-2 transition-all shadow-[0_2px_10px_rgba(6,182,212,0.2)]">
                        <Download size={16} strokeWidth={2.5} />
                        ส่งออก PDF
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Revenue Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start justify-between relative overflow-hidden">
                        <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#06B6D4] rounded-r-md"></div>
                        <div className="pl-2">
                            <p className="text-sm text-gray-500 font-medium mb-1">
                                รายได้วันนี้
                            </p>
                            <h3 className="text-3xl font-bold text-[#1e293b]">$ 5000</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                            <DollarSign size={20} className="text-[#1e293b]" />
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start justify-between relative overflow-hidden">
                        <div className="absolute left-0 top-6 bottom-6 w-1 bg-pink-400 rounded-r-md"></div>
                        <div className="pl-2">
                            <p className="text-sm text-gray-500 font-medium mb-1">
                                คำสั่งซื้อทั้งหมด
                            </p>
                            <h3 className="text-3xl font-bold text-[#1e293b]">6</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                            <ShoppingCart size={20} className="text-[#1e293b]" />
                        </div>
                    </div>

                    {/* Pending Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start justify-between relative overflow-hidden">
                        <div className="absolute left-0 top-6 bottom-6 w-1 bg-yellow-400 rounded-r-md"></div>
                        <div className="pl-2">
                            <p className="text-sm text-gray-500 font-medium mb-1">
                                คำสั่งซื้อรอดำเนินการ
                            </p>
                            <h3 className="text-3xl font-bold text-[#1e293b]">3</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                            <Hourglass size={20} className="text-[#1e293b]" />
                        </div>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
                        <h3 className="text-[#1e293b] font-bold text-[15px] mb-6">
                            รายได้และกำไร
                        </h3>

                        {/* Placeholder for actual chart */}
                        <div className="relative h-[300px] w-full mt-4 flex items-end">
                            {/* Y Axis labels */}
                            <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-400 font-medium pb-2">
                                <span>80000</span>
                                <span>60000</span>
                                <span>40000</span>
                                <span>20000</span>
                                <span>0</span>
                            </div>

                            {/* Grid lines */}
                            <div className="absolute left-12 right-0 top-2 bottom-8 flex flex-col justify-between">
                                <div className="w-full border-b border-gray-50 border-dashed"></div>
                                <div className="w-full border-b border-gray-50 border-dashed"></div>
                                <div className="w-full border-b border-gray-50 border-dashed"></div>
                                <div className="w-full border-b border-gray-50 border-dashed"></div>
                                <div className="w-full border-b border-gray-100"></div>
                            </div>

                            {/* X Axis labels */}
                            <div className="absolute left-12 right-0 bottom-0 h-8 flex justify-between items-center text-xs text-gray-400 font-medium px-4">
                                <span>ม.ค.</span>
                                <span>ก.พ.</span>
                                <span>มี.ค.</span>
                                <span>เม.ย.</span>
                                <span>พ.ค.</span>
                                <span>มิ.ย.</span>
                            </div>

                            {/* Simulated SVG line charts for appearance */}
                            <div className="absolute left-12 right-0 top-0 bottom-8">
                                <svg
                                    className="w-full h-full"
                                    viewBox="0 0 500 250"
                                    preserveAspectRatio="none"
                                >
                                    {/* Primary solid line */}
                                    <path
                                        d="M 0 150 C 50 120, 100 130, 150 140 C 200 150, 250 80, 300 90 C 350 100, 400 110, 500 50"
                                        fill="none"
                                        stroke="#06B6D4"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                    {/* Secondary dashed line */}
                                    <path
                                        d="M 0 200 C 50 180, 100 190, 150 180 C 200 170, 250 150, 300 155 C 350 160, 400 160, 500 120"
                                        fill="none"
                                        stroke="#94a3b8"
                                        strokeWidth="2"
                                        strokeDasharray="5,5"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Chart / Retention */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
                        <h3 className="text-[#1e293b] font-bold text-[15px] mb-8">
                            การรักษาลูกค้า
                        </h3>

                        <div className="flex-1 flex flex-col items-center justify-center relative">
                            {/* Donut Chart representation */}
                            <div className="relative w-48 h-48 rounded-full border-[16px] border-[#e2e8f0] flex items-center justify-center">
                                {/* SVG for actual ring since pure CSS is tricky for partial borders */}
                                <svg
                                    className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                                    viewBox="0 0 100 100"
                                >
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="42"
                                        fill="none"
                                        stroke="#06B6D4"
                                        strokeWidth="16"
                                        strokeDasharray="264"
                                        strokeDashoffset="92"
                                        className="transition-all duration-1000"
                                    />
                                </svg>

                                <div className="text-center mt-2">
                                    <span className="text-3xl font-extrabold text-[#1e293b]">
                                        65%
                                    </span>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">
                                        กลับมาซื้อซ้ำ
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]"></div>
                                    <span className="text-gray-600 font-medium">กลับมาซื้อซ้ำ</span>
                                </div>
                                <span className="font-bold text-[#1e293b]">65%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#e2e8f0]"></div>
                                    <span className="text-gray-600 font-medium">ซื้อครั้งเดียว</span>
                                </div>
                                <span className="font-bold text-[#1e293b]">35%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
