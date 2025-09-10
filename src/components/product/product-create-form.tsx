import { zodResolver } from "@hookform/resolvers/zod";
import { Asterisk } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { ImageUploadForm } from "@/components/product/image-upload-form";
import { BorderLine } from "@/components/shared/border-line";
import { CancelButton } from "@/components/shared/cancel-button";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { type Category } from "@/types/category.types";
import { type PostProductRequest } from "@/types/product.types";
import { limitNumber } from "@/utils/number.utils";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Product title is required"
  }),
  price: z.number().min(1, {
    message: "Price must be greater than 1"
  }),
  description: z.string().min(1, {
    message: "Description is required"
  }),
  categoryId: z
    .number()
    .min(1, {
      message: "Category ID must be greater than 1"
    })
    .nullable(),
  images: z.array(z.string().min(1), {
    message: "Product must have at least one image"
  })
});

interface ProductCreateFormProps {
  onSubmit: (data: PostProductRequest) => void;
  onCancel: () => void;
  isPending: boolean;
  categoryList?: Category[];
  isCategoryLoading: boolean;
  isCategoryError: boolean;
}

const ProductCreateForm = ({
  onSubmit,
  onCancel,
  isPending,
  categoryList,
  isCategoryLoading,
  isCategoryError
}: ProductCreateFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      price: 1,
      description: "",
      categoryId: null,
      images: []
    }
  });

  // 카테고리 Select placeholder 메시지 결정
  const getCategoryPlaceholder = (fieldValue: number | null) => {
    if (isCategoryLoading) return "Loading...";
    if (isCategoryError) return "Failed to load categories. Please refresh.";
    if (fieldValue === null) return "Select a category";
  };

  // 필수 필드들을 watch하여 Create 버튼 활성화 여부 결정
  const watchedFields = useWatch({
    control: form.control,
    name: ["title", "description", "categoryId", "images"]
  });
  const [title, description, categoryId, images] = watchedFields;

  const isFormValid =
    title?.trim().length > 0 &&
    description?.trim().length > 0 &&
    categoryId !== null &&
    categoryId > 0 &&
    images?.length > 0;

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data as PostProductRequest);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Product Create</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Please fill out the form below to create a new product.
        </p>
        <p className="text-sm justify-end flex items-center gap-1">
          <Asterisk className="w-3 h-3 text-red-500" /> means required fields
        </p>
      </div>

      <BorderLine />

      <Form {...form}>
        <form
          className="flex flex-col gap-3"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <Asterisk className="w-3 h-3 text-red-500" />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter a unique product title"
                    disabled={isCategoryLoading || isPending}
                    minLength={1}
                    maxLength={50}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Price <Asterisk className="w-3 h-3 text-red-500" />
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      {...field}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        field.onChange(limitNumber(e.target.value, 1, 1000));
                      }}
                      disabled={isCategoryLoading || isPending}
                      min={1}
                      max={1000}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 select-none">
                      $
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <Asterisk className="w-3 h-3 text-red-500" />
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter a product description"
                    disabled={isCategoryLoading || isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <BorderLine />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Category <Asterisk className="w-3 h-3 text-red-500" />
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value?.toString() || ""}
                    onValueChange={(value) => {
                      form.setValue("categoryId", Number(value));
                    }}
                    disabled={isCategoryLoading || isCategoryError}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={getCategoryPlaceholder(field.value)}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryList?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ImageUploadForm
            form={form}
            disabled={isCategoryLoading || isPending}
          />

          <BorderLine />

          <div className="flex flex-row gap-2">
            <CancelButton
              className="flex-1"
              onClick={onCancel}
              disabled={isCategoryLoading || isPending}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex-1">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isCategoryLoading || isPending || !isFormValid}
                  >
                    Create
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Have you filled in all the required fields?</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </form>
      </Form>
    </div>
  );
};

export { ProductCreateForm };
