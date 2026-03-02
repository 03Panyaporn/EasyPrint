import Link from "next/link"
export default function PricingPage() {
    const pricing = [
        {
            title: "ขาวดำ",
            items: [
                { name: "A4 หน้าเดียว", price: "1 บาท / แผ่น" },
                { name: "A4 สองหน้า", price: "1.5 บาท / แผ่น" },
                { name: "A3 หน้าเดียว", price: "3 บาท / แผ่น" },
            ],
        },
        {
            title: "สี",
            items: [
                { name: "A4 หน้าเดียว", price: "5 บาท / แผ่น" },
                { name: "A3 หน้าเดียว", price: "10 บาท / แผ่น" },
            ],
        },
        {
            title: "บริการเพิ่มเติม",
            items: [
                { name: "เข้าเล่มสันกาว", price: "40 บาท / เล่ม" },
                { name: "เข้าเล่มห่วง", price: "30 บาท / เล่ม" },
                { name: "เคลือบบัตร", price: "20 บาท / แผ่น" },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-white px-6 py-12">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-[#455a64] mb-10">
                    ตารางราคา
                </h1>

                <div className="grid md:grid-cols-3 gap-6">
                    {pricing.map((section, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition"
                        >
                            <h2 className="text-xl font-bold text-[#06B6D4] mb-4">
                                {section.title}
                            </h2>

                            <ul className="space-y-3">
                                {section.items.map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex justify-between text-sm text-gray-700"
                                    >
                                        <span>{item.name}</span>
                                        <span className="font-semibold text-[#455a64]">
                                            {item.price}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* ปุ่มกลับหน้าหลัก */}
                <div className="text-center mt-10">
                    <a
                        href="/customer"
                        className="inline-block px-6 py-3 bg-[#06B6D4] text-white rounded-xl shadow hover:bg-cyan-600 transition"
                    >
                        กลับหน้าหลัก
                    </a>
                </div>
            </div>
        </div>
    );
}