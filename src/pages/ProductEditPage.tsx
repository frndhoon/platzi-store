import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";

import { BorderLine } from "@/components/shared/border-line";
import { RequiredSpan } from "@/components/shared/required-span";
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
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useGetProduct, usePutProduct } from "@/hooks/useProduct";

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutate: putProduct, isPending } = usePutProduct();

  const { data: product, isLoading, isError } = useGetProduct(Number(id));

  // product 데이터가 불러와졌는지 확인하는 조건
  const isProductLoaded = product && !isLoading;

  const formSchema = z.object({
    title: z.string().min(1, {
      message: "Product title is required"
    }),
    price: z.number().min(1, {
      message: "Price must be greater than 1"
    })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      price: 0
    }
  });

  // TODO: useLayoutEffect 대신 사용할 방법 찾아보기
  // product 데이터가 불러와졌을 때 form 값 업데이트
  useLayoutEffect(() => {
    if (product) {
      form.reset({
        title: product.title,
        price: product.price
      });
    }
  }, [product, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    putProduct({ id: Number(id), product: data });
  };

  // Error 상태 처리
  if (isError) {
    return (
      <div className="flex flex-col gap-3 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600">
            상품을 불러올 수 없습니다
          </h2>
          <p className="text-gray-600 mt-2">
            존재하지 않는 상품이거나 서버 오류가 발생했습니다.
          </p>
          <Button
            onClick={() => navigate("/product")}
            className="mt-4"
            variant="outline"
          >
            상품 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Product Edit</h1>
        <p className="text-sm text-gray-600">
          Edit the product information below.
        </p>
        <p className="text-sm text-right">
          <RequiredSpan /> means required fields
        </p>
      </div>

      <BorderLine />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Product Information</h2>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              {isProductLoaded ? (
                <Input value={product.category.name} disabled />
              ) : (
                <Skeleton className="w-full h-9" />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Images</Label>
              {isProductLoaded ? (
                <div className="flex gap-2 flex-wrap">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  <Skeleton className="w-20 h-20 rounded-md" />
                  <Skeleton className="w-20 h-20 rounded-md" />
                  <Skeleton className="w-20 h-20 rounded-md" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Updated At</Label>
              {isProductLoaded ? (
                <Input
                  value={
                    product.updatedAt
                      ? new Date(product.updatedAt).toLocaleString("en-US")
                      : "Not available"
                  }
                  disabled
                />
              ) : (
                <Skeleton className="h-9 w-full" />
              )}
            </div>
          </div>
        </div>

        <BorderLine />

        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <h2 className="text-lg font-semibold">Edit Product</h2>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <RequiredSpan />
                  </FormLabel>
                  <FormControl>
                    {isProductLoaded ? (
                      <Input
                        {...field}
                        placeholder="Enter a unique product title"
                      />
                    ) : (
                      <Skeleton className="h-9 w-full" />
                    )}
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
                    Price <RequiredSpan />
                  </FormLabel>
                  <FormControl>
                    {isProductLoaded ? (
                      <Input
                        type="number"
                        {...field}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          field.onChange(Number(e.target.value))
                        }
                      />
                    ) : (
                      <Skeleton className="h-9 w-full" />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Description</label>
                {isProductLoaded ? (
                  <Textarea
                    value={product.description}
                    disabled
                    className="bg-gray-50"
                  />
                ) : (
                  <Skeleton className="h-20 w-full" />
                )}
              </div>
            </div>

            <BorderLine />

            <div className="flex flex-row gap-2">
              <Button
                type="button"
                onClick={() => navigate("/product")}
                className="flex-1"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || isPending}
              >
                Update
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProductEditPage;
