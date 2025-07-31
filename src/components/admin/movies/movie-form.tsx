import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useAddMoviesMutation, useGetMovieByIdQuery, useUpdateMovieMutation } from '@/store/slices/movies/moviesApi';
import { CreateMovies } from '@/types/movies';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RootState, useAppSelector } from '@/store/store';

const GENRES = ['Hành động', 'Khoa học viễn tưởng', 'Tâm lý, Kịch tính', 'Hoạt hình'];
const status = ['upcoming', 'now_showing', 'ended'];
const age = ['P', 'C13', 'C16', 'C18'];

interface MovieFormProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function MovieForm({ setOpen }: MovieFormProps) {
    // Khởi tạo React Hook Form
    const { register, handleSubmit, reset, control, formState: { errors }, } = useForm<CreateMovies>({
        defaultValues: {
            title: '',
            genre: '',
            duration: 0,
            age_rating: 'P',
            description: '',
            release_date: '',
            trailer_url: '',
            poster_url: '',
            status: 'now_showing',
            director: '',
            actors: '',
            //   country: '',
        },
    });

    // Sử dụng mutation để thêm phim
    const [addMovies] = useAddMoviesMutation();
    const [updateMovies] = useUpdateMovieMutation();
    // Gọi ra movie Id để có thể update
    const movieId = useAppSelector((state: RootState) => state.movies.movieId)
    const { data } = useGetMovieByIdQuery(movieId, { skip: !movieId }); // skip để không gọi api khi không có movieId

    console.log(data)
    useEffect(() => {
        if (data) {
            reset({
                title: data.title,
                genre: data.genre,
                duration: data.duration,
                age_rating: data.age_rating,
                description: data.description,
                release_date: data.release_date,
                trailer_url: data.trailer_url,
                poster_url: data.poster_url,
                status: data.status,
                director: data.director,
                actors: data.actors,
            })
        } else {
            reset({
                title: '',
                genre: '',
                duration: 0,
                age_rating: 'P',
                description: '',
                release_date: '',
                trailer_url: '',
                poster_url: '',
                status: 'now_showing',
                director: '',
                actors: ''
            })
        }
    }, [data, reset])

    // Xử lý submit form
    const onSubmit: SubmitHandler<CreateMovies> = async (data) => {
        try {
            if (movieId) {
                await updateMovies({ movie_id: movieId, body: data }).unwrap()
                reset();
                setOpen(false)
            } else {
                await addMovies(data).unwrap()
                reset();
                setOpen(false)
            }
        } catch (err) {
            console.error('Lỗi khi thêm phim:', err);
        }
    };

    return (
        <form className="space-y-4 mt-4 p-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Tên phim */}
            <div>
                <label className="block mb-1 font-medium">Tên phim *</label>
                <Input
                    id="title"
                    {...register('title', { required: 'Tên phim là bắt buộc' })}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            {/* Poster (URL) */}
            <div>
                <label className="block mb-1 font-medium">Poster (URL) *</label>
                <Input
                    id="poster_url"
                    {...register('poster_url', {
                        required: 'URL poster là bắt buộc',
                        pattern: { value: /^https?:\/\/.+$/, message: 'URL không hợp lệ' },
                    })}
                />
                {errors.poster_url && <p className="text-red-500 text-sm">{errors.poster_url.message}</p>}
            </div>

            {/* Thể loại */}
            <div>
                <label className="block mb-1 font-medium">Thể loại *</label>
                <Controller
                    name="genre"
                    control={control}
                    rules={{ required: 'Thể loại là bắt buộc' }}
                    render={({ field }) => (
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            <SelectTrigger className="min-w-[200px] w-60 bg-background text-foreground">
                                <SelectValue placeholder="Chọn thể loại" />
                            </SelectTrigger>
                            <SelectContent>
                                {GENRES.map((g) => (
                                    <SelectItem key={g} value={g}>
                                        {g}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.genre && <p className="text-red-500 text-sm">{errors.genre.message}</p>}
            </div>

            {/* Quốc gia */}
            {/* <div>
        <label className="block mb-1 font-medium">Quốc gia *</label>
        <Input
          id="country"
          {...register('country', { required: 'Quốc gia là bắt buộc' })}
        />
        {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
      </div> */}

            {/* Ngày khởi chiếu */}
            <div>
                <label className="block mb-1 font-medium">Ngày khởi chiếu *</label>
                <Input
                    type="date"
                    id="release_date"
                    {...register('release_date', { required: 'Ngày khởi chiếu là bắt buộc' })}
                />
                {errors.release_date && <p className="text-red-500 text-sm">{errors.release_date.message}</p>}
            </div>

            {/* Trạng thái */}
            <div>
                <label className="block mb-1 font-medium">Trạng thái *</label>
                <Controller
                    name="status"
                    control={control}
                    rules={{ required: 'Trạng thái là bắt buộc' }}
                    render={({ field }) => (
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            <SelectTrigger className="min-w-[200px] w-60 bg-background text-foreground">
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent className="bg-background text-foreground">
                                {status.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s === 'now_showing'
                                            ? 'Đang chiếu' // Now showing
                                            : s === 'upcoming'
                                                ? 'Sắp chiếu'    // Coming soon
                                                : s === 'ended'
                                                    ? 'Ngừng chiếu' // Ended
                                                    : s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>

            {/* Thời lượng */}
            <div>
                <label className="block mb-1 font-medium">Thời lượng (phút) *</label>
                <Input
                    type="number"
                    id="duration"
                    {...register('duration', {
                        required: 'Thời lượng là bắt buộc',
                        min: { value: 1, message: 'Thời lượng phải lớn hơn 0' },
                        valueAsNumber: true,
                    })}
                />
                {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
            </div>

            {/* Năm sản xuất */}
            {/* <div>
                <label className="block mb-1 font-medium">Năm sản xuất *</label>
                <Input
                    type="number"
                    id="year"
                    {...register('year', {
                        required: 'Năm sản xuất là bắt buộc',
                        min: { value: 1900, message: 'Năm phải từ 1900 trở lên' },
                        max: { value: new Date().getFullYear(), message: 'Năm không hợp lệ' },
                        valueAsNumber: true,
                    })}
                />
                {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
            </div> */}

            {/* Độ tuổi */}
            <div>
                <label className="block mb-1 font-medium">Độ tuổi *</label>
                <Controller
                    name="age_rating"
                    control={control}
                    rules={{ required: 'Độ tuổi là bắt buộc' }}
                    render={({ field }) => (
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            <SelectTrigger className="min-w-[200px] w-60 bg-background text-foreground">
                                <SelectValue placeholder="Chọn độ tuổi" />
                            </SelectTrigger>
                            <SelectContent className="bg-background text-foreground">
                                {age.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s === 'P'
                                            ? 'Mọi lứa tuổi'
                                            : s === 'C13'
                                                ? '13+'
                                                : s === 'C16'
                                                    ? '16+'
                                                    : s === 'C18'
                                                        ? '18+'
                                                        : s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.age_rating && <p className="text-red-500 text-sm">{errors.age_rating.message}</p>}
            </div>

            {/* Mô tả */}
            <div>
                <label className="block mb-1 font-medium">Mô tả *</label>
                <Textarea
                    id="description"
                    {...register('description', { required: 'Mô tả là bắt buộc' })}
                    className="mt-1 block w-full border rounded p-2"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            {/* Trailer (URL) */}
            <div>
                <label className="block mb-1 font-medium">Trailer (URL) *</label>
                <Input
                    id="trailer_url"
                    {...register('trailer_url', {
                        required: 'URL trailer là bắt buộc',
                        pattern: { value: /^https?:\/\/.+$/, message: 'URL không hợp lệ' },
                    })}
                />
                {errors.trailer_url && <p className="text-red-500 text-sm">{errors.trailer_url.message}</p>}
            </div>

            {/* Đạo diễn */}
            <div>
                <label className="block mb-1 font-medium">Đạo diễn *</label>
                <Input
                    id="director"
                    {...register('director', { required: 'Đạo diễn là bắt buộc' })}
                />
                {errors.director && <p className="text-red-500 text-sm">{errors.director.message}</p>}
            </div>

            {/* Diễn viên */}
            <div>
                <label className="block mb-1 font-medium">Diễn viên *</label>
                <Input
                    id="actors"
                    {...register('actors', { required: 'Diễn viên là bắt buộc' })}
                />
                {errors.actors && <p className="text-red-500 text-sm">{errors.actors.message}</p>}
            </div>

            {/* Nút submit */}
            {Boolean(movieId) ? (
                < Button
                    type="submit"
                    className="w-full mt-2 bg-destructive"
                >
                    Sửa phim
                </Button>
            ) : (
                <Button
                    type="submit"
                    className="w-full mt-2 bg-destructive"
                >
                    Lưu phim
                </Button>
            )}
            {/* Thông báo lỗi hoặc thành công */}
            {/* {isError && <p className="text-red-500 text-sm">Lỗi: {JSON.stringify(error)}</p>}
            {isSuccess && <p className="text-green-500 text-sm">Lưu phim thành công!</p>} */}
        </form >
    );
}