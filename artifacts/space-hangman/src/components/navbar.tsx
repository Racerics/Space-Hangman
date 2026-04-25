import { Link, useLocation } from "wouter";
import { useUser, UserButton, SignOutButton } from "@clerk/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { isSignedIn } = useUser();
  const [location] = useLocation();

  const isAuthPage = location.startsWith("/sign-in") || location.startsWith("/sign-up");

  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        <div className="flex flex-1 items-center justify-between">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Space Hangman" className="h-8 w-8" />
              <span className="hidden font-bold sm:inline-block glitch-text text-primary">
                SPACE HANGMAN
              </span>
            </Link>
            <Link href="/game" className="transition-colors hover:text-primary">
              Solo
            </Link>
            <Link href="/daily" className="transition-colors hover:text-primary">
              Daily
            </Link>
            <Link href="/leaderboard" className="transition-colors hover:text-primary">
              Leaderboard
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <SignOutButton>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                    Sign Out
                  </Button>
                </SignOutButton>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 glow-box">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
