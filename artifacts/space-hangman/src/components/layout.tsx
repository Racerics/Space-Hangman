import { Navbar } from "./navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
