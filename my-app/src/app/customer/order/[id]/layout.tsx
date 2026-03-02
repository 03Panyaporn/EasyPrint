import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "รายละเอียดออเดอร์",
}

export default function OrderDetailLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
