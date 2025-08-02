import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller, useFieldArray } from "react-hook-form";
import { useAddComboMutation, useGetComboByIdQuery, useUpdateComboMutation, useGetAllComboDishesQuery } from "@/store/slices/combos/combosApi";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RootState, useAppSelector, useAppDispatch } from "@/store/store";
import { setComboId, cancelComboId } from "@/store/slices/combos/combosSlice";
import { ComboCreate, ComboUpdate, ComboStatusEnum, ComboDishResponse } from "@/types/combos";

const STATUS = [ComboStatusEnum.ACTIVE, ComboStatusEnum.INACTIVE, ComboStatusEnum.DELETED];

interface ComboFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ComboForm({ setOpen }: ComboFormProps) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ComboCreate>({
    defaultValues: {
      combo_name: "",
      description: "",
      price: 0,
      image_url: "",
      status: ComboStatusEnum.ACTIVE,
      items: [{ dish_id: 0, quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const [apiError, setApiError] = useState<string | null>(null);
  const [addCombo] = useAddComboMutation();
  const [updateCombo] = useUpdateComboMutation();
  const dispatch = useAppDispatch();
  const comboId = useAppSelector((state: RootState) => state.combos.comboId ?? null);
  const { data: comboData, isLoading, isError } = useGetComboByIdQuery(comboId ?? 0, { skip: !comboId });
  const { data: dishesData, isLoading: isDishesLoading } = useGetAllComboDishesQuery();

  useEffect(() => {
    if (comboId && comboData) {
      reset({
        combo_name: comboData.combo_name || "",
        description: comboData.description || "",
        price: comboData.price || 0,
        image_url: comboData.image_url || "",
        status: comboData.status || ComboStatusEnum.ACTIVE,
        items: Array.isArray(comboData.items) && comboData.items.length > 0
          ? comboData.items.map(item => ({ dish_id: item.dish_id || 0, quantity: item.quantity || 1 }))
          : [{ dish_id: 0, quantity: 1 }],
      });
    } else if (!comboId) {
      reset({
        combo_name: "",
        description: "",
        price: 0,
        image_url: "",
        status: ComboStatusEnum.ACTIVE,
        items: [{ dish_id: 0, quantity: 1 }],
      });
    }
    setApiError(null);
  }, [comboId, comboData, reset]);

  const onSubmit: SubmitHandler<ComboCreate> = async (formData) => {
    setApiError(null);
    console.log("Submitting combo data:", formData); // Debug log
    const validItems = formData.items.filter(item => item.dish_id > 0 && item.quantity > 0);
    if (validItems.length === 0) {
      setApiError("Vui lòng chọn ít nhất một món ăn và số lượng hợp lệ.");
      return;
    }

    const finalFormData = {
      ...formData,
      items: validItems,
      status: comboId ? formData.status : ComboStatusEnum.ACTIVE,
    };

    try {
      if (comboId) {
        const updateData: ComboUpdate = { ...finalFormData, items: finalFormData.items };
        console.log("Updating combo with data:", updateData); // Debug log
        const response = await updateCombo({ combo_id: comboId, body: updateData }).unwrap();
        console.log("Combo updated successfully:", response); // Debug log
      } else {
        console.log("Creating combo with data:", finalFormData); // Debug log
        const response = await addCombo(finalFormData).unwrap();
        console.log("Combo created successfully:", response); // Debug log
      }
      dispatch(cancelComboId());
      reset();
      setOpen(false);
    } catch (err: any) {
      console.error("Error adding/updating combo - Full error:", err); // Debug log chi tiết
      const errorMessage = err?.detail || err?.error || err?.message || "Lỗi không xác định khi thêm combo.";
      setApiError(errorMessage);
    }
  };

  if (isLoading || isDishesLoading) return <div className="flex justify-center">Đang tải...</div>;
  if (isError) return <div>Lỗi khi tải combo.</div>;

  return (
    <form className="space-y-4 mt-4 p-4" onSubmit={handleSubmit(onSubmit)}>
      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

      <div>
        <label className="block mb-1 font-medium">Tên combo *</label>
        <Input
          id="combo_name"
          {...register("combo_name", { required: "Tên combo là bắt buộc" })}
        />
        {errors.combo_name && <p className="text-red-500 text-sm">{errors.combo_name.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Hình ảnh (URL)</label>
        <Input
          id="image_url"
          {...register("image_url", {
            pattern: { value: /^https?:\/\/.+$/, message: "URL không hợp lệ" },
          })}
        />
        {errors.image_url && <p className="text-red-500 text-sm">{errors.image_url.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Giá (VND) *</label>
        <Input
          type="number"
          id="price"
          step="0.01"
          {...register("price", {
            required: "Giá là bắt buộc",
            min: { value: 0, message: "Giá phải lớn hơn hoặc bằng 0" },
            valueAsNumber: true,
          })}
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Trạng thái *</label>
        <Controller
          name="status"
          control={control}
          rules={{ required: "Trạng thái là bắt buộc" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="min-w-[200px] w-60 bg-background text-foreground">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-background text-foreground">
                {STATUS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === ComboStatusEnum.ACTIVE ? "Đang hoạt động" : s === ComboStatusEnum.INACTIVE ? "Không hoạt động" : "Đã xóa"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Mô tả</label>
        <Textarea
          id="description"
          {...register("description")}
          className="mt-1 block w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Món trong combo *</label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2 items-center">
            <div className="flex-1">
              <Controller
                name={`items.${index}.dish_id`}
                control={control}
                rules={{ required: "Món ăn là bắt buộc", min: { value: 1, message: "Vui lòng chọn món ăn" } }}
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                    <SelectTrigger className="w-full bg-background text-foreground">
                      <SelectValue placeholder="Chọn món ăn" />
                    </SelectTrigger>
                    <SelectContent className="bg-background text-foreground">
                      {dishesData?.map((dish: ComboDishResponse) => (
                        <SelectItem key={dish.dish_id} value={dish.dish_id.toString()}>
                          {dish.dish_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.items?.[index]?.dish_id && (
                <p className="text-red-500 text-sm">{errors.items[index].dish_id.message}</p>
              )}
            </div>
            <div className="w-24">
              <Input
                type="number"
                placeholder="Số lượng"
                {...register(`items.${index}.quantity`, {
                  required: "Số lượng là bắt buộc",
                  min: { value: 1, message: "Số lượng phải lớn hơn 0" },
                  valueAsNumber: true,
                })}
              />
              {errors.items?.[index]?.quantity && (
                <p className="text-red-500 text-sm">{errors.items[index].quantity.message}</p>
              )}
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Xóa
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ dish_id: 0, quantity: 1 })}
          className="mt-2"
        >
          Thêm món
        </Button>
      </div>

      {comboId ? (
        <Button type="submit" className="w-full mt-2 bg-destructive">
          Sửa combo
        </Button>
      ) : (
        <Button type="submit" className="w-full mt-2 bg-destructive">
          Lưu combo
        </Button>
      )}
    </form>
  );
}
