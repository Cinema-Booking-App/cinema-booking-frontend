// src/app/(admin)/admin/cinemas/components/CinemaDetailManagement.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Clock,
  LayoutGrid,
  MonitorPlay,
  DoorOpen,
  Users,
  Film,
  Building,
} from 'lucide-react';
import { CombinedTheater } from '@/types/theaters';

// Props cho component CinemaDetailManagement
interface CinemaDetailManagementProps {
  theaters: CombinedTheater; // Đổi tên từ selectedCinema thành cinema cho rõ ràng hơn trong component này
  onBackToList: () => void;
  // Bạn có thể thêm các hàm onUpdateCinema, onAddRoom, onEditRoom, onDeleteRoom ở đây
}

const CinemaDetailManagement: React.FC<CinemaDetailManagementProps> = ({ theaters, onBackToList }) => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Building className="w-10 h-10 text-foreground" />
        <h1 className="text-4xl font-bold ">Quản lý Rạp phim: {theaters.name}</h1>
      </div>

      <Button variant="outline" className="mb-6" onClick={onBackToList}>
        <Film className="w-4 h-4 mr-2" />
        Quay lại Danh sách Rạp
      </Button>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto mb-6">
          <TabsTrigger value="general">
            <Film className="w-4 h-4 mr-2" />
            Thông tin Rạp
          </TabsTrigger>
          <TabsTrigger value="rooms">
            <MonitorPlay className="w-4 h-4 mr-2" />
            Quản lý Phòng chiếu
          </TabsTrigger>
        </TabsList>

        {/* Tab Thông tin Rạp */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Building className="w-6 h-6" />
                {theaters.name}
              </CardTitle>
              <CardDescription>Cập nhật thông tin tổng quan của rạp.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cinemaName">Tên rạp</Label>
                  <Input id="cinemaName" defaultValue={theaters.name} />
                </div>
                <div>
                  <Label htmlFor="cinemaAddress">Địa chỉ</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="cinemaAddress" defaultValue={theaters.address} className="pl-8" />
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cinemaPhone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="cinemaPhone" defaultValue={theaters.phone} className="pl-8" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cinemaHours">Giờ mở cửa/đóng cửa</Label>
                  <div className="relative">
                    <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    {/* <Input id="cinemaHours" defaultValue={cinema.openingHours} className="pl-8" /> */}
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="cinemaDescription">Mô tả</Label>
                {/* <Textarea id="cinemaDescription" defaultValue={cinema.description} rows={4} /> */}
              </div>
              <div>
                <Label htmlFor="cinemaImage">URL Hình ảnh/Logo rạp</Label>
                {/* <Input id="cinemaImage" defaultValue={cinema.imageUrl} /> */}
                {/* {cinema.imageUrl && (
                  <img src={cinema.imageUrl} alt="Hình ảnh rạp" className="mt-4 rounded-md shadow-sm max-w-full h-auto" />
                )} */}
              </div>
              <Button className="mt-4">
                <Edit className="w-4 h-4 mr-2" />
                Cập nhật thông tin rạp
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Quản lý Phòng chiếu */}
        <TabsContent value="rooms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MonitorPlay className="w-6 h-6" />
                Quản lý các Phòng chiếu
              </CardTitle>
              <CardDescription>Thêm, chỉnh sửa hoặc xóa các phòng chiếu của rạp {theaters.name}.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm Phòng mới
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID Phòng</TableHead>
                    <TableHead>Tên Phòng</TableHead>
                    <TableHead>Loại Phòng</TableHead>
                    <TableHead className="text-center">Sức chứa</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {theaters.rooms && theaters.rooms.length > 0 ? (
                    theaters.rooms.map((room) => (
                      <TableRow key={room.room_id}>
                        <TableCell className="font-medium">{room.room_id}</TableCell>
                        <TableCell>{room.room_name}</TableCell>
                        {/* <TableCell>{room.type}</TableCell> */}
                        <TableCell className="text-center">
                          <Users className="inline-block w-4 h-4 mr-1 text-muted-foreground" />
                          {/* {room.capacity} */}
                        </TableCell>
                        <TableCell>
                          {/* <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              room.status === 'Hoạt động'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            <DoorOpen className="w-3 h-3 mr-1" />
                            {/* {room.status} */}
                          {/* </span> */} 
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="mr-2" title="Chỉnh sửa phòng">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="mr-2" title="Quản lý sơ đồ ghế">
                            <LayoutGrid className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" title="Xóa phòng">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Rạp này chưa có phòng chiếu nào.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CinemaDetailManagement;