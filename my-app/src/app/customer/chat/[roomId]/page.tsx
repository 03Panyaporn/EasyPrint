import ChatWindow from '@/components/chat/ChatWindow'
import { use } from 'react'

export default function CustomerChatPage({
    params,
    searchParams
}: {
    params: Promise<{ roomId: string }>,
    searchParams: Promise<{ message?: string }>
}) {
    const { roomId } = use(params)
    const { message } = use(searchParams)

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen bg-gray-50/30">
            <div className="w-full h-[calc(100vh-120px)] min-h-[600px]">
                <ChatWindow
                    roomId={roomId}
                    senderType="customer"
                    title="EasyPrint Support"
                    hideSidebar
                    initialMessage={message}
                />
            </div>
        </div>
    )
}
