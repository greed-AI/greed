import Link from "next/link";

type AuthPrimaryButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  href?: string;
  className?: string;
};

export function AuthPrimaryButton({
  children,
  type = "button",
  disabled = false,
  href,
  className = "",
}: AuthPrimaryButtonProps) {
  const classes = `group relative w-full overflow-hidden rounded-full px-10 py-4 text-sm font-medium tracking-wide text-black transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${className}`;

  const inner = (
    <>
      <span className="absolute inset-0 bg-linear-to-r from-gold-dark via-gold-light to-gold animate-shimmer bg-size-[200%_auto]" />
      <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-disabled:opacity-0 bg-linear-to-r from-gold-light via-white/90 to-gold-light" />
      <span className="relative">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes}>
      {inner}
    </button>
  );
}

type AuthGhostButtonProps = {
  children: React.ReactNode;
  href: string;
  className?: string;
};

export function AuthGhostButton({
  children,
  href,
  className = "",
}: AuthGhostButtonProps) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center justify-center rounded-full border border-gold/25 bg-gold/5 px-10 py-4 text-sm font-medium tracking-wide text-gold-light transition-all duration-300 hover:border-gold/40 hover:bg-gold/10 hover:scale-[1.01] active:scale-[0.99] ${className}`}
    >
      {children}
    </Link>
  );
}
