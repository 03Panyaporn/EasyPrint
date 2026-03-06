"use client";

import { useState, useEffect, useMemo } from "react";
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
    DollarSign, ShoppingCart, Hourglass, Download, TrendingUp,
    CheckCircle, User, Calendar, Filter
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Order {
    id: string;
    created_at: string;
    total_price: number;
    status: string;
    order_items: { file_name: string; file_url: string }[];
}

const STATUS_COMPLETE = "รับแล้ว";
const STATUS_PENDING = ["รอตรวจสอบสลิป", "กำลังดำเนินการ", "เสร็จรอรับ"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n: number) {
    return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function thDate(iso: string) {
    return new Date(iso).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });
}
function dayKey(iso: string) { return iso.split("T")[0]; }
function toYMD(d: Date) { return d.toISOString().split("T")[0]; }

const COLORS = ["#06B6D4", "#f472b6", "#fbbf24", "#34d399", "#a78bfa"];

const PRESETS = [
    { label: "สัปดาห์นี้", days: 7 },
    { label: "เดือนนี้", days: 30 },
    { label: "90 วัน", days: 90 },
];

export default function ReportsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("ร้านค้า");
    const [activePreset, setActivePreset] = useState<number | null>(30);

    // Date range state
    const today = toYMD(new Date());
    const [startDate, setStartDate] = useState(() => {
        const d = new Date(); d.setDate(d.getDate() - 30); return toYMD(d);
    });
    const [endDate, setEndDate] = useState(today);

    // Apply preset
    const applyPreset = (days: number) => {
        const d = new Date(); d.setDate(d.getDate() - days);
        setStartDate(toYMD(d));
        setEndDate(today);
        setActivePreset(days);
    };

    // ── Fetch ────────────────────────────────────────────────────────────────
    useEffect(() => {
        try {
            const u = JSON.parse(sessionStorage.getItem("user") || "{}");
            if (u.name || u.email) setUserName(u.name || u.email);
        } catch { }

        const fetchOrders = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("orders")
                .select("id, created_at, total_price, status, order_items (*)")
                .order("created_at", { ascending: false });
            if (!error && data) setOrders(data as any);
            setLoading(false);
        };

        fetchOrders();
        const ch = supabase.channel("reports-realtime")
            .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, fetchOrders)
            .subscribe();
        return () => { supabase.removeChannel(ch); };
    }, []);

    // ── Filter by date range ─────────────────────────────────────────────────
    const filtered = useMemo(() => {
        const start = new Date(startDate + "T00:00:00");
        const end = new Date(endDate + "T23:59:59");
        return orders.filter(o => {
            const ts = new Date(o.created_at);
            return ts >= start && ts <= end;
        });
    }, [orders, startDate, endDate]);

    // ── KPIs ─────────────────────────────────────────────────────────────────
    const todayStr = new Date().toISOString().split("T")[0];
    const todayRevenue = orders
        .filter(o => dayKey(o.created_at) === todayStr && o.status === STATUS_COMPLETE)
        .reduce((s, o) => s + o.total_price, 0);
    const completedAll = filtered.filter(o => o.status === STATUS_COMPLETE).length;
    const inProgress = filtered.filter(o => STATUS_PENDING.includes(o.status)).length;
    const totalRevenue = filtered
        .filter(o => o.status === STATUS_COMPLETE)
        .reduce((s, o) => s + o.total_price, 0);

    // ── Daily chart data ─────────────────────────────────────────────────────
    const dailyData = useMemo(() => {
        const map: Record<string, { date: string; revenue: number; orders: number }> = {};
        filtered.forEach(o => {
            const k = dayKey(o.created_at);
            if (!map[k]) map[k] = { date: k, revenue: 0, orders: 0 };
            map[k].orders++;
            if (o.status === STATUS_COMPLETE) map[k].revenue += o.total_price;
        });
        return Object.values(map)
            .sort((a, b) => a.date.localeCompare(b.date))
            .map(d => ({
                ...d,
                label: new Date(d.date).toLocaleDateString("th-TH", { month: "short", day: "numeric" }),
            }));
    }, [filtered]);

    // ── Status pie ───────────────────────────────────────────────────────────
    const statusData = useMemo(() => {
        const map: Record<string, number> = {};
        filtered.forEach(o => { map[o.status] = (map[o.status] || 0) + 1; });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [filtered]);

    // ── Table rows ───────────────────────────────────────────────────────────
    const tableRows = useMemo(() => filtered.map(o => ({
        id: `ORD-${o.created_at.split("T")[0].replace(/-/g, "")}-${o.id.slice(0, 4).toUpperCase()}`,
        date: thDate(o.created_at),
        file: o.order_items?.[0]?.file_name || "—",
        price: o.total_price,
        status: o.status,
    })), [filtered]);

    // ── Excel Export ─────────────────────────────────────────────────────────
    const exportExcel = async () => {
        const { utils, writeFile } = await import("xlsx");

        const rangeLabel = `${startDate} ถึง ${endDate}`;

        // Sheet 1: Summary
        const summaryData = [
            ["EasyPrint — รายงานรายได้"],
            [`ช่วงเวลา: ${rangeLabel}`],
            [`ส่งออกเมื่อ: ${new Date().toLocaleDateString("th-TH")}`],
            [],
            ["รายได้วันนี้ (เสร็จสิ้น)", todayRevenue],
            [`รายได้รวม (เสร็จสิ้น) ในช่วง ${rangeLabel}`, totalRevenue],
            ["คำสั่งซื้อเสร็จสิ้น (ในช่วงที่เลือก)", completedAll],
            ["คำสั่งซื้อกำลังดำเนินการ (ในช่วงที่เลือก)", inProgress],
        ];

        // Sheet 2: Orders table
        const headers = ["รหัสออเดอร์", "ประเภท", "ราคา (บาท)", "หมายเหตุ"];
        const rows = tableRows.map(r => [r.id, r.file, r.price, r.status]);
        const totalValue = tableRows.reduce((s, r) => s + r.price, 0);
        const totalRow = ["สรุปยอดเงิน", "", totalValue, ""];

        // Build workbook
        const wb = utils.book_new();

        // Sheet 0: Explanation
        const explainData = [
            ["คำแนะนำการใช้งานไฟล์รายงาน"],
            [""],
            ["ไฟล์นี้ประกอบด้วย 3 แผ่นงาน (Tabs) ดังนี้:"],
            ["1. รายการคำสั่งซื้อ - แสดงรายละเอียดของทุกคำสั่งซื้อในช่วงเวลาที่เลือก พร้อมสรุปยอดเงินรวมบรรทัดสุดท้าย"],
            ["2. สรุป - แสดงภาพรวมรายได้และจำนวนคำสั่งซื้อทั้งหมด"],
            ["3. รายวัน - แสดงข้อมูลสรุปยอดขายและจำนวนคำสั่งซื้อแยกตามแต่ละวัน"]
        ];
        const wsExplain = utils.aoa_to_sheet(explainData);
        wsExplain["!cols"] = [{ wch: 80 }];
        utils.book_append_sheet(wb, wsExplain, "คำอธิบาย");

        const wsOrders = utils.aoa_to_sheet([headers, ...rows, [], totalRow]);
        wsOrders["!cols"] = [{ wch: 28 }, { wch: 30 }, { wch: 15 }, { wch: 20 }];
        utils.book_append_sheet(wb, wsOrders, "รายการคำสั่งซื้อ");

        const wsSummary = utils.aoa_to_sheet(summaryData);
        wsSummary["!cols"] = [{ wch: 36 }, { wch: 20 }];
        utils.book_append_sheet(wb, wsSummary, "สรุป");

        const dailyHeaders = ["วันที่", "รายได้ (บาท)", "จำนวนคำสั่งซื้อ"];
        const dailyRows = dailyData.map(d => [d.date, d.revenue, d.orders]);
        const wsDaily = utils.aoa_to_sheet([dailyHeaders, ...dailyRows]);
        wsDaily["!cols"] = [{ wch: 16 }, { wch: 18 }, { wch: 20 }];
        utils.book_append_sheet(wb, wsDaily, "รายวัน");

        writeFile(wb, `EasyPrint-Report-${startDate}_to_${endDate}.xlsx`);
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="p-8 pb-16 bg-[#F8FAFC] min-h-screen">

            {/* Header */}
            <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold text-[#1e293b]">รายงาน</h1>
                    <p className="text-sm text-gray-400 mt-1">ข้อมูลเชิงลึกผลประกอบการร้านค้า</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-[#455a64]">EasyPrint</p>
                            <p className="text-[11px] text-gray-400">{userName}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#06B6D4] flex items-center justify-center text-white shadow">
                            <User size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-6">

                {/* Date Range Picker */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex flex-wrap items-center gap-4">
                        <Filter size={16} className="text-[#06B6D4]" />
                        <span className="text-sm font-semibold text-gray-600">ช่วงเวลา:</span>

                        {/* Preset buttons */}
                        <div className="flex gap-2">
                            {PRESETS.map(p => (
                                <button
                                    key={p.days}
                                    onClick={() => applyPreset(p.days)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activePreset === p.days
                                        ? "bg-[#06B6D4] text-white shadow-sm"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-xs text-gray-500 font-medium">ตั้งแต่</span>
                            <div className="relative">
                                <div className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white flex items-center justify-between gap-3 min-w-[130px]">
                                    <span>{thDate(startDate + "T00:00:00")}</span>
                                    <Calendar size={14} className="text-[#06B6D4]" />
                                </div>
                                <input
                                    type="date"
                                    value={startDate}
                                    max={endDate}
                                    onChange={e => { setStartDate(e.target.value); setActivePreset(null); }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 z-10"
                                />
                            </div>
                            <span className="text-xs text-gray-500 font-medium">ถึง</span>
                            <div className="relative">
                                <div className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white flex items-center justify-between gap-3 min-w-[130px]">
                                    <span>{thDate(endDate + "T00:00:00")}</span>
                                    <Calendar size={14} className="text-[#06B6D4]" />
                                </div>
                                <input
                                    type="date"
                                    value={endDate}
                                    min={startDate}
                                    max={today}
                                    onChange={e => { setEndDate(e.target.value); setActivePreset(null); }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 z-10"
                                />
                            </div>
                            <button
                                onClick={exportExcel}
                                className="bg-[#06B6D4] hover:bg-[#0891b2] text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                            >
                                <Download size={14} />
                                ส่งออก Excel
                            </button>
                        </div>
                    </div>

                    {/* Range display */}
                    <p className="text-xs text-gray-400 mt-2 pl-6">
                        แสดงข้อมูล: <span className="font-semibold text-[#06B6D4]">{thDate(startDate + "T00:00:00")}</span>
                        {" — "}
                        <span className="font-semibold text-[#06B6D4]">{thDate(endDate + "T00:00:00")}</span>
                        {" "}({filtered.length} รายการ)
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <KPICard icon={<DollarSign size={22} />} label="รายได้วันนี้ (เสร็จสิ้น)" value={`฿${fmt(todayRevenue)}`} accent="#06B6D4" loading={loading} />
                    <KPICard icon={<TrendingUp size={22} />} label="รายได้รวม (ช่วงที่เลือก)" value={`฿${fmt(totalRevenue)}`} accent="#a78bfa" loading={loading} />
                    <KPICard icon={<CheckCircle size={22} />} label="คำสั่งซื้อเสร็จสิ้น" value={`${completedAll} รายการ`} accent="#34d399" loading={loading} />
                    <KPICard icon={<Hourglass size={22} />} label="กำลังดำเนินการ" value={`${inProgress} รายการ`} accent="#fbbf24" loading={loading} />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Bar Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-[#1e293b] font-bold text-[15px] flex items-center gap-2 mb-6">
                            <TrendingUp size={18} className="text-[#06B6D4]" />
                            รายได้รายวัน (บาท)
                        </h3>
                        {loading ? <Skeleton h={280} /> : dailyData.length === 0 ? (
                            <EmptyChart />
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={dailyData} barSize={18}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `฿${v.toLocaleString()}`} />
                                    <Tooltip formatter={(v: any) => [`฿${fmt(v)}`, "รายได้"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                                    <Bar dataKey="revenue" fill="#06B6D4" radius={[6, 6, 0, 0]} name="รายได้ (บาท)" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Status Pie */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                        <h3 className="text-[#1e293b] font-bold text-[15px] flex items-center gap-2 mb-4">
                            <ShoppingCart size={18} className="text-pink-400" />
                            สัดส่วนสถานะ
                        </h3>
                        {loading ? <Skeleton h={220} /> : statusData.length === 0 ? <EmptyChart /> : (
                            <>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                                            {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip formatter={(v: any) => v} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-2 space-y-1.5">
                                    {statusData.map((d, i) => (
                                        <div key={d.name} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                                                <span className="text-gray-600 text-[12px]">{d.name}</span>
                                            </div>
                                            <span className="font-bold text-[#1e293b] text-[12px]">{d.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Orders Line chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-[#1e293b] font-bold text-[15px] mb-6 flex items-center gap-2">
                        <Calendar size={18} className="text-[#06B6D4]" />
                        จำนวนคำสั่งซื้อรายวัน
                    </h3>
                    {loading ? <Skeleton h={200} /> : dailyData.length === 0 ? <EmptyChart /> : (
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                                <Line type="monotone" dataKey="orders" stroke="#f472b6" strokeWidth={2.5} dot={{ r: 3, fill: "#f472b6" }} name="คำสั่งซื้อ" />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-[#1e293b] font-bold text-[15px]">ตารางข้อมูล</h3>
                        <span className="text-xs text-gray-400">{tableRows.length} รายการ</span>
                    </div>
                    {loading ? (
                        <div className="p-6"><Skeleton h={200} /></div>
                    ) : tableRows.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 text-sm">ไม่มีข้อมูลในช่วงเวลาที่เลือก</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-[#f8fafc] text-gray-500 text-[12px] font-bold uppercase tracking-wider">
                                        <th className="px-6 py-4 text-left">รหัส</th>
                                        <th className="px-6 py-4 text-left">วันที่</th>
                                        <th className="px-6 py-4 text-left">ไฟล์</th>
                                        <th className="px-6 py-4 text-right">ราคา</th>
                                        <th className="px-6 py-4 text-center">สถานะ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {tableRows.map((row, i) => (
                                        <tr key={i} className="hover:bg-[#f0f9ff] transition-colors">
                                            <td className="px-6 py-4 font-mono text-[12px] text-gray-500">{row.id}</td>
                                            <td className="px-6 py-4 text-gray-600">{row.date}</td>
                                            <td className="px-6 py-4 text-gray-700 max-w-[200px] truncate">{row.file}</td>
                                            <td className="px-6 py-4 text-right font-semibold text-[#1e293b]">฿{fmt(row.price)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <StatusBadge status={row.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-[#f8fafc] border-t-2 border-gray-100">
                                        <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-600">รวมรายได้ (เสร็จสิ้น)</td>
                                        <td className="px-6 py-4 text-right font-bold text-[#06B6D4] text-base">
                                            ฿{fmt(tableRows.filter(r => r.status === STATUS_COMPLETE).reduce((s, r) => s + r.price, 0))}
                                        </td>
                                        <td />
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function KPICard({ icon, label, value, accent, loading }: { icon: React.ReactNode; label: string; value: string; accent: string; loading: boolean }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start justify-between relative overflow-hidden">
            <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-md" style={{ background: accent }} />
            <div className="pl-2">
                <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
                {loading ? <div className="h-8 w-32 bg-gray-100 animate-pulse rounded-lg" /> : (
                    <h3 className="text-2xl font-bold text-[#1e293b]">{value}</h3>
                )}
            </div>
            <div className="w-11 h-11 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm" style={{ color: accent }}>
                {icon}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        "รับแล้ว": "bg-gray-100 text-gray-600",
        "กำลังดำเนินการ": "bg-cyan-50 text-cyan-600",
        "เสร็จรอรับ": "bg-green-50 text-green-600",
        "รอตรวจสอบสลิป": "bg-yellow-50 text-yellow-600",
        "ยกเลิก": "bg-red-50 text-red-500",
    };
    const cls = map[status] || "bg-gray-100 text-gray-500";
    return <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${cls}`}>{status}</span>;
}

function Skeleton({ h }: { h: number }) {
    return <div className="rounded-xl bg-gray-100 animate-pulse" style={{ height: h }} />;
}

function EmptyChart() {
    return (
        <div className="flex flex-col items-center justify-center h-40 text-gray-300">
            <ShoppingCart size={36} strokeWidth={1} />
            <p className="text-sm mt-2">ไม่มีข้อมูลในช่วงที่เลือก</p>
        </div>
    );
}
