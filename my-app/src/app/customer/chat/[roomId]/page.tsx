import ChatWindow from '@/components/chat/ChatWindow'
import { use } from 'react'

export default function CustomerChatPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = use(params)

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen bg-gray-50/30">
            <div className="w-full h-[calc(100vh-120px)] min-h-[600px]">
                <ChatWindow
                    roomId={roomId}
                    senderType="customer"
                    title="EasyPrint Support"
                    hideSidebar
                />
            </div>
        </div>
    )
}
