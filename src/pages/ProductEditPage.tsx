import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import {
  ProductEditForm,
  type ProductEditFormData
} from "@/components/product/product-edit-form";
import { useGetProduct, usePutProduct } from "@/hooks/useProduct";

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutate: putProduct, isPending } = usePutProduct();
  const { data: product, isLoading, isError } = useGetProduct(Number(id));

  const handleSubmit = (data: ProductEditFormData) => {
    putProduct(
      { id: Number(id), product: data },
      {
        onSuccess: () => {
          toast.success("상품이 성공적으로 업데이트되었습니다.");
          navigate(`/product/${id}`);
        }
      }
    );
  };

  const handleCancel = () => {
    navigate(`/product/${id}`);
  };

  const handleErrorReturn = () => {
    navigate("/product");
  };

  return (
    <ProductEditForm
      product={product}
      isLoading={isLoading}
      isError={isError}
      isPending={isPending}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onErrorReturn={handleErrorReturn}
    />
  );
};

export default ProductEditPage;
