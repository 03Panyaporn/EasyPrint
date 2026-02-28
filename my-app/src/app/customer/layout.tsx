import Navbar from "@/components/ui/customer/Navbar"
import Footer from "@/components/ui/customer/Footer"

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50">
                {children}
            </main>
            <Footer />
        </>
    )
}