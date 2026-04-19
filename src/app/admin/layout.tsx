/** Корневой layout /admin: без проверки авторизации (страница входа). Защищённые страницы — в группе `(protected)`. */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
