import Link from "next/link";

export type NavItem = {
  href: string;
  label: string;
};

type NavProps = {
  items: NavItem[];
};

export function Nav({ items }: NavProps) {
  return (
    <nav className="app-nav" aria-label="Secciones internas">
      {items.map((item) => (
        <Link className="app-nav-link" href={item.href} key={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
