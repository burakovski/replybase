"use client";

import React from "react";
import Link from "next/link";
import { motion, type MotionProps } from "motion/react";
import { cn } from "@/lib/utils";

const animationProps: MotionProps = {
  initial: { "--x": "120%" } as MotionProps["initial"],
  animate: { "--x": "-120%" } as MotionProps["animate"],
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1.2,
    duration: 1.6,
    ease: "linear",
  },
};

type ShinyButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  /** Light fill + dark label — use on dark cards */
  inverse?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps>;

export const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(
  ({ children, className, href, inverse = false, ...props }, ref) => {
    const classes = cn(
      "btn btn-shiny relative inline-flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border-0 px-5 py-3 text-sm font-semibold isolate",
      inverse && "btn-shiny-inverse",
      className,
    );

    const shine = (
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
        style={{
          backgroundImage:
            "linear-gradient(-75deg,transparent calc(var(--x) + 18%),color-mix(in srgb, var(--shiny-fg) 22%, transparent) calc(var(--x) + 28%),transparent calc(var(--x) + 38%))",
        }}
        {...animationProps}
      />
    );

    const label = (
      <span className="btn-shiny-label relative z-[1] inline-flex items-center justify-center text-center text-sm font-semibold leading-none">
        {children}
      </span>
    );

    if (href) {
      return (
        <Link href={href} className={classes}>
          {shine}
          {label}
        </Link>
      );
    }

    return (
      <button ref={ref} type="button" className={classes} {...props}>
        {shine}
        {label}
      </button>
    );
  },
);

ShinyButton.displayName = "ShinyButton";
