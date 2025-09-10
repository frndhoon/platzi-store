import { zodResolver } from "@hookform/resolvers/zod";
import { Asterisk, Image as ImageIcon, Upload, X } from "lucide-react";
import { useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { MAX_IMAGE_COUNT } from "@/constants/product.constant";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // 랜덤 이미지 URL 생성 함수
  const generateRandomImageUrl = () => {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    return `https://picsum.photos/id/${randomId}/300`;
  };

  // 파일 첨부 버튼 클릭 핸들러
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const currentImages = form.getValues("images");
    const newImages = [...currentImages];

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PNG and JPG files are allowed.");
        continue;
      }

      if (file.size > maxFileSize) {
        toast.error("File size must be less than 5MB.");
        continue;
      }

      if (newImages.length >= MAX_IMAGE_COUNT) {
        toast.error(`You can upload up to ${MAX_IMAGE_COUNT} images.`);
        break;
      }

      const newImageUrl = generateRandomImageUrl();
      newImages.push(newImageUrl);
    }

    form.setValue("images", newImages);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 이미지 삭제 함수
  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue("images", newImages);
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
    <div className="flex flex-col gap-3 max-w-4xl mx-auto">
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

          {/* 이미지 첨부 섹션 */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Images <Asterisk className="w-3 h-3 text-red-500" />
                </FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    {/* 숨겨진 파일 입력 */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isCategoryLoading || isPending}
                    />

                    {/* 이미지 미리보기 */}
                    {field.value.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {field.value.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                              <img
                                src={imageUrl}
                                alt={`Uploaded image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {field.value.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                disabled={isCategoryLoading || isPending}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Upload images
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-300">
                          JPG, PNG files can be selected to upload
                        </p>
                      </div>
                    )}

                    {/* 파일 첨부 버튼 */}
                    {field.value.length < MAX_IMAGE_COUNT ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleFileUpload}
                        className="w-full"
                        disabled={isCategoryLoading || isPending}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Select files ({field.value.length}/{MAX_IMAGE_COUNT})
                      </Button>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        You can upload up to{" "}
                        <span className="font-bold text-red-500">
                          {MAX_IMAGE_COUNT} images.
                        </span>
                      </p>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
