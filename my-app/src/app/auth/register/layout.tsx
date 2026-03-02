import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "สมัครสมาชิก",
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
