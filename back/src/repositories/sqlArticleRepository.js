import { pool } from "../utils/database.js";

// Get all articles
export async function getArticles() {
    const [rows] = await pool.query("select a.*,j.name as journalist, group_concat(c.name) as categoryNames from articles a join journalists j on a.journalistId = j.id join articles_categories ac on a.id = ac.articleId join categories c on c.id = ac.categoryId group by a.id");
    return rows;
}

// Get one article by ID
export async function getArticleById(id) {
    const [row] = await pool.query("select a.*,j.name as journalist, group_concat(c.name) as categoryNames from articles a join journalists j on a.journalistId = j.id join articles_categories ac on a.id = ac.articleId join categories c on c.id = ac.categoryId where a.id = ?", [id]);
    return row[0];
}

// Create a new article
export async function createArticle(article) {
    const { title, content, journalist, category } = article;
    const [result] = await pool.query("insert into articles (title, content, journalist, category) values (?, ?, ?, ?)", [title, content, journalist, category]);
    return { id: result.insertId, ...article }
}

// Update an article by ID
export async function updateArticle(id, updatedData) {
    const { title, content, journalist, category } = updatedData;
    await pool.query("update articles set title = ?, content = ?, journalist = ?, category = ? where id = ?", [title, content, journalist, category,id]);
    return { id, ...updatedData };
}

// Delete an article by ID
export async function deleteArticle(id) {
    await pool.query("delete from articles where id = ?", [id]);
    return true;
}

export async function getArticlesByJournalistId(journalistId) {
    const [rows] = await pool.query("select a.*, j.name as journalist, group_concat(c.name) as categoryNames from articles a join journalists j on a.journalistId = j.id join articles_categories ac on a.id = ac.articleId join categories c on c.id = ac.categoryId where j.id = ? group by a.id", [journalistId]);
    return rows;
}