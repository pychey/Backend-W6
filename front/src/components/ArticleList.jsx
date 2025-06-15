import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles, removeArticle, getCategories, getArticlesByCategoryIds } from "../services/api";
import Select from 'react-select'

//
// ArticleList component
//
export default function ArticleList() {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
    fetchAllCategories();
  }, []);

  const fetchArticlesByCategoryIds = async (categoryIds) => {
    const categoryIdsByComma = categoryIds.join(',');
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticlesByCategoryIds(categoryIdsByComma);
      setArticles(data);
    } catch (err) {
      setError("Failed to load articles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const fetchAllCategories = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setError("Failed to load articles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    setIsLoading(true);
    setError("");
    try {
      await removeArticle(id);
      await fetchArticles(); // refresh the list
    } catch (err) {
      setError("Failed to delete article.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id) => navigate(`/articles/${id}`);

  const handleEdit = (id) => navigate(`/articles/${id}/edit`);

  const handleChange = async (selectedCategories) => {
    if (selectedCategories.length > 0) await fetchArticlesByCategoryIds(selectedCategories.map(option => option.id));
    else await fetchArticles();
  };

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Select options={categories} onChange={handleChange} isSearchable={false} placeholder='Select Categories ...'
        getOptionLabel={(option) => option.name} getOptionValue={(option) => option.id} isMulti/>
      
      <div className="article-list">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={deleteArticle}
          />
        ))}
      </div>
    </>
  );
}

function ArticleCard({ article, onView, onEdit, onDelete }) {

  const nav = useNavigate();

  return (
    <div className="article-card">
      <div className="article-title">{article.title}</div>
      <div className="article-author">By <span onClick={() => nav(`/journalists/${article.journalistId}/articles`)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>{article.journalist}</span></div>

      <div className="article-actions">
        <button className="button-tertiary" onClick={() => onEdit(article.id)}>
          Edit
        </button>
        <button
          className="button-tertiary"
          onClick={() => onDelete(article.id)}
        >
          Delete
        </button>
        <button className="button-secondary" onClick={() => onView(article.id)}>
          View
        </button>
      </div>
      <div className="category-container">
        {article.categoryNames.split(',').map((category,i) => (
          <button key={i} className="button-secondary">{category}</button>
        ))}
      </div>
    </div>
  );
}
