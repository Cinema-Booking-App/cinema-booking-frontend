"use client";

import { useState } from "react";
import { Eye, MoreHorizontal, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { User, UserStatus } from "@/types/user";
import { useUpdateUserStatusMutation, useDeleteUserMutation } from "@/store/slices/users/usersApi";

interface UserTableProps {
    users: User[];
    onViewDetails: (user: User) => void;
    getStatusColor: (status: string) => string;
    getStatusIcon: (status: string) => React.ReactNode;
    formatDate: (dateString: string) => string;
}

export function UserTable({
    users = [], // Provide default empty array
    onViewDetails,
    getStatusColor,
    getStatusIcon,
}: UserTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortField, setSortField] = useState<string>("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");


    // Sorting logic
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const sortedUsers = Array.isArray(users) ? [...users].sort((a, b) => {
        if (!sortField) return 0;
        const aValue = a[sortField as keyof User];
        const bValue = b[sortField as keyof User];
        if (typeof aValue === "string" && typeof bValue === "string") {
            return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        if (typeof aValue === "number" && typeof bValue === "number") {
            return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }
        return 0;
    }) : [];

    // Pagination logic
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = sortedUsers.slice(startIndex, endIndex);

    const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
        <TableHead
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-1">
                {children}
                {sortField === field && (
                    sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )
                )}
            </div>
        </TableHead>
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Danh sách người dùng</CardTitle>
                        <CardDescription>
                            Hiển thị {currentUsers.length} người dùng trong tổng số {users.length} người dùng
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Hiển thị:</span>
                        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <SortableHeader field="user_id">Mã người dùng</SortableHeader>
                            <SortableHeader field="full_name">Tên</SortableHeader>
                            <SortableHeader field="email">Email</SortableHeader>
                            <TableHead>Số điện thoại</TableHead>
                            <SortableHeader field="status">Trạng thái</SortableHeader>
                            <SortableHeader field="loyalty_points">Điểm tích lũy</SortableHeader>
                            <TableHead>Vai trò</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <TableRow key={user.user_id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">{user.user_id}</TableCell>
                                    <TableCell>{user.full_name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone || "N/A"}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(user.status)}>
                                            {getStatusIcon(user.status)}
                                            <span className="ml-1">
                                                {user.status === UserStatus.ACTIVE ? "Hoạt động" : user.status === UserStatus.PENDING ? "Đang chờ" : "Không hoạt động"}
                                            </span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.loyalty_points}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 flex-wrap">
                                            {user.roles.map((role) => (
                                                <Badge key={role.role_id} variant="outline">
                                                    {role.role_name === "admin" ? "Quản trị viên" : role.role_name === "staff" ? "Nhân viên" : "Khách hàng"}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => onViewDetails(user)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Xem chi tiết
                                                </DropdownMenuItem>
                                                {/* <DropdownMenuItem
                                                    onClick={() => handleStatusChange(user, user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE)}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    {user.status === UserStatus.ACTIVE ? "Vô hiệu hóa" : "Kích hoạt"}
                                                </DropdownMenuItem> */}
                                                {/* <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(user.user_id)}>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Xóa
                                                </DropdownMenuItem> */}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center">
                                    Không có người dùng nào được tìm thấy.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination UI */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between space-x-2 py-4">
                        <div className="text-sm text-muted-foreground">
                            Hiển thị {startIndex + 1} đến {Math.min(endIndex, users.length)} trong tổng số {users.length} người dùng
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Trước
                            </Button>
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                        className="w-8 h-8 p-0"
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Sau
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}