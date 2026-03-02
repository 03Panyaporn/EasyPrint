import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "ติดตามสถานะ",
}

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
