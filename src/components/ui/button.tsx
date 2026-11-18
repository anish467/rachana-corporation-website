import Link from "next/link";
import type {ComponentProps, ReactNode} from "react";

type Variant = "dark" | "light" | "outline" | "text" | "nav";

const variantClass: Record<Variant, string> = {
  dark: "button button-dark",
  light: "button button-light",
  outline: "button button-outline",
  text: "text-link",
  nav: "nav-cta",
};

type Shared = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type LinkButton = Shared & {href: string} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;
type NativeButton = Shared & {href?: undefined} & Omit<ComponentProps<"button">, "className" | "children">;

export function Button({variant = "dark", className = "", children, ...props}: LinkButton | NativeButton) {
  const classes = [variantClass[variant], className].filter(Boolean).join(" ");
  if ("href" in props && typeof props.href === "string") {
    const {href, ...rest} = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...(props as Omit<ComponentProps<"button">, "className" | "children">)}>
      {children}
    </button>
  );
}
