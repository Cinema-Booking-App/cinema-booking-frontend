"use client"

import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/store'
import { useGetCurrentUserQuery } from '@/store/slices/auth/authApi'
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
  Heart
} from 'lucide-react'
import { useGetMyTicketsQuery } from "@/store/slices/ticker/tickerApi";
import { useGetCurrentUserQuery } from '@/store/slices/auth/authApi';


export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const { data: myTickets, isLoading: loadingTickets } = useGetMyTicketsQuery();
  const { data: me, isLoading: loadingMe } = useGetCurrentUserQuery();

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
  // Cập nhật userData khi user redux thay đổi
  useEffect(() => {
    if (me) {
      setUserData({
        fullName: me.full_name || "",
        email: me.email || "",
        phone: me.phone || "",
        dateOfBirth: me.date_of_birth || "",
        address: me.address || "",
        avatar: me.avatar_url || "/api/placeholder/100/100",
      });

      setFormData({
        fullName: me.full_name || "",
        email: me.email || "",
        phone: me.phone || "",
        dateOfBirth: me.date_of_birth || "",
        address: me.address || "",
        avatar: me.avatar_url || "/api/placeholder/100/100",
      });
    }
  }, [me]); 


  const [formData, setFormData] = useState(userData)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

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
    const newErrors: {[key: string]: string} = {}

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
                          src={userData.avatar || "/api/placeholder/100/100"}
                          className="w-24 h-24 rounded-full object-cover border"
                        />
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
                        value={isEditing ? formData.fullName : userData.fullName}
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
                        value={isEditing ? formData.email : userData.email}
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
                        value={isEditing ? (formData.phone ?? "") : (userData.phone ?? "")}
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

                  <div className="space-y-4">
                    {myTickets?.map((ticket: any) => (
                      <div
                        key={ticket.ticket_id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {ticket.movie_title}
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium">Rạp:</span>{" "}
                                {ticket.theater_name}
                              </div>
                              <div>
                                <span className="font-medium">Ngày:</span> {ticket.date}
                              </div>
                              <div>
                                <span className="font-medium">Giờ:</span> {ticket.time}
                              </div>
                              <div>
                                <span className="font-medium">Ghế:</span>{" "}
                                {ticket.seat_code}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              {ticket.price ? formatCurrency(ticket.price) : "—"}
                            </div>

                            <Link href={`/myticket/${ticket.ticket_id}`}>
                              <Button variant="outline" size="sm" className="mt-2">
                                Xem vé
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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