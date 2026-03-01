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
                                    <p className="text-2xl font-bold text-[#455a64] leading-snug">
                                        สะดวก <span className="text-[#06B6D4]">รวดเร็ว</span><br />ทุกที่ ทุกเวลา
                                    </p>
                                    <p className="text-[#90a4ae] text-xs mt-2 leading-relaxed">
                                        บริการพิมพ์งานออนไลน์<br />ครบจบในที่เดียว
                                    </p>
                                    <div className="flex flex-col gap-2 mt-8 items-center">
                                        <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur text-green-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            พร้อมให้บริการ
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur text-amber-500 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                                            ⚡ รวดเร็ว ทันใจ
                                        </span>
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

            {/* ═══════ Features Section ═══════ */}
            <section className="bg-[#FAFCFD] py-14 lg:py-20 border-t border-[#E0F3F7]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <p className="text-[#06B6D4] font-semibold text-xs uppercase tracking-widest mb-2">Features</p>
                        <h2 className="text-2xl lg:text-3xl font-bold text-[#455a64]">ทำไมต้อง EasyPrint?</h2>
                        <p className="text-[#90a4ae] text-sm mt-3 max-w-md mx-auto">
                            ระบบสั่งพิมพ์ออนไลน์ที่ออกแบบมาให้ใช้งานง่าย สะดวก ครบจบในที่เดียว
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />,
                                title: "สั่งพิมพ์ออนไลน์",
                                desc: "อัปโหลดไฟล์ เลือกตัวเลือกการพิมพ์ สั่งพิมพ์ได้ทันทีจากทุกที่",
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
                                title: "คำนวณราคาอัตโนมัติ",
                                desc: "คิดราคาแม่นยำโปร่งใส ดูราคาก่อนยืนยันสั่ง ไม่มีค่าใช้จ่ายซ่อน",
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
                                title: "แจ้งเตือนสถานะ",
                                desc: "ติดตามงานพิมพ์ได้แบบเรียลไทม์ รู้ทันทุกขั้นตอนจนถึงมือ",
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
                                title: "แชทกับร้านค้า",
                                desc: "สอบถามรายละเอียด พูดคุยกับร้านค้าได้โดยตรงผ่านระบบแชท",
                            },
                        ].map((f, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-7 border border-[#eaf6f8] shadow-sm hover:shadow-lg hover:shadow-[#06B6D4]/5 hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] text-[#06B6D4] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {f.icon}
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-[#455a64] mb-2">{f.title}</h3>
                                <p className="text-sm text-[#90a4ae] leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════ How It Works ═══════ */}
            <section className="py-14 lg:py-20 border-t border-[#E0F3F7]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <p className="text-[#06B6D4] font-semibold text-xs uppercase tracking-widest mb-2">How It Works</p>
                        <h2 className="text-2xl lg:text-3xl font-bold text-[#455a64]">ขั้นตอนง่ายๆ</h2>
                        <p className="text-[#90a4ae] text-sm mt-3 max-w-md mx-auto">
                            เพียง 4 ขั้นตอนก็พร้อมรับงานพิมพ์คุณภาพ
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "สมัครสมาชิก", desc: "สร้างบัญชีฟรีภายในไม่กี่วินาที" },
                            { step: "02", title: "อัปโหลดไฟล์", desc: "เลือกไฟล์ที่ต้องการพิมพ์ (PDF, DOC, รูปภาพ)" },
                            { step: "03", title: "เลือกตัวเลือก", desc: "กำหนดขนาด ประเภท จำนวน และตัวเลือกเพิ่มเติม" },
                            { step: "04", title: "รับงานพิมพ์", desc: "ติดตามสถานะและรับงานพิมพ์ตามที่ต้องการ" },
                        ].map((s, i, arr) => (
                            <div key={i} className="relative text-center group">
                                {i < arr.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-[#06B6D4]/30 to-[#06B6D4]/10" />
                                )}
                                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#06B6D4] to-[#0891b2] text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-[#06B6D4]/20 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#06B6D4]/30 transition-all duration-300 mb-4">
                                    {s.step}
                                </div>
                                <h3 className="text-base font-bold text-[#455a64] mb-1">{s.title}</h3>
                                <p className="text-xs text-[#90a4ae] max-w-[180px] mx-auto">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

