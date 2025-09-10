import { Asterisk, Image as ImageIcon, Upload, X } from "lucide-react";
import { useRef } from "react";
import { type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { ImageModal } from "@/components/shared/image-modal";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { MAX_IMAGE_COUNT } from "@/constants/product.constant";
import { useImageModal } from "@/hooks/useImageModal";

type ImageUploadFormProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  disabled?: boolean;
};

// 랜덤 이미지 URL 생성 함수
const generateRandomImageUrl = () => {
  const randomId = Math.floor(Math.random() * 1000) + 1;
  return `https://picsum.photos/id/${randomId}/300`;
};

const ImageUploadForm = ({ form, disabled = false }: ImageUploadFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, selectedImage, imageAlt, openModal, closeModal } =
    useImageModal();

  // 파일 첨부 버튼 클릭 핸들러
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const currentImages = form.getValues("images");
    const newImages = [...currentImages];

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PNG and JPG files are allowed.");
        continue;
      }

      if (file.size > maxFileSize) {
        toast.error("File size must be less than 5MB.");
        continue;
      }

      if (newImages.length >= MAX_IMAGE_COUNT) {
        toast.error(`You can upload up to ${MAX_IMAGE_COUNT} images.`);
        break;
      }

      const newImageUrl = generateRandomImageUrl();
      newImages.push(newImageUrl);
    }

    form.setValue("images", newImages);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 이미지 삭제 함수
  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    const newImages = currentImages.filter(
      (_: string, i: number) => i !== index
    );
    form.setValue("images", newImages);
  };

  // 이미지 클릭 핸들러
  const handleImageClick = (imageUrl: string, index: number) => {
    openModal(imageUrl, `Uploaded image ${index + 1}`);
  };

  return (
    <>
      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Images <Asterisk className="w-3 h-3 text-red-500" />
            </FormLabel>
            <FormControl>
              <div className="space-y-3">
                {/* 숨겨진 파일 입력 */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={disabled}
                />

                {/* 이미지 미리보기 */}
                {field.value.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {field.value.map((imageUrl: string, index: number) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
                          <img
                            src={imageUrl}
                            alt={`Uploaded image ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                            onClick={() => handleImageClick(imageUrl, index)}
                          />
                        </div>
                        {field.value.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            disabled={disabled}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Upload images
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-300">
                      JPG, PNG files can be selected to upload
                    </p>
                  </div>
                )}

                {/* 파일 첨부 버튼 */}
                {field.value.length < MAX_IMAGE_COUNT ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFileUpload}
                    className="w-full"
                    disabled={disabled}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select files ({field.value.length}/{MAX_IMAGE_COUNT})
                  </Button>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    You can upload up to{" "}
                    <span className="font-bold text-red-500">
                      {MAX_IMAGE_COUNT} images.
                    </span>
                  </p>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 이미지 확대 모달 */}
      <ImageModal
        isOpen={isOpen}
        onClose={closeModal}
        imageUrl={selectedImage}
        imageAlt={imageAlt}
      />
    </>
  );
};

export { ImageUploadForm };
