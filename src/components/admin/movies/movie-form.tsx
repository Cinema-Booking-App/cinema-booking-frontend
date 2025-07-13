import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import React from "react";

const GENRES = [
    "Tất cả",
    "Hành động",
    "Khoa học viễn tưởng",
    "Tâm lý, Kịch tính",
    "Hoạt hình"
];

interface Movie {
  id: number;
  title: string;
  poster: string;
  genre: string;
  country: string;
  releaseDate: string;
  status: string;
  format: string;
  duration: number;
  director: string;
  actors: string;
  description: string;
}

interface MovieForm {
  title: string;
  poster: string;
  genre: string;
  country: string;
  releaseDate: string;
  status: string;
  format: string;
}

interface MovieFormProps {
  form: MovieForm;
  setForm: (form: MovieForm | ((prev: MovieForm) => MovieForm)) => void;
  setMovies: (movies: Movie[]) => void;
  movies: Movie[];
  setOpen: (open: boolean) => void;
}

export default function MovieForm({ form, setForm, setMovies, movies, setOpen }: MovieFormProps) {
    return (
        <form className="space-y-4 mt-4 p-4" onSubmit={e => {
            e.preventDefault();
            setMovies([
                {
                    id: Date.now(),
                    ...form,
                    duration: 0,
                    director: "",
                    actors: "",
                    description: "",
                },
                ...movies,
            ]);
            setForm({
                title: "",
                poster: "",
                genre: "",
                country: "",
                releaseDate: "",
                status: "Đang chiếu",
                format: "2D",
            });
            setOpen(false);
        }}>
            <div>
                <label className="block mb-1 font-medium">Tên phim *</label>
                <Input required value={form.title} onChange={e => setForm((f: MovieForm) => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
                <label className="block mb-1 font-medium">Poster (URL)</label>
                <Input value={form.poster} onChange={e => setForm((f: MovieForm) => ({ ...f, poster: e.target.value }))} />
            </div>
            <div>
                <label className="block mb-1 font-medium">Thể loại</label>
                <Select value={form.genre} onValueChange={value => setForm((f: MovieForm) => ({ ...f, genre: value }))}>
                    <SelectTrigger className="min-w-[200px] w-60 bg-background text-foreground">
                        <SelectValue placeholder="Chọn thể loại" />
                    </SelectTrigger>
                    <SelectContent>
                        {GENRES.filter(g => g !== "Tất cả").map(g => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="block mb-1 font-medium">Quốc gia</label>
                <Input value={form.country} onChange={e => setForm((f: MovieForm) => ({ ...f, country: e.target.value }))} />
            </div>
            <div>
                <label className="block mb-1 font-medium">Ngày khởi chiếu</label>
                <Input type="date" value={form.releaseDate} onChange={e => setForm((f: MovieForm) => ({ ...f, releaseDate: e.target.value }))} />
            </div>
            <div>
                <label className="block mb-1 font-medium">Trạng thái</label>
                <Select value={form.status} onValueChange={value => setForm((f: MovieForm) => ({ ...f, status: value }))}>
                    <SelectTrigger className="min-w-[200px] w-60 bg-background text-foreground">
                        <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="bg-background text-foreground">
                        {["Đang chiếu", "Sắp chiếu", "Ngừng chiếu"].map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="block mb-1 font-medium">Định dạng</label>
                <Select value={form.format} onValueChange={value => setForm((f: MovieForm) => ({ ...f, format: value }))}>
                    <SelectTrigger className="min-w-[200px] w-60 bg-background text-foreground">
                        <SelectValue placeholder="Chọn định dạng" />
                    </SelectTrigger>
                    <SelectContent className="bg-background text-foreground">
                        {["2D", "3D", "4D", "IMAX"].map(fm => (
                            <SelectItem key={fm} value={fm}>{fm}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" className="w-full mt-2 bg-destructive">Lưu phim</Button>
        </form>
    );
} 