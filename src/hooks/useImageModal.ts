import { useState } from "react";

// 이미지 확대 보기 모달 훅
const useImageModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageAlt, setImageAlt] = useState<string>("");

  const openModal = (imageUrl: string, alt: string = "Image") => {
    setSelectedImage(imageUrl);
    setImageAlt(alt);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage("");
    setImageAlt("");
  };

  return {
    isOpen,
    selectedImage,
    imageAlt,
    openModal,
    closeModal
  };
};

export { useImageModal };
