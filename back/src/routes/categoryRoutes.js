import { Router } from "express";
import { getAllCategories, getArticlesByCategoryIds} from "../controllers/categoryController.js"; 

const categoryRouter = Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/articles", getArticlesByCategoryIds);

export default categoryRouter;