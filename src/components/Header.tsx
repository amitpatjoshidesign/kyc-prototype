export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/setulogo.svg" alt="Setu" width={28} height={28} />
        <span className="text-lg font-semibold text-stone-900">
          Bridge <span className="text-sm font-normal text-stone-500">v4.0</span>
        </span>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-stone-600">rahul@example.com</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-setu-brand-50 text-sm font-medium text-setu-brand-800">
          R
        </div>
      </div>
    </header>
  );
}
