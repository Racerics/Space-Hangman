import { Router } from "express";

const router = Router();

const WORD_CATEGORIES: Record<string, string[]> = {
  space: [
    "nebula", "galaxy", "quasar", "pulsar", "asteroid", "comet", "supernova",
    "photon", "cosmos", "eclipse", "orbit", "solstice", "equinox", "zenith",
    "apogee", "perigee", "parallax", "perihelion", "aphelion", "umbra",
    "corona", "chromosphere", "magnetar", "wormhole", "singularity", "redshift",
    "blueshift", "spectrum", "protostar", "neutron", "plasma", "radiation",
    "accretion", "binary", "parsec", "lightyear", "vacuum", "gravity",
    "thermosphere", "stratosphere", "exosphere", "ionosphere", "aurora",
  ],
  planets: [
    "mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus",
    "neptune", "pluto", "europa", "titan", "ganymede", "callisto", "io",
    "deimos", "phobos", "charon", "triton", "enceladus", "oberon",
  ],
  science: [
    "quantum", "antimatter", "relativity", "entropy", "velocity",
    "momentum", "friction", "inertia", "resonance", "wavelength",
    "frequency", "amplitude", "photosynthesis", "mitosis", "osmosis",
    "catalyst", "polymer", "isotope", "electron", "proton",
  ],
};

const ALL_WORDS = Object.values(WORD_CATEGORIES).flat();

router.get("/words", (req, res) => {
  const category = req.query.category as string | undefined;

  let words: string[];
  if (category && WORD_CATEGORIES[category]) {
    words = WORD_CATEGORIES[category];
  } else {
    words = ALL_WORDS;
  }

  // Shuffle and return up to 30
  const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 30);

  return res.json({
    words: shuffled,
    category: category ?? "all",
  });
});

export default router;
