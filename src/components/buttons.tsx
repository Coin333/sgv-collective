import Link, { type LinkProps } from "next/link";
import { type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";

const styles: Record<Variant, string> = {
  primary: "bg-[#1d1d1f] hover:bg-black text-white",
  secondary: "bg-white hover:bg-[#f5f5f7] text-[#1d1d1f]",
  ghost: "bg-transparent hover:bg-[#f5f5f7] text-[#1d1d1f]",
  outline: "border border-[#1d1d1f]/20 hover:border-[#1d1d1f] text-[#1d1d1f]",
};

type CTAProps = Omit<LinkProps, "href"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | "href"> & {
    href: string;
    variant?: Variant;
    children: ReactNode;
    size?: "md" | "lg";
    external?: boolean;
  };

export function CTAButton({
  href,
  variant = "primary",
  size = "md",
  external,
  className,
  children,
  ...rest
}: CTAProps) {
  const sizeCls = size === "lg" ? "px-6 py-3 text-base" : "px-5 py-2.5 text-sm";
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 cursor-pointer",
    sizeCls,
    styles[variant],
    className,
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
