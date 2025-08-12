"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  LayoutGrid,
  MonitorPlay,
  DoorOpen,
  Film,
  Building,
} from 'lucide-react';
import { CombinedTheater } from '@/types/theaters';
import { RoomForm } from '../rooms/room-form';

interface TheaterDetailManagementProps {
  theaters: CombinedTheater;
  onBackToList: () => void;
}

const TheaterDetailManagement: React.FC<TheaterDetailManagementProps> = ({ theaters, onBackToList }) => {
  const [showAddRoom, setShowAddRoom] = useState(false);
  console.log(theaters)
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
                  <Label htmlFor="theaterName">Tên rạp</Label>
                  <Input id="theaterName" defaultValue={theaters.name} />
                </div>
                <div>
                  <Label htmlFor="theaterAddress">Địa chỉ</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="theaterAddress" defaultValue={theaters.address} className="pl-8" />
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theaterPhone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="theaterPhone" defaultValue={theaters.phone} className="pl-8" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="theaterCity">Thành phố</Label>
                  <div className="relative">
                    <Input id="theaterCity" defaultValue={theaters.city} className="pl-8" />
                  </div>
                </div>
              </div>
              <Button className="mt-4">
                <Edit className="w-4 h-4 mr-2" />
                Cập nhật thông tin rạp
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

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
                <Button onClick={() => setShowAddRoom(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm Phòng mới
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* Bỏ khoảng trắng giữa các thẻ để tránh lỗi */}
                    <TableHead className="w-[100px]">ID Phòng</TableHead>
                    <TableHead>Tên Phòng</TableHead>
                    <TableHead>Loại Phòng</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {theaters.rooms && theaters.rooms.length > 0 ? (
                    theaters.rooms.map((room) => (
                      <TableRow key={room.room_id}>
                        {/* Bỏ khoảng trắng giữa các thẻ để tránh lỗi */}
                        <TableCell className="font-medium">ROOM{room.room_id}</TableCell>
                        <TableCell>{room.room_name}</TableCell>
                        <TableCell>{'2D'}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${room.room_status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {room.room_status === 'active' ? 'Đang hoạt động' : 'Đã dừng hoạt động'}
                          </span>
                        </TableCell><TableCell className="text-right">
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
      <RoomForm
        showAddRoom={showAddRoom}
        setShowAddRoom={setShowAddRoom}
        theaterId={theaters.theater_id}
      />

    </div>
  );
};

export default TheaterDetailManagement;
