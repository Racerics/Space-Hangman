import GamePage from "./game";
import { useGetDailyLeaderboard } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DailyChallenge() {
  const { data: leaderboard, isLoading } = useGetDailyLeaderboard();

  return (
    <div className="flex flex-col max-w-7xl mx-auto w-full gap-12 pb-12">
      <div className="text-center mt-8">
        <h1 className="text-3xl font-bold text-secondary glow-text">DAILY TRANSMISSION</h1>
        <p className="text-muted-foreground mt-2">Every operative receives the same signal today. Make it count.</p>
      </div>

      <GamePage mode="daily" />

      <div className="px-4">
        <Card className="border-primary/20 bg-card/40 backdrop-blur-sm glow-box">
          <CardHeader>
            <CardTitle className="text-2xl text-primary font-mono tracking-wider">Today's Top Operatives</CardTitle>
            <CardDescription>Only the best make the daily board</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8 text-muted-foreground">Loading leaderboard...</div>
            ) : leaderboard?.length ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30 hover:bg-transparent">
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Operative</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Streak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((entry, index) => (
                    <TableRow key={entry.id} className="border-border/10 hover:bg-white/5 transition-colors">
                      <TableCell className="font-mono text-muted-foreground">
                        #{index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-primary/30">
                            <AvatarImage src={entry.userAvatar || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {entry.userName?.substring(0, 2).toUpperCase() || "OP"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{entry.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-secondary glow-text">{entry.score}</TableCell>
                      <TableCell className="text-right font-mono text-primary">{entry.streak}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-8 text-muted-foreground border border-dashed border-border/30 rounded-lg">
                No transmissions recorded today. Be the first.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
