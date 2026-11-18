import type {ReactNode} from "react";

type Level = "h1" | "h2" | "h3";

export function Heading({
  as = "h2",
  eyebrow,
  children,
  light = false,
  className = "",
  id,
}: {
  as?: Level;
  eyebrow?: ReactNode;
  children: ReactNode;
  light?: boolean;
  className?: string;
  id?: string;
}) {
  const Tag = as;
  return (
    <div className={className}>
      {eyebrow ? <span className={light ? "eyebrow eyebrow-light" : "eyebrow"}>{eyebrow}</span> : null}
      <Tag id={id}>{children}</Tag>
    </div>
  );
}
