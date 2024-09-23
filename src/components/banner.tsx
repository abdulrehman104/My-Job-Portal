import { cva, VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const bannerVarient = cva(
  " mt-4 flex items-center gap-x-2 rounded-md border p-4 text-sm shadow-md",
  {
    variants: {
      variant: {
        warning: "text-primary border-yellow-300 bg-yellow-200/80",
        success: "text-secondary border-emerald-300 bg-emerald-500/80",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  },
);

const iconsMap = {
  warning: AlertTriangle,
  success: CheckCircle,
};

interface BannerProps extends VariantProps<typeof bannerVarient> {
  label: String;
}

export const Banner = ({ label, variant }: BannerProps) => {
  const Icon = iconsMap[variant || "warning"];
  return (
    <div className={cn(bannerVarient({ variant }))}>
      <Icon className="mr-2 size-6  " />
      {label}
    </div>
  );
};
