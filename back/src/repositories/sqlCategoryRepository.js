import { pool } from "../utils/database.js";

export async function getCategories() {
    const [rows] = await pool.query("select * from categories");
    return rows;
}

export async function getArticlesByCategoryIds(categoryIds) {
    const [rows] = await pool.query(`select a.*, group_concat(c.name) as categoryNames, j.name as journalist from articles a join articles_categories ac on a.id = ac.articleId join categories c on c.id = ac.categoryId join journalists j on a.journalistId = j.id where a.id in (select a2.id from articles a2 join articles_categories ac2 on a2.id = ac2.articleId where ac2.categoryId in (${categoryIds})) group by a.id`);
    return rows;
}