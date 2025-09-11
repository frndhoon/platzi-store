import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog";

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt: string;
};

// 이미지 확대 보기 모달
const ImageModal = ({
  isOpen,
  onClose,
  imageUrl,
  imageAlt
}: ImageModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[90vw] max-h-[90vh] p-0 border-0 bg-transparent shadow-none cursor-zoom-out"
        showCloseButton={false}
        onPointerDown={onClose}
      >
        {/* 접근성을 위한 숨겨진 제목과 설명 */}
        <DialogTitle className="sr-only">이미지 확대 보기</DialogTitle>
        <DialogDescription className="sr-only">
          {imageAlt || "이미지"}를 확대하여 보여주는 모달입니다. 클릭하거나 ESC
          키를 눌러 닫을 수 있습니다.
        </DialogDescription>

        <div className="flex items-center justify-center" onClick={onClose}>
          {/* isOpen이 true이고 imageUrl이 있을 때만, 이미지 렌더링 */}
          {isOpen && imageUrl && (
            <img
              src={imageUrl}
              alt={imageAlt || "Image"}
              className="max-w-full max-h-[85vh] object-contain rounded-lg cursor-zoom-out"
              onClick={onClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ImageModal };
