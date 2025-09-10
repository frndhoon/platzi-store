import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductImageCarouselProps {
  images?: string[];
  productTitle?: string;
  isLoading: boolean;
  onImageClick: (imageUrl: string, alt: string) => void;
}

const ProductImageCarousel = ({
  images,
  productTitle,
  isLoading,
  onImageClick
}: ProductImageCarouselProps) => {
  if (isLoading) {
    return (
      <div className="w-full">
        <Skeleton className="w-full min-h-[50vh] max-h-[50vh] rounded-lg" />
      </div>
    );
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Carousel>
      <CarouselContent className="min-h-[50vh] max-h-[50vh]">
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <img
              src={image}
              alt={productTitle || "Product image"}
              className="w-full h-full object-cover rounded-lg cursor-pointer"
              onClick={() =>
                onImageClick(image, productTitle || "Product image")
              }
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export { ProductImageCarousel };
