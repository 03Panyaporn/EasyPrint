import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "สั่งพิมพ์",
}

export default function OrderLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
