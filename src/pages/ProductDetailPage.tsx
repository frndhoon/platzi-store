import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { ProductActionButtons } from "@/components/product/product-action-buttons";
import { ProductImageCarousel } from "@/components/product/product-image-carousel";
import { ProductInfoSection } from "@/components/product/product-info-section";
import { BorderLine } from "@/components/shared/border-line";
import { ErrorDisplay } from "@/components/shared/error-display";
import { ImageModal } from "@/components/shared/image-modal";
import { useImageModal } from "@/hooks/useImageModal";
import { useDeleteProduct, useGetProduct } from "@/hooks/useProduct";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = Number(id);

  const { data: product, isLoading, error, refetch } = useGetProduct(productId);
  const { mutate: deleteProduct } = useDeleteProduct({
    onSuccess: () => {
      toast.success("Product deleted successfully.");
      navigate("/product");
    },
    onError: () => {
      toast.error("Failed to delete product.");
    }
  });

  const { isOpen, selectedImage, imageAlt, openModal, closeModal } =
    useImageModal();

  const handleDelete = (): void => {
    deleteProduct(productId);
  };

  const handleEdit = (): void => {
    navigate(`/product/${productId}/edit`);
  };

  // 에러 발생 시
  if (error) {
    return <ErrorDisplay onRefetch={refetch} error={error} />;
  }

  // 상품 데이터가 없을 때
  if (!product && !isLoading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Product not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col gap-6">
        {/* 상품 이미지들 */}
        <ProductImageCarousel
          images={product?.images}
          productTitle={product?.title}
          isLoading={isLoading}
          onImageClick={openModal}
        />

        <BorderLine />

        {/* 상품 정보 */}
        <ProductInfoSection product={product} isLoading={isLoading} />

        <BorderLine />

        {/* 액션 버튼들 */}
        <ProductActionButtons
          onDelete={handleDelete}
          onEdit={handleEdit}
          disabled={isLoading}
        />
      </div>

      <ImageModal
        isOpen={isOpen}
        onClose={closeModal}
        imageUrl={selectedImage}
        imageAlt={imageAlt}
      />
    </div>
  );
};

export default ProductDetailPage;
