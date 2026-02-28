import Link from "next/link"

export default function CustomerHome() {
    return (
        <section className="flex items-center justify-between px-24 py-32 bg-white">

            {/* Left Content */}
            <div className="max-w-2xl">
                <h1 className="text-7xl font-bold leading-[1.1] text-[#455a64] tracking-tight">
                    Print Smarter ,<br />
                    <span className="text-[#06B6D4]">
                        Cooler & Faster.
                    </span>
                </h1>

                <p className="mt-10 text-xl text-[#7eb6c5] leading-relaxed max-w-lg font-medium">
                    ร้านให้บริการถ่ายเอกสาร พิมพ์งาน และเข้าเล่ม
                    พร้อมคำนวณราคาอัตโนมัติอย่างถูกต้องและโปร่งใส รวดเร็ว
                    สะดวก มั่นใจในทุกขั้นตอน พร้อมการแจ้งเตือนสถานะ
                </p>

                <div className="flex gap-8 mt-14">
                    <Link
                        href="/customer/order"
                        className="bg-[#06B6D4] text-white px-12 py-5 rounded-[24px] text-2xl font-bold shadow-[0_10px_20px_rgba(6,182,212,0.3)] hover:bg-[#08a2bc] transition-all flex items-center gap-2"
                    >
                        เริ่มสั่งพิมพ์ <span className="text-3xl">→</span>
                    </Link>

                    <Link
                        href="/customer/pricing"
                        className="bg-white text-[#455a64] border-2 border-[#e0e0e0] px-14 py-5 rounded-[24px] text-2xl font-bold shadow-sm hover:bg-gray-50 transition-all"
                    >
                        ดูราคา
                    </Link>
                </div>
            </div>

            {/* Right Image/Mockup */}
            <div className="relative">
                <div className="w-[520px] h-[600px] bg-[#97d8e8] rounded-[60px] border-[16px] border-[#eaf6f8] shadow-2xl overflow-hidden">
                    {/* Inner content simulation */}
                    <div className="w-full h-full bg-[#97d8e8]"></div>
                </div>
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-[#06B6D4]/10 blur-3xl rounded-full -z-10"></div>
            </div>

        </section>
    )
}