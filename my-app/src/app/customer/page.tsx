import Link from "next/link"

export default function CustomerHome() {
    return (
        <>
            <section className="relative overflow-hidden bg-white">
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#06B6D4]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#06B6D4]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-14 relative">

                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E0F7FA] rounded-full text-[#06B6D4] text-xs font-semibold mb-4">
                            <span className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full animate-pulse" />
                            บริการพิมพ์งานออนไลน์
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-bold leading-[1.2] text-[#455a64] tracking-tight">
                            Print Smarter,
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#0891b2]">
                                Cooler &amp; Faster.
                            </span>
                        </h1>

                        <p className="mt-5 text-lg lg:text-xl text-[#78909c] leading-relaxed max-w-md mx-auto lg:mx-0">
                            ร้านให้บริการถ่ายเอกสาร พิมพ์งาน และเข้าเล่ม พร้อมคำนวณราคาอัตโนมัติอย่างถูกต้องและโปร่งใส
                            รวดเร็ว สะดวก มั่นใจในทุกขั้นตอน พร้อมการแจ้งเตือนสถานะ
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mt-7 justify-center lg:justify-start">
                            <Link
                                href="/customer/order"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#0891b2] rounded-xl shadow-lg shadow-[#06B6D4]/25 hover:shadow-xl hover:shadow-[#06B6D4]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            >
                                เริ่มสั่งพิมพ์
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link
                                href="/customer/pricing"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-[#455a64] bg-white border-2 border-[#e5e7eb] rounded-xl shadow-sm hover:border-[#06B6D4] hover:text-[#06B6D4] hover:shadow-md transition-all duration-300"
                            >
                                ดูราคา
                            </Link>
                        </div>
                    </div>

                    {/* Right — Illustration */}
                    <div className="flex-1 flex justify-center">
                        <div className="relative">
                            <div className="w-[320px] h-[360px] lg:w-[400px] lg:h-[440px] bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] rounded-[40px] border-[10px] border-white shadow-2xl shadow-[#06B6D4]/10 flex items-center justify-center overflow-hidden">
                                <div className="text-center p-8">
                                    <div className="w-20 h-20 mx-auto mb-5 bg-white rounded-2xl shadow-lg shadow-[#06B6D4]/20 flex items-center justify-center">
                                        <svg className="w-10 h-10 text-[#06B6D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                    </div>
                                    <p className="text-xl font-bold text-[#455a64]">EASY<span className="text-[#06B6D4]">PRINT</span></p>
                                    <p className="text-[#78909c] text-sm mt-1">สะดวก รวดเร็ว ทุกที่ ทุกเวลา</p>

                                    <div className="flex gap-4 mt-10 justify-center">
                                        <div className="bg-white/80 backdrop-blur rounded-xl px-4 py-3 shadow-sm">
                                            <p className="text-xl font-bold text-[#06B6D4]">500+</p>
                                            <p className="text-xs text-[#90a4ae] font-medium">ลูกค้าใช้บริการ</p>
                                        </div>
                                        <div className="bg-white/80 backdrop-blur rounded-xl px-4 py-3 shadow-sm">
                                            <p className="text-xl font-bold text-[#06B6D4]">99%</p>
                                            <p className="text-xs text-[#90a4ae] font-medium">ความพึงพอใจ</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-5 -right-5 w-24 h-24 bg-[#FFF9C4] rounded-2xl rotate-12 shadow-lg flex items-center justify-center">
                                <svg className="w-10 h-10 text-[#F9A825]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-[#F3E5F5] rounded-2xl -rotate-12 shadow-lg flex items-center justify-center">
                                <svg className="w-9 h-9 text-[#AB47BC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>
            </section>


        </>
    )
}

