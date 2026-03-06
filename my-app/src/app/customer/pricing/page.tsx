"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Loader2, ArrowLeft } from "lucide-react"

interface Service {
    id: string
    name: string
    category: string
    base_price: number
    unit: string
    options?: {
        colors?: { name: string; price: number }[]
    }
}

interface GroupedService {
    title: string
    items: { name: string; price: string }[]
}

export default function PricingPage() {
    const [groupedServices, setGroupedServices] = useState<GroupedService[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .eq('merchant_id', 'b9652bb2-cba5-4440-9d89-0f93f598cb67')
                    .eq('status', 'ใช้งาน')
                    .order('category', { ascending: true })

                if (error) throw error

                if (data) {
                    const services: Service[] = data
                    const groups: { [key: string]: { name: string; price: string }[] } = {}

                    services.forEach(service => {
                        const category = service.category || "อื่นๆ"
                        if (!groups[category]) {
                            groups[category] = []
                        }

                        const colors = service.options?.colors || []
                        if (colors.length > 0) {
                            colors.forEach(color => {
                                const totalPrice = Number(service.base_price || 0) + Number(color.price || 0)
                                groups[category].push({
                                    name: `${service.name} (${color.name})`,
                                    price: `${totalPrice} บาท / ${service.unit || 'ชิ้น'}`
                                })
                            })
                        } else {
                            groups[category].push({
                                name: service.name,
                                price: `${service.base_price} บาท / ${service.unit || 'ชิ้น'}`
                            })
                        }
                    })

                    const formattedGroups = Object.keys(groups).map(title => ({
                        title,
                        items: groups[title]
                    }))

                    setGroupedServices(formattedGroups)
                }
            } catch (error) {
                console.error("Error fetching pricing:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchServices()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-white px-6 py-12">
            <div className="max-w-5xl mx-auto">
                <div className="relative mb-12">

                    <h1 className="text-3xl font-extrabold text-center text-[#455a64] tracking-tight">
                        ราคาค่าบริการ <span className="text-[#06B6D4]">EASYPRINT</span>
                    </h1>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-[#06B6D4] animate-spin mb-4" />
                        <p className="text-[#90a4ae] font-medium">กำลังโหลดข้อมูลราคา...</p>
                    </div>
                ) : groupedServices.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {groupedServices.map((section, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-[24px] shadow-sm border border-[#eaf6f8] p-5 hover:shadow-xl hover:shadow-[#06B6D4]/5 hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-2 h-8 bg-[#06B6D4] rounded-full" />
                                    <h2 className="text-xl font-bold text-[#455a64]">
                                        {section.title}
                                    </h2>
                                </div>

                                <ul className="space-y-4">
                                    {section.items.map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex justify-between items-start gap-4 text-sm group/item"
                                        >
                                            <span className="text-[#607d8b] font-medium leading-tight group-hover/item:text-[#455a64] transition-colors">{item.name}</span>
                                            <div className="flex-1 border-b border-dotted border-gray-200 mt-3" />
                                            <span className="font-bold text-[#06B6D4] whitespace-nowrap bg-[#E0F7FA] px-2 py-0.5 rounded text-[13px]">
                                                {item.price}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <p className="text-[#90a4ae]">ยังไม่มีข้อมูลราคาค่าบริการในขณะนี้</p>
                    </div>
                )}

                <div className="mt-16 text-center">
                    <p className="text-[#90a4ae] text-sm mb-6">
                        * ราคาอาจมีการเปลี่ยนแปลงตามความละเอียดงานและความเร่งด่วน<br />
                        กรุณาสอบถามพนักงานเพื่อความแน่ใจอีกครั้ง
                    </p>

                </div>
            </div>
        </div>
    )
}
