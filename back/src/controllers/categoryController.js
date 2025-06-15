import * as categoryRepository from "../repositories/sqlCategoryRepository.js"

export async function getAllCategories(req, res) {
  try {
    const categories = await categoryRepository.getCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getArticlesByCategoryIds(req, res) {
  try {
    const articles = await categoryRepository.getArticlesByCategoryIds(req.query.categories);
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Server error" });
  }
}
