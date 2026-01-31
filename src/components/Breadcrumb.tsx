import { CaretRight } from "@phosphor-icons/react/dist/ssr";

const items = ["Home", "UPI", "KYC", "Manual KYC"];

export default function Breadcrumb() {
  return (
    <nav className="py-3">
      <ol className="flex items-center gap-1.5 text-sm">
        {items.map((item, i) => (
          <li key={item} className="flex items-center gap-1.5">
            {i > 0 && (
              <CaretRight
                size={16}
                weight="bold"
                className="text-muted-foreground"
              />
            )}
            <span
              className={
                i === items.length - 1
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground cursor-pointer"
              }
            >
              {item}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
