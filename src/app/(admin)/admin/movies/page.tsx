"use client"
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import MoviePoster from "@/components/admin/movies/movie-poster";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MovieForm from "@/components/admin/movies/movie-form";

const GENRES = [
    "Tất cả",
    "Hành động",
    "Khoa học viễn tưởng",
    "Tâm lý, Kịch tính",
];
const STATUS = ["Tất cả", "Đang chiếu", "Sắp chiếu", "Ngừng chiếu"];

const MOVIES = [
    {
        id: 1,
        title: "Avengers: Endgame",
        genre: "Hành động",
        country: "Mỹ",
        releaseDate: "2019-04-26",
        duration: 181,
        director: "Anthony & Joe Russo",
        actors: "Robert Downey Jr., Chris Evans, Mark Ruffalo",
        description: "Các siêu anh hùng còn lại hợp lực để đảo ngược hành động của Thanos và khôi phục vũ trụ.",
        poster: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg",
        status: "Đang chiếu",
        format: "IMAX 3D",
    },
    {
        id: 2,
        title: "Inception",
        genre: "Khoa học viễn tưởng",
        country: "Mỹ",
        releaseDate: "2010-07-16",
        duration: 148,
        director: "Christopher Nolan",
        actors: "Leonardo DiCaprio, Joseph Gordon-Levitt",
        description: "Một kẻ trộm xâm nhập vào giấc mơ để đánh cắp bí mật và thực hiện nhiệm vụ cấy ý tưởng.",
        poster: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg",
        status: "Ngừng chiếu",
        format: "2D",
    },
    {
        id: 3,
        title: "Parasite",
        genre: "Tâm lý, Kịch tính",
        country: "Hàn Quốc",
        releaseDate: "2019-05-30",
        duration: 132,
        director: "Bong Joon-ho",
        actors: "Song Kang-ho, Lee Sun-kyun",
        description: "Một gia đình nghèo dần dần xâm nhập vào cuộc sống của một gia đình giàu có.",
        poster: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png",
        status: "Đang chiếu",
        format: "2D",
    },
    {
        id: 4,
        title: "Elemental",
        genre: "Hoạt hình",
        country: "Mỹ",
        releaseDate: "2023-06-16",
        duration: 101,
        director: "Peter Sohn",
        actors: "Leah Lewis, Mamoudou Athie",
        description: "Câu chuyện về các nguyên tố lửa, nước, đất, khí sống chung trong một thành phố.",
        poster: "https://upload.wikimedia.org/wikipedia/en/2/2d/Elemental_%28film%29.png",
        status: "Sắp chiếu",
        format: "3D",
    },
];

const PAGE_SIZE = 2;

export default function ManagementMovies() {
    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("Tất cả");
    const [status, setStatus] = useState("Tất cả");
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [movies, setMovies] = useState(MOVIES);
    const [form, setForm] = useState({
        title: "",
        poster: "",
        genre: "",
        country: "",
        releaseDate: "",
        status: "Đang chiếu",
        format: "2D",
    });

    // Lọc và tìm kiếm
    const filteredMovies = useMemo(() => {
        return movies.filter((movie) => {
            const matchTitle = movie.title.toLowerCase().includes(search.toLowerCase());
            const matchGenre = genre === "Tất cả" || movie.genre === genre;
            const matchStatus = status === "Tất cả" || movie.status === status;
            return matchTitle && matchGenre && matchStatus;
        });
    }, [search, genre, status, movies]);

    // Phân trang
    const pagedMovies = filteredMovies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="p-2 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h1 className="text-xl sm:text-2xl font-bold">Quản lý phim</h1>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button onClick={() => setOpen(true)} className="bg-destructive">Thêm phim mới</Button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="w-full max-w-full h-screen overflow-y-auto sm:max-w-sm sm:w-[600px] md:max-w-md md:w-[800px] lg:max-w-lg lg:w-[1000px] xl:max-w-xl xl:w-[1200px]"
                    >
                        <SheetHeader>
                            <SheetTitle>Thêm phim mới</SheetTitle>
                        </SheetHeader>
                        <MovieForm
                            form={form}
                            setForm={setForm}
                            setMovies={setMovies}
                            movies={movies}
                            setOpen={setOpen}
                        />
                    </SheetContent>
                </Sheet>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm tên phim..."
                    className="border rounded px-3 py-2 min-w-[180px] w-full sm:w-auto"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
                <Select value={genre} onValueChange={value => { setGenre(value); setPage(1); }}>
                    <SelectTrigger className="min-w-[200px] w-60 bg-background text-foreground">
                        <SelectValue placeholder="Chọn thể loại" />
                    </SelectTrigger>
                    <SelectContent className="bg-background text-foreground">
                        {GENRES.map(g => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={status} onValueChange={value => { setStatus(value); setPage(1); }}>
                    <SelectTrigger className="min-w-[200px] w-60 bg-background text-foreground">
                        <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="bg-background text-foreground">
                        {STATUS.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="w-full overflow-x-auto">
                <Table className="min-w-[700px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Poster</TableHead>
                            <TableHead>Tên phim</TableHead>
                            <TableHead>Thể loại</TableHead>
                            <TableHead>Quốc gia</TableHead>
                            <TableHead>Ngày khởi chiếu</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Định dạng</TableHead>
                            <TableHead>Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagedMovies.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center">Không có phim nào phù hợp.</TableCell>
                            </TableRow>
                        ) : (
                            pagedMovies.map((movie) => (
                                <TableRow key={movie.id}>
                                    <TableCell>
                                        <MoviePoster src={movie.poster} alt={movie.title} />
                                    </TableCell>
                                    <TableCell>{movie.title}</TableCell>
                                    <TableCell>{movie.genre}</TableCell>
                                    <TableCell>{movie.country}</TableCell>
                                    <TableCell>{movie.releaseDate}</TableCell>
                                    <TableCell>
                                        <Badge variant={movie.status === "Đang chiếu" ? "default" : movie.status === "Sắp chiếu" ? "secondary" : "outline"}>
                                            {movie.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{movie.format}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost"><span className="material-icons">more_vert</span></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => {/* handleEdit */ }}>Sửa</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {/* handleDelete */ }} variant="destructive">Xóa</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {/* handleDetail */ }}>Xem chi tiết</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Phân trang */}
            <div className="flex justify-end items-center gap-2 mt-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>   
                   </div>
        </div>
    );
}
