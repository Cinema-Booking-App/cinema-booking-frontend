"use client"

import { useState } from 'react'
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
  LogOut,
  Bell,
  Shield,
  Heart
} from 'lucide-react'
import Logo from '@/components/client/layouts/header/logo'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  
  const [userData, setUserData] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0123456789',
    dateOfBirth: '1990-01-01',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    avatar: '/api/placeholder/100/100'
  })

  const [formData, setFormData] = useState(userData)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Mock booking history data
  const bookingHistory = [
    {
      id: '1',
      movie: 'Avengers: Endgame',
      cinema: 'CGV Aeon Mall',
      date: '2024-01-15',
      time: '19:30',
      seats: ['A1', 'A2'],
      status: 'completed',
      total: 180000
    },
    {
      id: '2',
      movie: 'Spider-Man: No Way Home',
      cinema: 'BHD Star Bitexco',
      date: '2024-01-20',
      time: '20:00',
      seats: ['B5'],
      status: 'upcoming',
      total: 90000
    },
    {
      id: '3',
      movie: 'Black Panther: Wakanda Forever',
      cinema: 'Galaxy Cinema',
      date: '2024-01-10',
      time: '18:00',
      seats: ['C3', 'C4'],
      status: 'completed',
      total: 160000
    }
  ]

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
      console.log('Updating user data:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state
      setUserData(formData)
      setIsEditing(false)
      
      // Show success message
      alert('Cập nhật thông tin thành công!')
      
    } catch (error) {
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
                        <User className="w-12 h-12 text-gray-400" />
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
                        value={isEditing ? formData.phone : userData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={errors.phone ? 'border-red-500' : ''}
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
                        value={isEditing ? formData.dateOfBirth : userData.dateOfBirth}
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
                  <div className="space-y-4">
                    {bookingHistory.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg">{booking.movie}</h3>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium">Rạp:</span> {booking.cinema}
                              </div>
                              <div>
                                <span className="font-medium">Ngày:</span> {booking.date}
                              </div>
                              <div>
                                <span className="font-medium">Giờ:</span> {booking.time}
                              </div>
                              <div>
                                <span className="font-medium">Ghế:</span> {booking.seats.join(', ')}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">{formatCurrency(booking.total)}</div>
                            <Button variant="outline" size="sm" className="mt-2">
                              Chi tiết
                            </Button>
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