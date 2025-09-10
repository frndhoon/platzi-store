import { DeleteButton } from "@/components/shared/delete-button";
import { Button } from "@/components/ui/button";

interface ProductActionButtonsProps {
  onDelete: () => void;
  onEdit: () => void;
  disabled?: boolean;
}

const ProductActionButtons = ({
  onDelete,
  onEdit,
  disabled = false
}: ProductActionButtonsProps) => {
  return (
    <div className="flex flex-row gap-2">
      <DeleteButton
        onDelete={onDelete}
        target="product"
        disabled={disabled}
        className="flex-1"
      />
      <Button onClick={onEdit} className="flex-1" disabled={disabled}>
        Edit
      </Button>
    </div>
  );
};

export { ProductActionButtons };
