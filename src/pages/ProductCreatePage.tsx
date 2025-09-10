import { zodResolver } from "@hookform/resolvers/zod";
import { Asterisk, Image as ImageIcon, Upload, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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
import { MAX_IMAGE_COUNT } from "@/constants/product.constant";
import { useGetCategoryList } from "@/hooks/useCategory";
import { usePostProduct } from "@/hooks/useProduct";
import { type PostProductRequest } from "@/types/product.types";
import { limitNumber } from "@/utils/number.utils";

// TODO: 해당 페이지 리팩토링 필요 (컴포넌트 분리)

const formSchema = z.object({
  // 서버 400 error message
  // "title should not be empty"
  // "price must be a positive number"
  // "description should not be empty"
  // "images must contain at least 1 elements"

  title: z.string().min(1, {
    message: "Product title is required"
  }),

  // https://zod.dev/api?id=coercion
  // (zod input data를 적절한 type로 coerce(강요, 강제) 함
  // -> 하지만, unknown 타입이 돼서 typescript에서 타입 에러가 발생
  // -> input 쪽에 e.target.value를 Number로 변환하는 방식으로 변경)
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
  // https://zod.dev/v4/changelog?id=zarray (zod empty array 선언 방법)
  images: z.array(z.string().min(1), {
    message: "Product must have at least one image"
  })
});

// TODO: 페이지 컴포넌트 분리 필요

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const { mutate: postProduct, isSuccess, isPending } = usePostProduct();
  const { data: categoryList, isLoading, isError } = useGetCategoryList();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 카테고리 Select placeholder 메시지 결정
  const getCategoryPlaceholder = (fieldValue: number | null) => {
    // 값이 선택되지 않았을 때만 placeholder 표시
    if (isLoading) return "Loading...";

    if (isError) return "Failed to load categories. Please refresh.";

    if (fieldValue === null) return "Select a category";
  };

  // TODO: useEffect 대신 사용할 방법 찾아보기 -> mutation은 onSuccess 아직 있다고 확인됨
  // React Query v5 스타일: useEffect를 사용한 side effect 처리
  //https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose
  useEffect(() => {
    if (isSuccess) {
      toast.success("상품이 성공적으로 등록되었습니다.");
      navigate("/product");
    }
  }, [isSuccess, navigate]);

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
    // for문 files.length 유효성 검사
    // -> 파일이 없다면 변경할 필요 없음
    if (!files || files.length === 0) return;

    const currentImages = form.getValues("images");
    const newImages = [...currentImages];

    // 선택된 파일 수만큼 랜덤 이미지 URL 생성
    for (let i = 0; i < files.length; i++) {
      if (newImages.length >= MAX_IMAGE_COUNT) {
        toast.error(`You can upload up to ${MAX_IMAGE_COUNT} images.`);
        break;
      }
      const newImageUrl = generateRandomImageUrl();
      newImages.push(newImageUrl);
    }

    form.setValue("images", newImages);

    // 파일 입력 초기화
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

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // zod로 이미 유효성 검사를 통과했기 때문에 as PostProductRequest로 타입 캐스팅
    postProduct(data as PostProductRequest);
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
          onSubmit={form.handleSubmit(onSubmit)}
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
                    disabled={isLoading || isPending}
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
                      disabled={isLoading || isPending}
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
                    disabled={isLoading || isPending}
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
                    disabled={isLoading || isError}
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
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isLoading || isPending}
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
                                disabled={isLoading || isPending}
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
                          JPG, PNG, GIF files can be selected or dragged and
                          dropped to upload
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
                        disabled={isLoading || isPending}
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
              onClick={() => navigate("/product")}
              disabled={isLoading || isPending}
            />
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || isPending}
            >
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductCreatePage;
