import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Layout } from "@/components/layout";

import Home from "@/pages/home";
import GamePage from "@/pages/game";
import DailyChallenge from "@/pages/daily";
import Leaderboard from "@/pages/leaderboard";
import SignInPage from "@/pages/sign-in";
import NotFound from "@/pages/not-found";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <svg viewBox="0 0 200 200" className="w-16 h-16 animate-pulse">
          <defs>
            <radialGradient id="bh-loading" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="black"/>
              <stop offset="100%" stopColor="#6b21a8"/>
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="70" fill="#a855f715" />
          <ellipse cx="100" cy="100" rx="60" ry="18" fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.7" />
          <circle cx="100" cy="100" r="30" fill="url(#bh-loading)" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="#c084fc" strokeWidth="2" />
        </svg>
        <p className="text-muted-foreground text-sm font-mono animate-pulse">INITIALIZING SYSTEMS...</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) return <AuthLoadingScreen />;

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/game"><GamePage mode="solo" /></Route>
        <Route path="/daily" component={DailyChallenge} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/sign-in" component={SignInPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
        </QueryClientProvider>
      </AuthProvider>
    </WouterRouter>
  );
}

export default App;
