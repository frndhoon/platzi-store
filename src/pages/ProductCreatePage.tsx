import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { usePostProduct } from "@/hooks/useProducts";
import { type PostProductRequest } from "@/types/product";

const formSchema = z.object({
  // 서버 400 error message
  // "title should not be empty"
  // "price must be a positive number"
  // "description should not be empty"
  // "images must contain at least 1 elements"

  title: z.string().min(1, {
    message: "상품 제목은 필수입니다."
  }),

  // https://zod.dev/api?id=coercion
  // (zod input data를 적절한 type로 coerce(강요, 강제) 함
  // -> 하지만, unknown 타입이 돼서 typescript에서 타입 에러가 발생
  // -> input 쪽에 e.target.value를 Number로 변환하는 방식으로 변경)
  price: z.number().min(1, {
    message: "가격은 1달러 이상이어야합니다."
  }),
  description: z.string().min(1, {
    message: "상품 설명은 필수입니다."
  }),
  categoryId: z.number().min(1, {
    message: "카테고리 ID는 1 이상이어야합니다."
  }),
  // https://zod.dev/v4/changelog?id=zarray (zod empty array 선언 방법)
  images: z.array(z.string().min(1), {
    message: "상품은 하나 이상의 이미지가 필요합니다."
  })
});

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const { mutate: postProduct } = usePostProduct();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      price: 1,
      description: "",
      categoryId: 1,
      images: [""]
    }
  });

  const onSubmit = (data: PostProductRequest) => {
    postProduct(data);
  };

  return (
    <>
      <h1 className="mb-2">상품 등록</h1>

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
                <FormLabel>제목</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="고유한 상품 제목을 입력하세요."
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
                <FormLabel>가격</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                <FormLabel>설명</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="상품 설명을 입력하세요." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>카테고리 ID</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
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
                <FormLabel>이미지 URL</FormLabel>
                <FormControl>
                  <Input
                    value={field.value[0]}
                    onChange={(e) => field.onChange([e.target.value])}
                    placeholder="https://placehold.co/600x400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row gap-2">
            <Button
              type="button"
              onClick={() => navigate("/product")}
              className="flex-1"
              variant="outline"
            >
              취소
            </Button>
            <Button type="submit" className="flex-1">
              등록하기
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ProductCreatePage;
