import ChatWindow from '@/components/chat/ChatWindow'
import { use } from 'react'

export default function CustomerChatPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = use(params)

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#f1f5f9] p-4 sm:p-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-[1600px] h-[850px] max-h-[calc(100vh-180px)]">
                <ChatWindow
                    roomId={roomId}
                    senderType="customer"
                    title="EasyPrint Support (Official)"
                />
            </div>
        </div>
    )
}
