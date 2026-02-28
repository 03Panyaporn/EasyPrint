import { Phone, Mail, Facebook, Printer } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-white px-24 py-16 border-t border-[#eaf6f8]">
            <div className="max-w-7xl mx-auto flex justify-between items-start">

                {/* Left - Logo & About */}
                <div className="max-w-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-[#21b4d0] p-1.5 rounded-lg text-white">
                            <Printer size={20} />
                        </div>
                        <h3 className="text-xl font-bold tracking-tight text-[#455a64]">
                            EASY<span className="text-[#21b4d0]">PRINT</span>
                        </h3>
                    </div>
                    <p className="text-[#7eb6c5] font-medium leading-relaxed mb-8">
                        ประสบการณ์ใหม่สำหรับการสั่งพิมพ์งานออนไลน์ เพื่อความสะดวกสบาย พร้อมการแจ้งเตือน
                    </p>
                    <div className="flex gap-4">
                        <div className="p-2.5 bg-[#f5fbfe] rounded-xl text-[#7eb6c5] border border-[#eaf6f8] cursor-pointer hover:bg-[#eaf6f8] transition-colors">
                            <Phone size={20} />
                        </div>
                        <div className="p-2.5 bg-[#f5fbfe] rounded-xl text-[#7eb6c5] border border-[#eaf6f8] cursor-pointer hover:bg-[#eaf6f8] transition-colors">
                            <Mail size={20} />
                        </div>
                        <div className="p-2.5 bg-[#f5fbfe] rounded-xl text-[#7eb6c5] border border-[#eaf6f8] cursor-pointer hover:bg-[#eaf6f8] transition-colors">
                            <Facebook size={20} />
                        </div>
                    </div>
                </div>

                {/* Center - Platform */}
                <div>
                    <h4 className="font-bold text-[#21b4d0] uppercase tracking-wider text-sm mb-6">Platform</h4>
                    <ul className="space-y-4 text-[#7eb6c5] font-medium text-sm">
                        <li className="hover:text-[#21b4d0] cursor-pointer">ออเดอร์ทั้งหมด</li>
                        <li className="hover:text-[#21b4d0] cursor-pointer">ราคาบริการต่างๆ</li>
                        <li className="hover:text-[#21b4d0] cursor-pointer">ติดตามสถานะ</li>
                        <li className="hover:text-[#21b4d0] cursor-pointer">การช่วยเหลือ</li>
                    </ul>
                </div>

                {/* Right - Company */}
                <div>
                    <h4 className="font-bold text-[#21b4d0] uppercase tracking-wider text-sm mb-6">Company</h4>
                    <ul className="space-y-4 text-[#7eb6c5] font-medium text-sm">
                        <li className="hover:text-[#21b4d0] cursor-pointer">Our Vision</li>
                        <li className="hover:text-[#21b4d0] cursor-pointer">Privacy Policy</li>
                        <li className="hover:text-[#21b4d0] cursor-pointer">Terms of Use</li>
                    </ul>
                </div>

            </div>
        </footer>
    )
}