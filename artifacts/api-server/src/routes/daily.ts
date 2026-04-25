import { Router } from "express";

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
  return res.json({ word, date: today, hint: null });
});

export default router;
