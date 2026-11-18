
import Link from "next/link";
import Image from "next/image";

export function Brand({light = false}: {light?: boolean}) {
  return (
    <Link
      href="/"
      className={`brand ${light ? "brand-light" : ""}`}
      aria-label="Rachana Corporation home"
    >
      <Image
        src="https://res.cloudinary.com/dubztdfp6/image/upload/v1794989438/logo-2-Photoroom.png"
        alt="Rachana Corporation logo"
        width={65}
        height={60}
        priority
        className="brand-logo"
      />

    <span className="brand-name">
      <strong>RACHANA</strong>
      <span>CORPORATION</span>
    </span>
    </Link>
  );
}
