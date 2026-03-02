import type { Metadata } from "next"
import Navbar from "@/components/ui/customer/Navbar"
import Footer from "@/components/ui/customer/Footer"
import { CartProvider } from "@/context/CartContext"

export const metadata: Metadata = {
    title: {
        default: "หน้าแรก",
        template: "%s | EasyPrint",
    },
}

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <CartProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50">
                {children}
            </main>
            <Footer />
        </CartProvider>
    )
}