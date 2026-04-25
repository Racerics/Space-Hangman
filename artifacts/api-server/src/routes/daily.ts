import { Router } from "express";
import { db, scoresTable } from "@workspace/db";
import { eq, desc, and, gte, lt } from "drizzle-orm";

const router = Router();

const DAILY_WORDS = [
  "nebula", "galaxy", "quasar", "pulsar", "asteroid", "comet", "supernova",
  "photon", "cosmos", "eclipse", "orbit", "singularity", "wormhole", "redshift",
  "parallax", "magnetar", "parsec", "aurora", "entropy", "quantum", "neutron",
  "corona", "accretion", "binary", "perihelion", "aphelion", "chromosphere",
  "ionosphere", "exosphere", "thermosphere", "antimatter", "relativity",
  "wavelength", "frequency", "amplitude", "resonance", "momentum", "velocity",
  "electron", "proton", "isotope", "catalyst", "polymer", "osmosis",
  "mitosis", "photosynthesis", "inertia", "friction", "spectrum", "plasma",
];

function getDailyWord(): string {
  const today = new Date().toDateString();
  const hash = [...today].reduce((a, c) => a + c.charCodeAt(0), 0);
  return DAILY_WORDS[hash % DAILY_WORDS.length];
}

router.get("/daily", (_req, res) => {
  const word = getDailyWord();
  const today = new Date().toISOString().split("T")[0];

  return res.json({
    word,
    date: today,
    hint: null,
  });
});

router.get("/daily/leaderboard", async (_req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const entries = await db
    .select()
    .from(scoresTable)
    .where(
      and(
        eq(scoresTable.mode, "daily"),
        gte(scoresTable.createdAt, startOfDay),
        lt(scoresTable.createdAt, endOfDay),
      ),
    )
    .orderBy(desc(scoresTable.score))
    .limit(20);

  return res.json(
    entries.map((e) => ({
      id: e.id,
      userId: e.userId,
      userName: e.userName,
      userAvatar: e.userAvatar ?? null,
      score: e.score,
      streak: e.streak,
      word: e.word,
      mode: e.mode,
      won: e.won,
      createdAt: e.createdAt.toISOString(),
    })),
  );
});

export default router;
