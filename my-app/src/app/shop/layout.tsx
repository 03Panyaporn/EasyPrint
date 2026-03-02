import type { Metadata } from "next"
import Sidebar from "@/components/ui/shop/Sidebar"

export const metadata: Metadata = {
    title: {
        default: "แดชบอร์ดร้านค้า",
        template: "%s | EasyPrint",
    },
}

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <main className="ml-[240px] min-h-screen">
                {children}
            </main>
        </div>
    )
}
