import { Dialog, DialogContent } from "@/components/ui/dialog";

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
