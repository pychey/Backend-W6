import { Router } from "express";
import { getArticlesByJournalistId } from "../controllers/articleController.js"; 

const journalistRouter = Router();

journalistRouter.get("/:id/articles", getArticlesByJournalistId);

export default journalistRouter;