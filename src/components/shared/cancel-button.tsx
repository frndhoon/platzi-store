import { Button } from "@/components/ui/button";

type CancelButtonProps = {
  className?: string;
  onClick?: () => void;
};

const CancelButton = ({ className, onClick }: CancelButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className={className}
    >
      Cancel
    </Button>
  );
};

export { CancelButton };
