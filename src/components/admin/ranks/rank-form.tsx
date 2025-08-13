import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useAddRankMutation, useGetRankByIdQuery, useUpdateRankMutation } from '@/store/slices/ranks/ranksApi';
import { CreateRank } from '@/types/ranks';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RootState, useAppSelector } from '@/store/store';

interface RankFormProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RankForm({ setOpen }: RankFormProps) {
    // Khởi tạo React Hook Form
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateRank>({
        defaultValues: {
            rank_name: '',
            spending_target: 0,
            ticket_percent: 0,
            combo_percent: 0,
            is_default: false,
        },
    });

    // Sử dụng mutation để thêm và cập nhật rank
    const [addRank] = useAddRankMutation();
    const [updateRank] = useUpdateRankMutation();
    // Lấy rankId từ Redux store
    const rankId = useAppSelector((state: RootState) => state.ranks?.rankId);
    const { data: rankData } = useGetRankByIdQuery(rankId, { skip: !rankId }); // Skip nếu không có rankId

    // Cập nhật form khi có dữ liệu rank
    useEffect(() => {
        if (rankData) {
            reset({
                rank_name: rankData.rank_name,
                spending_target: rankData.spending_target,
                ticket_percent: rankData.ticket_percent,
                combo_percent: rankData.combo_percent,
                is_default: rankData.is_default,
            });
        } else {
            reset({
                rank_name: '',
                spending_target: 0,
                ticket_percent: 0,
                combo_percent: 0,
                is_default: false,
            });
        }
    }, [rankData, reset]);

    // Xử lý submit form
    const onSubmit: SubmitHandler<CreateRank> = async (data) => {
        try {
            if (rankId) {
                await updateRank({ rank_id: rankId, body: data }).unwrap();
                reset();
                setOpen(false);
            } else {
                await addRank(data).unwrap();
                reset();
                setOpen(false);
            }
        } catch (err) {
            console.error('Lỗi khi xử lý rank:', err);
        }
    };

    return (
        <form className="space-y-4 mt-4 p-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Tên rank */}
            <div>
                <label className="block mb-1 font-medium">Tên cấp bậc *</label>
                <Input
                    id="rank_name"
                    {...register('rank_name', { required: 'Tên cấp bậc là bắt buộc' })}
                />
                {errors.rank_name && <p className="text-red-500 text-sm">{errors.rank_name.message}</p>}
            </div>

            {/* Tổng chi tiêu yêu cầu */}
            <div>
                <label className="block mb-1 font-medium">Tổng chi tiêu yêu cầu (VND) *</label>
                <Input
                    type="number"
                    id="spending_target"
                    step="0.01"
                    {...register('spending_target', {
                        required: 'Tổng chi tiêu là bắt buộc',
                        min: { value: 0, message: 'Tổng chi tiêu phải lớn hơn hoặc bằng 0' },
                        valueAsNumber: true,
                    })}
                />
                {errors.spending_target && <p className="text-red-500 text-sm">{errors.spending_target.message}</p>}
            </div>

            {/* % tích lũy khi mua vé */}
            <div>
                <label className="block mb-1 font-medium">% Tích lũy khi mua vé *</label>
                <Input
                    type="number"
                    id="ticket_percent"
                    step="0.01"
                    {...register('ticket_percent', {
                        required: '% tích lũy vé là bắt buộc',
                        min: { value: 0, message: '% tích lũy vé phải lớn hơn hoặc bằng 0' },
                        max: { value: 100, message: '% tích lũy vé phải nhỏ hơn hoặc bằng 100' },
                        valueAsNumber: true,
                    })}
                />
                {errors.ticket_percent && <p className="text-red-500 text-sm">{errors.ticket_percent.message}</p>}
            </div>

            {/* % tích lũy khi mua combo */}
            <div>
                <label className="block mb-1 font-medium">% Tích lũy khi mua combo *</label>
                <Input
                    type="number"
                    id="combo_percent"
                    step="0.01"
                    {...register('combo_percent', {
                        required: '% tích lũy combo là bắt buộc',
                        min: { value: 0, message: '% tích lũy combo phải lớn hơn hoặc bằng 0' },
                        max: { value: 100, message: '% tích lũy combo phải nhỏ hơn hoặc bằng 100' },
                        valueAsNumber: true,
                    })}
                />
                {errors.combo_percent && <p className="text-red-500 text-sm">{errors.combo_percent.message}</p>}
            </div>

            {/* Cấp mặc định */}
            <div>
                <label className="block mb-1 font-medium">Cấp mặc định *</label>
                <Controller
                    name="is_default"
                    control={control}
                    rules={{ required: 'Cấp mặc định là bắt buộc' }}
                    render={({ field }) => (
                        <Select
                            onValueChange={(value) => field.onChange(value === 'true')}
                            value={field.value ? 'true' : 'false'}
                        >
                            <SelectTrigger className="min-w-[200px] w-60 bg-background text-foreground">
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent className="bg-background text-foreground">
                                <SelectItem value="true">Có</SelectItem>
                                <SelectItem value="false">Không</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.is_default && <p className="text-red-500 text-sm">{errors.is_default.message}</p>}
            </div>

            {/* Nút submit */}
            {rankId ? (
                <Button type="submit" className="w-full mt-2 bg-destructive">
                    Sửa cấp bậc
                </Button>
            ) : (
                <Button type="submit" className="w-full mt-2 bg-destructive">
                    Lưu cấp bậc
                </Button>
            )}
        </form>
    );
}