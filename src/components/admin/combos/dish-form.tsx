import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  useAddDishMutation,
  useGetDishByIdQuery,
  useUpdateDishMutation,
  useGetAllDishesQuery,
  useDeleteDishMutation,
} from '@/store/slices/combos/combosApi';
import { CreateComboDish, UpdateComboDish } from '@/types/combos';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RootState, useAppSelector } from '@/store/store';

interface DishFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DishForm({ setOpen }: DishFormProps): React.JSX.Element {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateComboDish>({
    defaultValues: {
      dish_name: '',
      description: '',
    },
  });

  const [addDish] = useAddDishMutation();
  const [updateDish] = useUpdateDishMutation();
  const [deleteDish] = useDeleteDishMutation();
  const dishId = useAppSelector((state: RootState) => state.combos?.comboId);
  const { data } = useGetDishByIdQuery(dishId, { skip: !dishId });
  const { data: dishes, isFetching, isError, error, refetch: refetchDishes } = useGetAllDishesQuery();

  const [editingDishId, setEditingDishId] = useState<number | null>(null);

  useEffect(() => {
    if (data) {
      reset({
        dish_name: data.dish_name,
        description: data.description || '',
      });
    } else {
      reset({
        dish_name: '',
        description: '',
      });
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<CreateComboDish> = async (data) => {
    try {
      if (editingDishId) {
        await updateDish({ dish_id: editingDishId, body: data as UpdateComboDish }).unwrap();
        setEditingDishId(null);
      } else if (dishId) {
        await updateDish({ dish_id: dishId, body: data as UpdateComboDish }).unwrap();
      } else {
        await addDish(data).unwrap();
      }
      reset();
      refetchDishes(); // Cập nhật danh sách sau khi thêm/sửa
      setOpen(false); // Close the form after successful submission
    } catch (err) {
      console.error('Error saving dish:', err);
    }
  };

  const handleDeleteDish = async (dishId: number) => {
    if (window.confirm('Bạn có chắc muốn xóa món ăn này?')) {
      try {
        await deleteDish(dishId).unwrap();
        refetchDishes(); // Cập nhật danh sách sau khi xóa
      } catch (err) {
        console.error('Error deleting dish:', err);
      }
    }
  };

  const handleEditDish = (dishId: number) => {
    setEditingDishId(dishId);
    const dishToEdit = dishes?.find((dish) => dish.dish_id === dishId);
    if (dishToEdit) {
      reset({
        dish_name: dishToEdit.dish_name,
        description: dishToEdit.description || '',
      });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Dish Name */}
        <div>
          <label className="block mb-1 font-medium">Tên món ăn *</label>
          <Input
            id="dish_name"
            {...register('dish_name', { required: 'Tên món ăn là bắt buộc' })}
          />
          {errors.dish_name && <p className="text-red-500 text-sm">{errors.dish_name.message}</p>}
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

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full mt-2 bg-destructive"
        >
          {editingDishId ? 'Cập nhật món ăn' : dishId ? 'Sửa món ăn' : 'Lưu món ăn'}
        </Button>
      </form>

      {/* Table to display all dishes */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Danh sách món ăn</h2>
        {isFetching ? (
          <p>Đang tải...</p>
        ) : isError ? (
          <p className="text-red-500">Lỗi: {error?.toString()}</p>
        ) : dishes && dishes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="py-2 px-4 border-b text-left text-gray-700 dark:text-gray-300">ID</th>
                  <th className="py-2 px-4 border-b text-left text-gray-700 dark:text-gray-300">Tên món ăn</th>
                  <th className="py-2 px-4 border-b text-left text-gray-700 dark:text-gray-300">Mô tả</th>
                  <th className="py-2 px-4 border-b text-left text-gray-700 dark:text-gray-300">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((dish) => (
                  <tr key={dish.dish_id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="py-2 px-4 border-b text-gray-900 dark:text-gray-100">{dish.dish_id}</td>
                    <td className="py-2 px-4 border-b text-gray-900 dark:text-gray-100">{dish.dish_name}</td>
                    <td className="py-2 px-4 border-b text-gray-900 dark:text-gray-100">{dish.description || 'Chưa có mô tả'}</td>
                    <td className="py-2 px-4 border-b">
                      <Button
                        className="bg-yellow-500 hover:bg-yellow-600 mr-2 text-white"
                        onClick={() => handleEditDish(dish.dish_id)}
                      >
                        Sửa
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleDeleteDish(dish.dish_id)}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Không có món ăn nào.</p>
        )}
      </div>
    </div>
  );
}