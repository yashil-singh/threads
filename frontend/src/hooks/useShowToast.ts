import { useToast } from "@/components/ui/use-toast";

interface ShowToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

const useShowToast = () => {
  const { toast } = useToast();

  const showToast = ({
    title = "",
    description,
    variant = "default",
    duration = 3000,
  }: ShowToastProps) => {
    toast({
      title,
      description,
      duration,
      variant,
    });
  };

  return { showToast };
};

export default useShowToast;
