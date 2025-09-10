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
  const { mutate: putProduct, isPending } = usePutProduct({
    onSuccess: () => {
      toast.success("Product updated successfully.");
      navigate(`/product/${id}`);
    },
    onError: () => {
      toast.error("Failed to update product.");
    }
  });
  const { data: product, isLoading, isError } = useGetProduct(Number(id));

  const handleSubmit = (data: ProductEditFormData) => {
    putProduct({ id: Number(id), product: data });
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
