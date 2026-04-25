import { useState, useEffect } from "react";
import { firestore } from "@/lib/firebase";
import {
  collection, query, orderBy, limit, where,
  getDocs, getCountFromServer,
} from "firebase/firestore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, Trophy, Target, TargetIcon } from "lucide-react";
import { format } from "date-fns";

type Mode = "all" | "solo" | "daily";

interface ScoreEntry {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  score: number;
  streak: number;
  word: string;
  mode: string;
  won: boolean;
  createdAt: Date;
}

interface Stats {
  totalPlayers: number;
  totalGames: number;
  topScore: number;
  avgScore: number;
}

export default function Leaderboard() {
  const [mode, setMode] = useState<Mode>("all");
  const [entries, setEntries] = useState<ScoreEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    setLoading(true);
    const scoresRef = collection(firestore, "scores");
    let q = mode === "all"
      ? query(scoresRef, orderBy("score", "desc"), limit(50))
      : query(scoresRef, where("mode", "==", mode), orderBy("score", "desc"), limit(50));

    getDocs(q).then((snap) => {
      setEntries(snap.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          userId: d.userId,
          userName: d.userName,
          userAvatar: d.userAvatar ?? null,
          score: d.score,
          streak: d.streak,
          word: d.word,
          mode: d.mode,
          won: d.won,
          createdAt: d.createdAt?.toDate?.() ?? new Date(),
        };
      }));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [mode]);

  useEffect(() => {
    setLoadingStats(true);
    const scoresRef = collection(firestore, "scores");

    Promise.all([
      getDocs(query(scoresRef, orderBy("score", "desc"), limit(1))),
      getCountFromServer(scoresRef),
      getDocs(query(scoresRef, orderBy("score", "desc"), limit(200))),
    ]).then(([topSnap, countSnap, allSnap]) => {
      const topScore = topSnap.docs[0]?.data()?.score ?? 0;
      const totalGames = countSnap.data().count;
      const scores = allSnap.docs.map((d) => d.data().score as number);
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const userIds = new Set(allSnap.docs.map((d) => d.data().userId));
      setStats({ totalPlayers: userIds.size, totalGames, topScore, avgScore });
      setLoadingStats(false);
    }).catch(() => setLoadingStats(false));
  }, []);

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 flex flex-col gap-8">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold tracking-tighter text-primary" style={{ textShadow: "0 0 20px rgba(168,85,247,0.6)" }}>
          GALACTIC ARCHIVES
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm uppercase tracking-widest">Hall of Fame</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/40 backdrop-blur border-border/50">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Users className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Total Operatives</p>
            <p className="text-2xl font-mono text-white">
              {loadingStats ? <Loader2 className="w-5 h-5 animate-spin" /> : stats?.totalPlayers ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur border-border/50">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <TargetIcon className="w-8 h-8 text-secondary mb-2" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Missions Logged</p>
            <p className="text-2xl font-mono text-white">
              {loadingStats ? <Loader2 className="w-5 h-5 animate-spin" /> : stats?.totalGames ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur border-primary/30" style={{ boxShadow: "0 0 15px rgba(168,85,247,0.2)" }}>
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Trophy className="w-8 h-8 text-primary mb-2" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Highest Score</p>
            <p className="text-2xl font-mono text-primary" style={{ textShadow: "0 0 10px currentColor" }}>
              {loadingStats ? <Loader2 className="w-5 h-5 animate-spin" /> : stats?.topScore ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur border-border/50">
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Target className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Avg Score</p>
            <p className="text-2xl font-mono text-white">
              {loadingStats ? <Loader2 className="w-5 h-5 animate-spin" /> : stats?.avgScore ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/60 backdrop-blur-md border-border/40 overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between border-b border-border/20 pb-6 gap-4">
          <CardTitle className="font-mono tracking-wider">Top Transmissions</CardTitle>
          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3 bg-background/50 border border-border/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">All Time</TabsTrigger>
              <TabsTrigger value="solo" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Solo</TabsTrigger>
              <TabsTrigger value="daily" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Daily</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-primary gap-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="font-mono text-sm animate-pulse">Accessing archives...</p>
            </div>
          ) : entries.length ? (
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
                {entries.map((entry, index) => (
                  <TableRow key={entry.id} className="border-border/10 hover:bg-white/5 transition-colors">
                    <TableCell className="text-center font-mono">
                      {index === 0 ? <span className="text-yellow-400 text-xl">1</span> :
                       index === 1 ? <span className="text-gray-300 text-lg">2</span> :
                       index === 2 ? <span className="text-amber-600 text-lg">3</span> :
                       <span className="text-muted-foreground">{index + 1}</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className={`h-8 w-8 border ${index < 3 ? "border-primary" : "border-border/50"}`}>
                          <AvatarImage src={entry.userAvatar || undefined} />
                          <AvatarFallback className="bg-background text-xs">
                            {entry.userName?.substring(0, 2).toUpperCase() || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <span className={`font-medium ${index === 0 ? "text-primary font-bold" : ""}`}>{entry.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-secondary">{entry.score}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{entry.streak}</TableCell>
                    <TableCell className="text-right hidden sm:table-cell">
                      <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider ${entry.mode === "daily" ? "bg-secondary/20 text-secondary border border-secondary/30" : "bg-primary/10 text-primary border border-primary/20"}`}>
                        {entry.mode}
                      </span>
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell text-muted-foreground text-sm">
                      {format(entry.createdAt, "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-12 text-muted-foreground">
              No records found. Be the first to complete a mission!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
