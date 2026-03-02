import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "จัดการออเดอร์",
}

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
