import { useState } from "react";
import { useGetLeaderboard, useGetLeaderboardStats } from "@workspace/api-client-react";
import { GetLeaderboardMode } from "@workspace/api-zod";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, Trophy, Target, TargetIcon } from "lucide-react";
import { format } from "date-fns";

export default function Leaderboard() {
  const [mode, setMode] = useState<GetLeaderboardMode>("all");
  const { data: leaderboard, isLoading: isLoadingBoard } = useGetLeaderboard({ mode, limit: 50 });
  const { data: stats, isLoading: isLoadingStats } = useGetLeaderboardStats();

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 flex flex-col gap-8">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold tracking-tighter glow-text text-primary glitch-text">GALACTIC ARCHIVES</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm uppercase tracking-widest">Hall of Fame</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/40 backdrop-blur border-border/50">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Users className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Total Operatives</p>
            <p className="text-2xl font-mono text-white">
              {isLoadingStats ? <Loader2 className="w-5 h-5 animate-spin" /> : stats?.totalPlayers || 0}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/40 backdrop-blur border-border/50">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <TargetIcon className="w-8 h-8 text-secondary mb-2" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Missions Logged</p>
            <p className="text-2xl font-mono text-white">
              {isLoadingStats ? <Loader2 className="w-5 h-5 animate-spin" /> : stats?.totalGames || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur border-primary/30 glow-box">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Trophy className="w-8 h-8 text-primary mb-2" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Highest Score</p>
            <p className="text-2xl font-mono text-primary glow-text">
              {isLoadingStats ? <Loader2 className="w-5 h-5 animate-spin" /> : stats?.topScore || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur border-border/50">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Target className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Avg Score</p>
            <p className="text-2xl font-mono text-white">
              {isLoadingStats ? <Loader2 className="w-5 h-5 animate-spin" /> : Math.round(stats?.averageScore || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/60 backdrop-blur-md border-border/40 overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between border-b border-border/20 pb-6 gap-4">
          <CardTitle className="font-mono tracking-wider">Top Transmissions</CardTitle>
          <Tabs value={mode} onValueChange={(v) => setMode(v as GetLeaderboardMode)} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3 bg-background/50 border border-border/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">All Time</TabsTrigger>
              <TabsTrigger value="solo" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Solo</TabsTrigger>
              <TabsTrigger value="daily" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Daily</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingBoard ? (
            <div className="flex flex-col items-center justify-center p-12 text-primary gap-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="font-mono text-sm animate-pulse">Accessing archives...</p>
            </div>
          ) : leaderboard?.length ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border/20 hover:bg-transparent">
                  <TableHead className="w-16 text-center">Rank</TableHead>
                  <TableHead>Operative</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Streak</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Mode</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry, index) => (
                  <TableRow key={entry.id} className="border-border/10 hover:bg-white/5 transition-colors">
                    <TableCell className="text-center font-mono">
                      {index === 0 ? <span className="text-yellow-400 text-xl glow-text">1</span> : 
                       index === 1 ? <span className="text-gray-300 text-lg">2</span> : 
                       index === 2 ? <span className="text-amber-600 text-lg">3</span> : 
                       <span className="text-muted-foreground">{index + 1}</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className={`h-8 w-8 border ${index < 3 ? 'border-primary' : 'border-border/50'}`}>
                          <AvatarImage src={entry.userAvatar || undefined} />
                          <AvatarFallback className="bg-background text-xs">
                            {entry.userName?.substring(0, 2).toUpperCase() || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <span className={`font-medium ${index === 0 ? 'text-primary font-bold' : ''}`}>{entry.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-secondary glow-text">{entry.score}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{entry.streak}</TableCell>
                    <TableCell className="text-right hidden sm:table-cell">
                      <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider ${entry.mode === 'daily' ? 'bg-secondary/20 text-secondary border border-secondary/30' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                        {entry.mode}
                      </span>
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell text-muted-foreground text-sm">
                      {format(new Date(entry.createdAt), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-12 text-muted-foreground">
              No records found for this category.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
