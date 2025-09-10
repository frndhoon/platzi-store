import { useNavigate } from "react-router";
import { toast } from "sonner";

import { ProductCreateForm } from "@/components/product/product-create-form";
import { useGetCategoryList } from "@/hooks/useCategory";
import { usePostProduct } from "@/hooks/useProduct";
import { type PostProductRequest } from "@/types/product.types";

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const { mutate: postProduct, isPending } = usePostProduct({
    onSuccess: () => {
      toast.success("상품이 성공적으로 등록되었습니다.");
      navigate("/product");
    }
  });
  const { data: categoryList, isLoading, isError } = useGetCategoryList();

  const handleSubmit = (data: PostProductRequest) => {
    postProduct(data);
  };

  const handleCancel = () => {
    navigate("/product");
  };

  return (
    <ProductCreateForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isPending={isPending}
      categoryList={categoryList}
      isCategoryLoading={isLoading}
      isCategoryError={isError}
    />
  );
};

export default ProductCreatePage;
