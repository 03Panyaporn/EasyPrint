import type { Metadata } from "next"

export const metadata: Metadata = {
    title: {
        default: "EasyPrint",
        template: "%s | EasyPrint",
    },
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen bg-gray-50">
            {children}
        </main>
    )
}
