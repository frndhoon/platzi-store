import { BorderLine } from "@/components/shared/border-line";
import { DeleteButton } from "@/components/shared/delete-button";
import { ErrorDisplay } from "@/components/shared/error-display";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteProduct, useGetProduct } from "@/hooks/useProduct";

type ProductModalProps = {
  productId: number;
  isOpen: boolean;
  onClose: () => void;
};

const ProductModal = ({ productId, isOpen, onClose }: ProductModalProps) => {
  const { data: product, isLoading, error, refetch } = useGetProduct(productId);
  const { mutate: deleteProduct } = useDeleteProduct();

  const handleDelete = (): void => {
    deleteProduct(productId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Detail</DialogTitle>
        </DialogHeader>

        {/* 에러 발생 시  */}
        {error && <ErrorDisplay onRefetch={refetch} />}

        {!error && (
          <>
            {/* 로딩 중일 때 */}
            {isLoading && <Skeleton className="w-full min-h-[70vh]" />}

            {/* 데이터 있을 때 */}
            {product && (
              <div className="flex flex-col gap-4">
                {/* 상품 이미지들(배열) */}
                <div className="flex flex-col gap-2">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={product.title}
                      className="rounded-lg w-full"
                    />
                  ))}
                </div>

                <BorderLine />

                {/* 상품 정보 */}
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-semibold">{product.title}</p>
                  <p>
                    <span className="font-semibold">price</span> {product.price}
                    $
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">Description</h3>
                  <DialogDescription>{product.description}</DialogDescription>
                </div>

                <BorderLine />

                <DeleteButton onDelete={handleDelete} target="product" />
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { ProductModal };
