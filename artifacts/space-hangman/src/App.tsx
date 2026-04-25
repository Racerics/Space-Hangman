import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth-context";
import { Layout } from "@/components/layout";

import Home from "@/pages/home";
import GamePage from "@/pages/game";
import DailyChallenge from "@/pages/daily";
import Leaderboard from "@/pages/leaderboard";
import SignInPage from "@/pages/sign-in";
import NotFound from "@/pages/not-found";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function AppRoutes() {
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
