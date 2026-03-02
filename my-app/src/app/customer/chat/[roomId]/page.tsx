import ChatWindow from '@/components/chat/ChatWindow'
import { use } from 'react'

export default function CustomerChatPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = use(params)

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 px-2">แชทกับร้านค้า</h1>
                <ChatWindow
                    roomId={roomId}
                    senderType="customer"
                    title="EasyPrint Support"
                />
            </div>
        </div>
    )
}
