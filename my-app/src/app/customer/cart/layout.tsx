import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "ตะกร้าสินค้า",
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
