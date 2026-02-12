import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";

const items = [
  { label: "Home", href: "/" },
  { label: "BBPS" },
  { label: "KYC" },
  { label: "BOU KYC" },
];

export default function BbpsBreadcrumb() {
  return (
    <nav className="hidden md:block py-3">
      <ol className="flex items-center gap-1.5 text-sm">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && (
              <CaretRight
                size={16}
                weight="bold"
                className="text-muted-foreground"
              />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  i === items.length - 1
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground cursor-pointer"
                }
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
