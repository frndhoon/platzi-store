import { Button } from "@/components/ui/button";

type CancelButtonProps = {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const CancelButton = ({ className, onClick, disabled }: CancelButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      Cancel
    </Button>
  );
};

export { CancelButton };
