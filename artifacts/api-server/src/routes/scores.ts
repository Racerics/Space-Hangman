import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, scoresTable } from "@workspace/db";
import { desc, eq, sql } from "drizzle-orm";
import { SubmitScoreBody, GetLeaderboardQueryParams } from "@workspace/api-zod";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = userId;
  next();
};

router.get("/scores", async (req, res) => {
  const parsed = GetLeaderboardQueryParams.safeParse(req.query);
  const limit = parsed.success ? (parsed.data.limit ?? 20) : 20;
  const mode = parsed.success ? parsed.data.mode : undefined;

  let query = db.select().from(scoresTable).orderBy(desc(scoresTable.score));

  if (mode && mode !== "all") {
    const entries = await db
      .select()
      .from(scoresTable)
      .where(eq(scoresTable.mode, mode))
      .orderBy(desc(scoresTable.score))
      .limit(limit);
    return res.json(entries.map(formatScore));
  }

  const entries = await db
    .select()
    .from(scoresTable)
    .orderBy(desc(scoresTable.score))
    .limit(limit);

  return res.json(entries.map(formatScore));
});

router.post("/scores", requireAuth, async (req, res) => {
  const parsed = SubmitScoreBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid body", details: parsed.error });
  }

  const userId = req.userId as string;
  const data = parsed.data;

  const [entry] = await db
    .insert(scoresTable)
    .values({
      userId,
      userName: data.userName,
      userAvatar: data.userAvatar ?? null,
      score: data.score,
      streak: data.streak,
      word: data.word,
      mode: data.mode,
      won: data.won,
    })
    .returning();

  return res.status(201).json(formatScore(entry));
});

router.get("/scores/me", requireAuth, async (req, res) => {
  const userId = req.userId as string;
  const entries = await db
    .select()
    .from(scoresTable)
    .where(eq(scoresTable.userId, userId))
    .orderBy(desc(scoresTable.createdAt))
    .limit(50);
  return res.json(entries.map(formatScore));
});

router.get("/scores/stats", async (_req, res) => {
  const stats = await db
    .select({
      totalGames: sql<number>`count(*)::int`,
      topScore: sql<number>`max(score)::int`,
      averageScore: sql<number>`avg(score)::float`,
      totalPlayers: sql<number>`count(distinct user_id)::int`,
    })
    .from(scoresTable);

  const row = stats[0];
  return res.json({
    totalGames: row?.totalGames ?? 0,
    topScore: row?.topScore ?? 0,
    averageScore: row?.averageScore ?? 0,
    totalPlayers: row?.totalPlayers ?? 0,
  });
});

function formatScore(entry: typeof scoresTable.$inferSelect) {
  return {
    id: entry.id,
    userId: entry.userId,
    userName: entry.userName,
    userAvatar: entry.userAvatar ?? null,
    score: entry.score,
    streak: entry.streak,
    word: entry.word,
    mode: entry.mode,
    won: entry.won,
    createdAt: entry.createdAt.toISOString(),
  };
}

export default router;
