import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAddComboDishMutation } from "@/store/slices/combos/combosApi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DishCreate } from "@/types/combos";

interface DishFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DishForm({ setOpen }: DishFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DishCreate>({
    defaultValues: {
      dish_name: "",
      description: "",
    },
  });

  const [apiError, setApiError] = useState<string | null>(null);
  const [addComboDish, { isLoading, error }] = useAddComboDishMutation();

  const onSubmit: SubmitHandler<DishCreate> = async (formData) => {
    setApiError(null);
    console.log("Submitting dish data:", formData); // Debug log
    try {
      const response = await addComboDish(formData).unwrap();
      console.log("Dish added successfully:", response); // Debug log
      reset();
      setOpen(false);
    } catch (err: any) {
      console.error("Error adding dish - Full error:", err); // Debug log chi tiết
      const errorMessage = err?.detail || err?.error || "Lỗi không xác định khi thêm món ăn.";
      setApiError(errorMessage);
    }
  };

  React.useEffect(() => {
    if (error) {
      console.error("Mutation error:", error);
      const errorMessage = (error as any)?.detail || (error as any)?.error || "Lỗi không xác định.";
      setApiError(errorMessage);
    }
  }, [error]);

  if (isLoading) return <div className="flex justify-center">Đang thêm món ăn...</div>;

  return (
    <form className="space-y-4 mt-4 p-4" onSubmit={handleSubmit(onSubmit)}>
      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

      <div>
        <label className="block mb-1 font-medium">Tên món ăn *</label>
        <Input
          id="dish_name"
          {...register("dish_name", { required: "Tên món ăn là bắt buộc" })}
        />
        {errors.dish_name && <p className="text-red-500 text-sm">{errors.dish_name.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Mô tả</label>
        <Textarea
          id="description"
          {...register("description")}
          className="mt-1 block w-full border rounded p-2"
        />
      </div>

      <Button type="submit" className="w-full mt-2 bg-destructive" disabled={isLoading}>
        Lưu món ăn
      </Button>
    </form>
  );
}
