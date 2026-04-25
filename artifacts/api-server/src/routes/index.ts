import { Router, type IRouter } from "express";
import healthRouter from "./health";
import scoresRouter from "./scores";
import wordsRouter from "./words";
import dailyRouter from "./daily";

const router: IRouter = Router();

router.use(healthRouter);
router.use(scoresRouter);
router.use(wordsRouter);
router.use(dailyRouter);

export default router;
