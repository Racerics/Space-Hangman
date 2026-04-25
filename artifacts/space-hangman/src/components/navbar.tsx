import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { user, signOut } = useAuth();
  const [location] = useLocation();

  const isAuthPage = location.startsWith("/sign-in");
  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        <div className="flex flex-1 items-center justify-between">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Space Hangman" className="h-8 w-8" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <span className="hidden font-bold sm:inline-block text-primary" style={{ textShadow: "0 0 10px rgba(168,85,247,0.6)" }}>
                SPACE HANGMAN
              </span>
            </Link>
            <Link href="/game" className="transition-colors hover:text-primary">Solo</Link>
            <Link href="/daily" className="transition-colors hover:text-primary">Daily</Link>
            <Link href="/leaderboard" className="transition-colors hover:text-primary">Leaderboard</Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-primary/30">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {(user.displayName || user.email || "?").substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm text-muted-foreground">
                  {user.displayName || user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-muted-foreground hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90" style={{ boxShadow: "0 0 10px rgba(168,85,247,0.4)" }}>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
