import React, { JSX } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    /**
     *  The HTML element you're looking to use.
     */
    variant: {
      h1: "text-foreground text-4xl lg:text-5xl tracking-tight font-black my-2",
      h2: "text-foreground text-3xl font-bold my-2",
      h3: "text-foreground text-2xl font-bold my-1.5",
      h4: "text-foreground text-xl font-medium my-1.5",
      h5: "text-foreground text-lg font-medium my-1",
      p: "text-foreground-light text-base my-0.5",
      lead: "text-foreground-muted text-base my-0.5",
    },
  },
});

type Text = Extract<
  keyof JSX.IntrinsicElements,
  "p" | "h1" | "h2" | "h3" | "h4" | "h5"
>;

export type TextProps = React.HTMLProps<Text> &
  VariantProps<typeof textVariants>;

/** Includes a set of styled h1, h2, ..., h5 and p elements made for reusability */
const Text = React.forwardRef<Text, TextProps>(
  ({ children, className, variant, ...props }, ref) => {
    if (!variant) throw new Error("[Text] Variant is required");
    const ElementType = variant == "lead" ? "span" : variant;
    return (
      // @ts-ignore
      <ElementType
        className={cn(textVariants({ variant, className }))}
        {...(ref ? { ref } : {})}
        {...props}>
        {children}
      </ElementType>
    );
  }
);

Text.displayName = "Text";

export default Text;
