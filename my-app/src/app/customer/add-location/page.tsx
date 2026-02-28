"use client"
import { useRouter } from "next/navigation"

export default function AddLocationPage() {
    const router = useRouter();

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="bg-white rounded-[40px] shadow-[0_10px_50px_rgba(0,0,0,0.05)] border border-[#eaf6f8] p-10">
                <h1 className="text-2xl font-bold text-[#455a64] mb-8">เพิ่มที่อยู่</h1>

                <form className="space-y-6">
                    {/* Row 1 */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#455a64] block">ชื่อ</label>
                            <input
                                type="text"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#455a64] block">นามสกุล</label>
                            <input
                                type="text"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#455a64] block">ชื่อสถานที่</label>
                            <input
                                type="text"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#455a64] block">บ้านเลขที่</label>
                            <input
                                type="text"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#455a64] block">หมู่</label>
                            <input
                                type="text"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#455a64] block">ถนน (ไม่มีใช้ - )</label>
                            <input
                                type="text"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#455a64] block">ตำบล</label>
                            <input
                                type="text"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#455a64] block">อำเภอ</label>
                            <input
                                type="text"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Row 4 */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#455a64] block">จังหวัด</label>
                            <div className="relative">
                                <select className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#06B6D4] outline-none appearance-none transition-all cursor-pointer">
                                    <option value="">เลือกจังหวัด</option>
                                    <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                                    <option value="กระบี่">กระบี่</option>
                                    <option value="กาญจนบุรี">กาญจนบุรี</option>
                                    <option value="กาฬสินธุ์">กาฬสินธุ์</option>
                                    <option value="กำแพงเพชร">กำแพงเพชร</option>
                                    <option value="ขอนแก่น">ขอนแก่น</option>
                                    <option value="จันทบุรี">จันทบุรี</option>
                                    <option value="ฉะเชิงเทรา">ฉะเชิงเทรา</option>
                                    <option value="ชลบุรี">ชลบุรี</option>
                                    <option value="ชัยนาท">ชัยนาท</option>
                                    <option value="ชัยภูมิ">ชัยภูมิ</option>
                                    <option value="ชุมพร">ชุมพร</option>
                                    <option value="เชียงราย">เชียงราย</option>
                                    <option value="เชียงใหม่">เชียงใหม่</option>
                                    <option value="ตรัง">ตรัง</option>
                                    <option value="ตราด">ตราด</option>
                                    <option value="ตาก">ตาก</option>
                                    <option value="นครนายก">นครนายก</option>
                                    <option value="นครปฐม">นครปฐม</option>
                                    <option value="นครพนม">นครพนม</option>
                                    <option value="นครราชสีมา">นครราชสีมา</option>
                                    <option value="นครศรีธรรมราช">นครศรีธรรมราช</option>
                                    <option value="นครสวรรค์">นครสวรรค์</option>
                                    <option value="นนทบุรี">นนทบุรี</option>
                                    <option value="นราธิวาส">นราธิวาส</option>
                                    <option value="น่าน">น่าน</option>
                                    <option value="บึงกาฬ">บึงกาฬ</option>
                                    <option value="บุรีรัมย์">บุรีรัมย์</option>
                                    <option value="ปทุมธานี">ปทุมธานี</option>
                                    <option value="ประจวบคีรีขันธ์">ประจวบคีรีขันธ์</option>
                                    <option value="ปราจีนบุรี">ปราจีนบุรี</option>
                                    <option value="ปัตตานี">ปัตตานี</option>
                                    <option value="พระนครศรีอยุธยา">พระนครศรีอยุธยา</option>
                                    <option value="พังงา">พังงา</option>
                                    <option value="พัทลุง">พัทลุง</option>
                                    <option value="พิจิตร">พิจิตร</option>
                                    <option value="พิษณุโลก">พิษณุโลก</option>
                                    <option value="เพชรบุรี">เพชรบุรี</option>
                                    <option value="เพชรบูรณ์">เพชรบูรณ์</option>
                                    <option value="แพร่">แพร่</option>
                                    <option value="พะเยา">พะเยา</option>
                                    <option value="ภูเก็ต">ภูเก็ต</option>
                                    <option value="มหาสารคาม">มหาสารคาม</option>
                                    <option value="มุกดาหาร">มุกดาหาร</option>
                                    <option value="แม่ฮ่องสอน">แม่ฮ่องสอน</option>
                                    <option value="ยโสธร">ยโสธร</option>
                                    <option value="ยะลา">ยะลา</option>
                                    <option value="ร้อยเอ็ด">ร้อยเอ็ด</option>
                                    <option value="ระนอง">ระนอง</option>
                                    <option value="ระยอง">ระยอง</option>
                                    <option value="ราชบุรี">ราชบุรี</option>
                                    <option value="ลพบุรี">ลพบุรี</option>
                                    <option value="ลำปาง">ลำปาง</option>
                                    <option value="ลำพูน">ลำพูน</option>
                                    <option value="เลย">เลย</option>
                                    <option value="ศรีสะเกษ">ศรีสะเกษ</option>
                                    <option value="สกลนคร">สกลนคร</option>
                                    <option value="สงขลา">สงขลา</option>
                                    <option value="สตูล">สตูล</option>
                                    <option value="สมุทรปราการ">สมุทรปราการ</option>
                                    <option value="สมุทรสงคราม">สมุทรสงคราม</option>
                                    <option value="สมุทรสาคร">สมุทรสาคร</option>
                                    <option value="สระแก้ว">สระแก้ว</option>
                                    <option value="สระบุรี">สระบุรี</option>
                                    <option value="สิงห์บุรี">สิงห์บุรี</option>
                                    <option value="สุโขทัย">สุโขทัย</option>
                                    <option value="สุพรรณบุรี">สุพรรณบุรี</option>
                                    <option value="สุราษฎร์ธานี">สุราษฎร์ธานี</option>
                                    <option value="สุรินทร์">สุรินทร์</option>
                                    <option value="หนองคาย">หนองคาย</option>
                                    <option value="หนองบัวลำภู">หนองบัวลำภู</option>
                                    <option value="อ่างทอง">อ่างทอง</option>
                                    <option value="อุดรธานี">อุดรธานี</option>
                                    <option value="อุทัยธานี">อุทัยธานี</option>
                                    <option value="อุตรดิตถ์">อุตรดิตถ์</option>
                                    <option value="อุบลราชธานี">อุบลราชธานี</option>
                                    <option value="อำนาจเจริญ">อำนาจเจริญ</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L7 7L13 1" stroke="#455A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#455a64] block">รหัสไปรษณีย์</label>
                            <input
                                type="text"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#455a64] block">เบอร์โทร</label>
                            <input
                                type="text"
                                className="w-full bg-[#f5f7f9] text-[#455a64] border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-6 pt-8">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-[#e0e0e0] text-[#a0a0a0] px-12 py-3 rounded-[30px] text-lg font-bold shadow-sm hover:bg-gray-300 transition-all"
                        >
                            ย้อนกลับ
                        </button>
                        <button
                            type="submit"
                            className="bg-[#06B6D4] text-white px-12 py-3 rounded-[30px] text-lg font-bold shadow-[0_10px_30px_rgba(6,182,212,0.3)] hover:bg-[#08a2bc] transition-all"
                        >
                            เพิ่มที่อยู่
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}