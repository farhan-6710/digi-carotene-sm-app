import { Children } from "react";
import { motion } from "framer-motion";

import {
  SECTION_STAGGER_CONTAINER,
  SECTION_STAGGER_ITEM,
} from "@/shared/constants/pageMotion";
import type { PageContentProps } from "@/shared/types/components";
import { cn } from "@/shared/lib/utils";

/** Staggers each direct child on route enter. Override gap via className (e.g. space-y-6). */
export function PageContent({ className, children }: PageContentProps) {
  return (
    <motion.div
      className={cn("w-full min-w-0 space-y-8", className)}
      variants={SECTION_STAGGER_CONTAINER}
      initial="hidden"
      animate="show"
    >
      {Children.toArray(children).map((child, index) => (
        <motion.div
          key={index}
          className="w-full min-w-0"
          variants={SECTION_STAGGER_ITEM}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
