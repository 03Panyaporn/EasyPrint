import Link from "next/link"

export default function CustomerHome() {
    return (
        <section className="flex items-center justify-between px-16 py-16 bg-white">

            {/* Left Content */}
            <div className="max-w-xl">
                <h1 className="text-4xl font-bold leading-[1.2] text-[#455a64] tracking-tight">
                    Print Smarter ,<br />
                    <span className="text-[#06B6D4]">
                        Cooler & Faster.
                    </span>
                </h1>

                <p className="mt-6 text-base text-[#7eb6c5] leading-relaxed max-w-md font-medium">
                    ร้านให้บริการถ่ายเอกสาร พิมพ์งาน และเข้าเล่ม
                    พร้อมคำนวณราคาอัตโนมัติอย่างถูกต้องและโปร่งใส รวดเร็ว
                    สะดวก มั่นใจในทุกขั้นตอน พร้อมการแจ้งเตือนสถานะ
                </p>

                <div className="flex gap-5 mt-8">
                    <Link
                        href="/customer/order"
                        className="bg-[#06B6D4] text-white px-8 py-3 rounded-2xl text-base font-bold shadow-[0_10px_20px_rgba(6,182,212,0.3)] hover:bg-[#08a2bc] transition-all flex items-center gap-2"
                    >
                        เริ่มสั่งพิมพ์ <span className="text-lg">→</span>
                    </Link>

                    <Link
                        href="/customer/pricing"
                        className="bg-white text-[#455a64] border-2 border-[#e0e0e0] px-8 py-3 rounded-2xl text-base font-bold shadow-sm hover:bg-gray-50 transition-all"
                    >
                        ดูราคา
                    </Link>
                </div>
            </div>

            {/* Right Image/Mockup */}
            <div className="relative">
                <div className="w-[380px] h-[440px] bg-[#97d8e8] rounded-[40px] border-[12px] border-[#eaf6f8] shadow-2xl overflow-hidden">
                    <div className="w-full h-full bg-[#97d8e8]"></div>
                </div>
                <div className="absolute -inset-4 bg-[#06B6D4]/10 blur-3xl rounded-full -z-10"></div>
            </div>

        </section>
    )
}