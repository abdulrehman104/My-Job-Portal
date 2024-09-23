import { cva, VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const backgroundVarient = cva("rounded-full", {
  variants: {
    variant: {
      default: "bg-purple-100",
      success: "bg-emerald-100 ",
    },
    size: {
      default: "p-2",
      sm: "p-1",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const iconVarient = cva("", {
  variants: {
    variant: {
      default: "text-purple-700",
      success: "text-emerald-700 ",
    },
    size: {
      default: "size-8",
      sm: "size-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type BackgroundVarientProps = VariantProps<typeof backgroundVarient>;
type IconVarientProps = VariantProps<typeof iconVarient>;

interface IconBadgeProps extends BackgroundVarientProps, IconVarientProps {
  icon: LucideIcon;
}

export const IconBadge = ({ icon: Icon, variant, size }: IconBadgeProps) => {
  return (
    <div className={cn(backgroundVarient({ variant, size }))}>
      <Icon className={cn(iconVarient({ variant, size }))} />
    </div>
  );
};
