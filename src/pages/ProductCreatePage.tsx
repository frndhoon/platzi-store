import { zodResolver } from "@hookform/resolvers/zod";
import { Asterisk } from "lucide-react";
import { useEffect } from "react";
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
import { useGetCategoryList } from "@/hooks/useCategory";
import { usePostProduct } from "@/hooks/useProduct";
import { type PostProductRequest } from "@/types/product.types";

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

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const { mutate: postProduct, isSuccess } = usePostProduct();
  const { data: categoryList, isLoading, isError } = useGetCategoryList();

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      price: 1,
      description: "",
      categoryId: null,
      images: [""]
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
        <p className="text-sm text-gray-600">
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
                  <Input
                    type="number"
                    {...field}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.onChange(Number(e.target.value))
                    }
                  />
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

          {/* 이미지는 보통 formData 형식인데, request body에 string[]으로 들어가야함
          -> 파일 형태로 보내는 것과 달라서 [""] 형태로 전송
          -> fake api라 한계가 있음 */}

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Image URL <Asterisk className="w-3 h-3 text-red-500" />
                </FormLabel>
                <FormControl>
                  <Input
                    value={field.value[0]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.onChange([e.target.value])
                    }
                    placeholder="https://placehold.co/600x400"
                  />
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
            />
            <Button type="submit" className="flex-1">
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductCreatePage;
