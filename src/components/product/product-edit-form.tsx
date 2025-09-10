import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { BorderLine } from "@/components/shared/border-line";
import { CancelButton } from "@/components/shared/cancel-button";
import { ImageModal } from "@/components/shared/image-modal";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
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
import { useImageModal } from "@/hooks/useImageModal";
import { type Product } from "@/types/product.types";
import { limitNumber } from "@/utils/number.utils";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Product title is required"
  }),
  price: z.number().min(1, {
    message: "Price must be greater than 1"
  })
});

export type ProductEditFormData = z.infer<typeof formSchema>;

interface ProductEditFormProps {
  product?: Product;
  isLoading: boolean;
  isError: boolean;
  isPending: boolean;
  onSubmit: (data: ProductEditFormData) => void;
  onCancel: () => void;
  onErrorReturn: () => void;
}

const ProductEditForm = ({
  product,
  isLoading,
  isError,
  isPending,
  onSubmit,
  onCancel,
  onErrorReturn
}: ProductEditFormProps) => {
  const { isOpen, selectedImage, imageAlt, openModal, closeModal } =
    useImageModal();

  // product 데이터가 불러와졌는지 확인하는 조건
  const isProductLoaded = product && !isLoading;

  const form = useForm<ProductEditFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      price: 0
    }
  });

  // product 데이터가 불러와졌을 때 form 값 업데이트
  useLayoutEffect(() => {
    if (product) {
      form.reset({
        title: product.title,
        price: product.price
      });
    }
  }, [product, form]);

  const handleSubmit = (data: ProductEditFormData) => {
    onSubmit(data);
  };

  // Error 상태 처리
  if (isError) {
    return (
      <div className="flex flex-col gap-3 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600">
            Failed to load product
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            The product does not exist or a server error occurred.
          </p>
          <Button onClick={onErrorReturn} className="mt-4" variant="outline">
            Back to Product List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Product Edit</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Edit the product information below.
        </p>
        <p className="text-sm justify-end flex items-center gap-1">
          <Pencil className="w-3 h-3 text-red-500" />
          means can edit fields
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
                  Title <Pencil className="w-3 h-3 text-red-500" />
                </FormLabel>
                <FormControl>
                  {isProductLoaded ? (
                    <Input
                      {...field}
                      placeholder="Enter a unique product title"
                      disabled={isPending}
                      minLength={1}
                      maxLength={50}
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
                  Price <Pencil className="w-3 h-3 text-red-500" />
                </FormLabel>
                <FormControl>
                  {isProductLoaded ? (
                    <div className="relative">
                      <Input
                        type="number"
                        {...field}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          field.onChange(limitNumber(e.target.value, 1, 1000))
                        }
                        disabled={isPending}
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 select-none">
                        $
                      </span>
                    </div>
                  ) : (
                    <Skeleton className="h-9 w-full" />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <BorderLine />

          <div className="flex flex-col gap-3 cursor-not-allowed text-gray-500 dark:text-gray-400">
            <div className="flex flex-col gap-2 ">
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
                <div className="w-full max-w-md mx-auto">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {product.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer">
                            <img
                              src={image}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onClick={() => openModal(image, product.title)}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {product.images.length > 1 && (
                      <>
                        <CarouselPrevious className="hidden sm:flex" />
                        <CarouselNext className="hidden sm:flex" />
                      </>
                    )}
                  </Carousel>
                </div>
              ) : (
                <div className="w-full max-w-md mx-auto">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Description</Label>
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

          <BorderLine />

          <div className="flex flex-row gap-2">
            <CancelButton className="flex-1" onClick={onCancel} />
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

      <ImageModal
        isOpen={isOpen}
        onClose={closeModal}
        imageUrl={selectedImage}
        imageAlt={imageAlt}
      />
    </div>
  );
};

export { ProductEditForm };
