"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tag, Percent, Calendar, X, Check } from 'lucide-react'

const samplePromotions = [
    {
        id: 'promo-1',
        title: 'Giảm 20% cho vé buổi sáng',
        description: 'Áp dụng cho tất cả suất chiếu trước 12:00. Áp dụng cho vé thường và vé combo.',
        discount: '20% off',
        code: 'MORN20',
        image: 'https://via.placeholder.com/320x180?text=No+Image',
        validFrom: '2025-11-01',
        validTo: '2025-12-31',
        terms: 'Mỗi tài khoản được sử dụng tối đa 2 mã cho 1 giao dịch. Không áp dụng cùng khuyến mại khác.'
    },
    {
        id: 'promo-2',
        title: 'Combo 2 vé + 1 bắp miễn phí',
        description: 'Mua 2 vé xem phim nhận 1 bắp miễn phí khi dùng mã.',
        discount: 'Combo',
        code: 'COMBOPOP',
        image: 'https://via.placeholder.com/320x180?text=No+Image',
        validFrom: '2025-11-15',
        validTo: '2026-01-31',
        terms: 'Áp dụng cho combo vé thường. Bắp tặng là size M.'
    },
    {
        id: 'promo-3',
        title: 'Giảm 50% cho sinh nhật',
        description: 'Mừng sinh nhật giảm 50% cho thành viên hạng vàng.',
        discount: '50% off',
        code: 'BDAY50',
        image: 'https://via.placeholder.com/320x180?text=No+Image',
        validFrom: '2025-01-01',
        validTo: '2025-12-31',
        terms: 'Cần xác thực sinh nhật trên tài khoản. Chỉ áp dụng cho hạng vàng.'
    }
]

export default function PromotionsPage() {
    const [openPromo, setOpenPromo] = useState<any | null>(null)
    const [copiedCode, setCopiedCode] = useState(null);

    const copyCode = (code: any) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);

        // Reset sau 2 giây nếu muốn
        setTimeout(() => setCopiedCode(null), 1000);
    };


    const formatDate = (d: string) => {
        try {
            const dt = new Date(d)
            return dt.toLocaleDateString('vi-VN')
        } catch {
            return d
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-amber-600">Khuyến mãi & Ưu đãi</h1>
                        <p className="text-sm text-muted-foreground">Các chương trình khuyến mãi hiện có dành cho bạn</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                        <Link href="/" className="text-sm text-amber-500 hover:underline">Trang chủ</Link>
                        <Tag className="w-5 h-5 text-amber-400" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {samplePromotions.map(p => (
                        <Card key={p.id} className="overflow-hidden">
                            <div className="relative w-full h-40 bg-gray-100">
                                <img src={p.image} alt={p.title} className="object-cover w-full h-full" />
                            </div>
                            <CardContent>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-amber-600">{p.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-amber-500">{p.discount}</div>
                                        <div className="text-xs text-muted-foreground">Mã: <span className="font-mono">{p.code}</span></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3 inline-block mr-1" /> {formatDate(p.validFrom)} - {formatDate(p.validTo)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" onClick={() => setOpenPromo(p)}>
                                            Xem chi tiết
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => copyCode(p.code)}
                                            className="flex items-center gap-1"
                                        >
                                            {copiedCode === p.code ? (
                                                <>
                                                    <Check className="w-4 h-4 text-green-600" />
                                                    Đã sao chép
                                                </>
                                            ) : (
                                                'Sao chép mã'
                                            )}
                                        </Button>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {openPromo && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                        onClick={e => { if (e.target === e.currentTarget) setOpenPromo(null) }}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl border w-[640px] max-w-full overflow-hidden relative" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setOpenPromo(null)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 z-10"><X className="w-6 h-6" /></button>
                            <div className="relative w-full h-48">
                                <img src={openPromo.image} alt={openPromo.title} className="object-cover w-full h-full" />
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-amber-600">{openPromo.title}</h2>
                                <p className="text-sm text-muted-foreground mt-2">{openPromo.description}</p>

                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-muted-foreground">Mã khuyến mãi</div>
                                        <div className="font-mono text-lg text-amber-600 mt-1">{openPromo.code}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Thời gian</div>
                                        <div className="text-sm mt-1">{formatDate(openPromo.validFrom)} — {formatDate(openPromo.validTo)}</div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="text-sm font-semibold">Điều khoản</div>
                                    <p className="text-sm text-muted-foreground mt-1">{openPromo.terms}</p>
                                </div>

                                <div className="mt-6 flex items-center gap-3">
                                    <Button onClick={() => copyCode(openPromo.code)}>Sao chép mã</Button>
                                    <Button variant="outline" onClick={() => { setOpenPromo(null); window.location.href = '/' }}>Sử dụng ngay</Button>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
