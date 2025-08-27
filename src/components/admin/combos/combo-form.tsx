import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller, useFieldArray } from 'react-hook-form';
import {
  useAddComboMutation,
  useGetComboByIdQuery,
  useUpdateComboMutation,
  useGetAllDishesQuery,
} from '@/store/slices/combos/combosApi';
import { CreateCombo } from '@/types/combos';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RootState, useAppSelector } from '@/store/store';

const STATUS = ['active', 'inactive'];

interface ComboFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ComboForm({ setOpen }: ComboFormProps) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateCombo>({
    defaultValues: {
      combo_name: '',
      description: '',
      price: 0,
      image_url: '',
      status: 'active',
      items: [{ dish_id: 0, quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const [addCombo] = useAddComboMutation();
  const [updateCombo] = useUpdateComboMutation();
  const comboId = useAppSelector((state: RootState) => state.combos?.comboId);
  const { data: comboData } = useGetComboByIdQuery(comboId, { skip: !comboId });
  
  const { data: dishesData } = useGetAllDishesQuery();

  useEffect(() => {
    if (comboData) {
      reset({
        combo_name: comboData.combo_name,
        description: comboData.description || '',
        price: comboData.price,
        image_url: comboData.image_url || '',
        status: comboData.status || 'active',
        items: comboData.combo_items.length > 0
          ? comboData.combo_items.map(item => ({ dish_id: item.dish_id, quantity: item.quantity }))
          : [{ dish_id: 0, quantity: 1 }],
      });
    } else {
      reset({
        combo_name: '',
        description: '',
        price: 0,
        image_url: '',
        status: 'active',
        items: [{ dish_id: 0, quantity: 1 }],
      });
    }
  }, [comboData, reset]);

  const onSubmit: SubmitHandler<CreateCombo> = async (data) => {
    try {
      // Filter out invalid items (e.g., dish_id = 0)
      const validData = {
        ...data,
        items: data.items.filter(item => item.dish_id > 0),
      };
      if (comboId) {
        await updateCombo({ combo_id: comboId, body: validData }).unwrap();
      } else {
        await addCombo(validData).unwrap();
      }
      reset();
      setOpen(false);
    } catch (err) {
      console.error('Error saving combo:', err);
    }
  };

  return (
    <form className="space-y-4 mt-4 p-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Combo Name */}
      <div>
        <label className="block mb-1 font-medium">Tên combo *</label>
        <Input
          id="combo_name"
          {...register('combo_name', { required: 'Tên combo là bắt buộc' })}
        />
        {errors.combo_name && <p className="text-red-500 text-sm">{errors.combo_name.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium">Mô tả</label>
        <Textarea
          id="description"
          {...register('description')}
          className="mt-1 block w-full border rounded p-2"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      {/* Price */}
      <div>
        <label className="block mb-1 font-medium">Giá (VND) *</label>
        <Input
          type="number"
          id="price"
          {...register('price', {
            required: 'Giá là bắt buộc',
            min: { value: 0, message: 'Giá phải lớn hơn hoặc bằng 0' },
            valueAsNumber: true,
          })}
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
      </div>

      {/* Image URL */}
      <div>
        <label className="block mb-1 font-medium">URL hình ảnh</label>
        <Input
          id="image_url"
          {...register('image_url', {
            pattern: { value: /^https?:\/\/.+$/, message: 'URL không hợp lệ' },
          })}
        />
        {errors.image_url && <p className="text-red-500 text-sm">{errors.image_url.message}</p>}
      </div>

      {/* Status */}
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
                {STATUS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
      </div>

      {/* Combo Items */}
      <div>
        <label className="block mb-1 font-medium">Món ăn trong combo *</label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex space-x-2 mb-2">
            <Controller
              name={`items.${index}.dish_id`}
              control={control}
              rules={{ required: 'Vui lòng chọn món ăn', min: { value: 1, message: 'Vui lòng chọn món ăn' } }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value.toString()}
                >
                  <SelectTrigger className="w-60 bg-background text-foreground">
                    <SelectValue placeholder="Chọn món ăn" />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground">
                    {dishesData?.map((dish) => (
                      <SelectItem key={dish.dish_id} value={dish.dish_id.toString()}>
                        {dish.dish_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Input
              type="number"
              placeholder="Số lượng"
              {...register(`items.${index}.quantity`, {
                required: 'Số lượng là bắt buộc',
                min: { value: 1, message: 'Số lượng phải lớn hơn 0' },
                valueAsNumber: true,
              })}
              className="w-24"
            />
            <Button type="button" onClick={() => remove(index)} variant="destructive">
              Xóa
            </Button>
          </div>
        ))}
        {errors.items && <p className="text-red-500 text-sm">{errors.items.message}</p>}
        <Button
          type="button"
          onClick={() => append({ dish_id: 0, quantity: 1 })}
          className="mt-2"
        >
          Thêm món ăn
        </Button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full mt-2 bg-destructive"
      >
        {comboId ? 'Sửa combo' : 'Lưu combo'}
      </Button>
    </form>
  );
}