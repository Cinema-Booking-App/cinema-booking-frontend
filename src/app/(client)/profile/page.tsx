// State cho dialog chi tiết booking
"use client"

import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/store'
import { setUser } from '@/store/slices/auth/authSlide'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
 import {
   User,
   Mail,
   Phone,
   Calendar,
   MapPin,
   Edit,
   Save,
   X,
   Camera,
   CreditCard,
   Ticket,
   Settings,
   Bell,
   Shield,
   Heart,
   Crown
 } from 'lucide-react'
import { useGetMyTicketsQuery } from "@/store/slices/ticker/tickerApi";
import { useGetCurrentUserQuery } from '@/store/slices/auth/authApi';


export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [openBooking, setOpenBooking] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const { data: myTickets, isLoading: loadingTickets } = useGetMyTicketsQuery();
  const { data: me} = useGetCurrentUserQuery();

  // Populate local form state from API user data when available
  useEffect(() => {
    if (me) {
      const mapped = {
        fullName: (me.full_name) ?? "",
        email: me.email ?? "",
        phone: me.phone_number ?? "",
        dateOfBirth: "",
        address:  "",
        avatar: me.avatar || "/api/placeholder/100/100"
      };
      setFormData(mapped);
    }
  }, [me]);


  // Lấy user từ redux
  const user = useAppSelector(state => state.auth.user);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const token = useAppSelector(state => state.auth.token) || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Nếu chưa đăng nhập, chuyển hướng về trang login
  useEffect(() => {
    if (!isAuthenticated && !token) {
      router.replace('/login');
    }
  }, [isAuthenticated, token, router]);

  // Ensure we fetch current user from API if token exists but Redux user not set
  const { data: currentUserData, isLoading: isFetchingUser, isSuccess: isFetchSuccess } = useGetCurrentUserQuery(undefined, { skip: !token });
  useEffect(() => {
    if (isFetchSuccess && currentUserData) {
      // Normalize and set into redux if not already present
      dispatch(setUser({
        ...currentUserData,
        status: (currentUserData as any).status
      } as any));
    }
  }, [isFetchSuccess, currentUserData, dispatch]);
  // Nếu chưa có user (chưa đăng nhập hoặc đang loading), có thể show loading hoặc redirect
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    avatar: "/api/placeholder/100/100"
  });


  const [formData, setFormData] = useState(userData)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Mock booking history data


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên là bắt buộc'
    }

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.phone) {
      newErrors.phone = 'Số điện thoại là bắt buộc'
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // TODO: Implement actual API call to update user data      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update local state
      setUserData(formData)
      setIsEditing(false)

      // Show success message
      alert('Cập nhật thông tin thành công!')

    } catch {
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(userData)
    setErrors({})
    setIsEditing(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { text: 'Đã xem', className: 'bg-green-100 text-green-800' },
      upcoming: { text: 'Sắp xem', className: 'bg-destructive/10 text-destructive' },
      cancelled: { text: 'Đã hủy', className: 'bg-red-100 text-red-800' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.text}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline  text-amber-400">Hồ sơ</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center space-x-2">
                <Ticket className="w-4 h-4  text-amber-400" />
                <span className="hidden sm:inline  text-amber-400">Lịch sử đặt vé</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center space-x-2">
                <Heart className="w-4 h-4  text-amber-400" />
                <span className="hidden sm:inline  text-amber-400">Yêu thích</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="w-4 h-4  text-amber-400" />
                <span className="hidden sm:inline  text-amber-400">Cài đặt</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Thông tin cá nhân</CardTitle>
                      <CardDescription>
                        Quản lý thông tin tài khoản của bạn
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button className='text-destructive' onClick={() => setIsEditing(true)} variant="outline">
                        <Edit className="w-4 h-4 mr-2 " />
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={handleSave} disabled={isLoading}>
                          <Save className="w-4 h-4 mr-2" />
                          {isLoading ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                        <Button onClick={handleCancel} variant="outline">
                          <X className="w-4 h-4 mr-2" />
                          Hủy
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <img
                          src={"https://th.bing.com/th/id/OIP.kUFzwD5-mfBV0PfqgI5GrAHaHa?w=192&h=192&c=7&r=0&o=7&pid=1.7&rm=3"}
                          className="w-24 h-24 rounded-full object-cover border"
                        />
                                                {/* Vương miện theo hạng */}
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
                                                  <Crown
                                                    className="w-8 h-8 drop-shadow"
                                                    style={{ color: '#FFD700' }}
                                                  />
                                                </span>
                        {/* <img
                          src={userData.avatar || "https://th.bing.com/th/id/OIP.kUFzwD5-mfBV0PfqgI5GrAHaHa?w=192&h=192&c=7&r=0&o=7&pid=1.7&rm=3"}
                          className="w-24 h-24 rounded-full object-cover border"
                        /> */}
                      </div>
                      {isEditing && (
                        <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                          <Camera className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{userData.fullName}</h3>
                      <p className="text-muted-foreground">{userData.email}</p>
                      {/* Card điểm tích lũy và hạng */}
                      <div className="mt-2 flex gap-4">
                        <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-blue-400" />
                          <span className="font-semibold text-blue-700">Điểm tích lũy: 1000</span>
                          {/* <span className="font-bold text-blue-900">{me?.loyalty_points ?? user?.loyalty_points ?? 0}</span> */}
                        </div>
                        <div className="px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-yellow-500" />
                          <span className="font-semibold text-yellow-700">Hạng: GOLD</span>
                          {/* <span className="font-bold text-yellow-900">{me?.rank ?? user?.rank ?? "Chưa có hạng"}</span> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Họ và tên
                      </label>
                      <Input
                        name="fullName"
                        value={isEditing ? formData.fullName : (me?.full_name ?? "")}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={errors.fullName ? 'border-red-500' : ''}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-600">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={isEditing ? formData.email : (me?.email ?? "")}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Số điện thoại
                      </label>
                      <Input
                        name="phone"
                        value={isEditing ? (formData.phone ?? "") : (me?.phone_number ?? "")}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />

                      {errors.phone && (
                        <p className="text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Ngày sinh
                      </label>
                      <Input
                        name="dateOfBirth"
                        type="date"
                        value={isEditing ? (formData.dateOfBirth ?? "") : (userData.dateOfBirth ?? "")}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Địa chỉ
                      </label>
                      <Input
                        name="address"
                        value={isEditing ? formData.address : userData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử đặt vé</CardTitle>
                  <CardDescription>
                    Xem lại các vé đã đặt và trạng thái của chúng
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {loadingTickets && (
                    <p className="py-6 text-center text-muted-foreground">Đang tải...</p>
                  )}

                  {!loadingTickets && (!myTickets || myTickets.length === 0) && (
                    <p className="py-6 text-center text-muted-foreground">
                      Bạn chưa đặt vé nào.
                    </p>
                  )}

                  <div className="space-y-6">
                    {myTickets?.map((b: any) => (
                      <div
                        key={b.booking_code}
                        className="relative flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 group hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => setOpenBooking(b)}
                      >
                        {/* Poster phim */}
                        <div className="md:w-40 w-full md:h-auto h-48 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                          <img
                            src={b.poster_url || "/api/placeholder/120x180"}
                            alt={b.movie_title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        {/* Thông tin booking */}
                        <div className="flex-1 flex flex-col md:flex-row">
                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-lg text-amber-600 flex items-center gap-2">
                                  <Ticket className="w-5 h-5 inline-block text-amber-400" />
                                  {b.movie_title}
                                </h3>
                                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded border border-dashed border-amber-300 text-amber-600">
                                  #{b.booking_code}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700 mb-2">
                                <div>
                                  <span className="font-medium">Rạp:</span> {b.theater_name}
                                </div>
                                <div>
                                  <span className="font-medium">Phòng:</span> {b.room}
                                </div>
                                <div>
                                  <span className="font-medium">Ghế:</span> <span className="font-bold text-base text-amber-600">{b.seats?.join(", ")}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Ngày:</span> {b.date}
                                </div>
                                <div>
                                  <span className="font-medium">Giờ:</span> {b.time}
                                </div>
                                <div>
                                  <span className="font-medium">Thành phố:</span> {b.theater_city}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Đường cắt răng cưa */}
                          <div className="hidden md:block w-6 relative">
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px h-full border-l-2 border-dashed border-gray-300"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dialog chi tiết booking */}
                  {openBooking && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                      onClick={e => {
                        if (e.target === e.currentTarget) setOpenBooking(null);
                      }}
                    >
                      <div className="bg-white rounded-2xl shadow-2xl border w-[400px] max-w-full overflow-hidden animate-fadeIn relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setOpenBooking(null)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl font-bold z-10">×</button>
                        <div className="relative w-full h-60">
                          <img
                            src={openBooking.poster_url || "/api/placeholder/120x180"}
                            alt={openBooking.movie_title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="flex items-center justify-between mb-2">
                            <h1 className="text-xl font-bold text-red-600 flex items-center gap-2">
                              <Ticket className="w-5 h-5 text-amber-400" />
                              {openBooking.movie_title}
                            </h1>
                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded border border-dashed border-amber-300 text-amber-600">
                              #{openBooking.booking_code}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-2">
                            <div><span className="font-medium">Rạp:</span> {openBooking.theater_name}</div>
                            <div><span className="font-medium">Phòng:</span> {openBooking.room}</div>
                            <div><span className="font-medium">Ngày:</span> {openBooking.date}</div>
                            <div><span className="font-medium">Giờ:</span> {openBooking.time}</div>
                            <div><span className="font-medium">Thành phố:</span> {openBooking.theater_city}</div>
                            <span className="font-medium flex">Ghế: <span className="ml-2 text-amber-600">{openBooking.seats?.join(", ")}</span></span> 

                          </div>
                          {/* Hiển thị mã QR nếu backend trả `qr_code` ở cấp booking */}
                          {openBooking.qr_code && (
                            <div className="flex flex-col items-center mb-4">
                              <div className="font-semibold mb-1">Mã QR vé:</div>
                              <img
                                src={`data:image/png;base64,${openBooking.qr_code}`}
                                alt="QR vé"
                                className="w-40 h-40 mx-auto border rounded-lg"
                              />
                            </div>
                          )}
                          {/* Danh sách vé/ghế chi tiết */}
                          {openBooking.tickets && openBooking.tickets.length > 0 && (
                            <div className="mt-4">
                              <div className="font-semibold mb-2">Danh sách vé:</div>
                              <table className="w-full text-sm border">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="py-1 px-2 border">Ghế</th>
                                    <th className="py-1 px-2 border">Loại</th>
                                    <th className="py-1 px-2 border">Giá</th>
                                    <th className="py-1 px-2 border">Trạng thái</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {openBooking.tickets.map((tk: any) => (
                                    <tr key={tk.ticket_id}>
                                      <td className="py-1 px-2 border text-center">{tk.seat}</td>
                                      <td className="py-1 px-2 border text-center">{tk.type || '-'}</td>
                                      <td className="py-1 px-2 border text-center">{tk.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tk.price) : '-'}</td>
                                      <td className="py-1 px-2 border text-center">{tk.status || '-'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Phim yêu thích</CardTitle>
                  <CardDescription>
                    Danh sách các bộ phim bạn đã thêm vào yêu thích
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Bạn chưa có phim yêu thích nào</p>
                    <Button asChild className="mt-4">
                      <Link href="/">
                        Khám phá phim mới
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="w-4 h-4 mr-2" />
                      Thông báo
                    </CardTitle>
                    <CardDescription>
                      Quản lý cài đặt thông báo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Thông báo email</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Thông báo SMS</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Thông báo khuyến mãi</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Bảo mật
                    </CardTitle>
                    <CardDescription>
                      Cài đặt bảo mật tài khoản
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Thay đổi mật khẩu
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Bảo mật hai lớp
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 