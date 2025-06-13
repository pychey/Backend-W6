import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArticlesByJournalistId, removeArticle } from "../services/api";

//
// ArticleList component
//
export default function JournalistArticles() {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchArticlesByJournalists();
  }, []);

  const fetchArticlesByJournalists = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticlesByJournalistId(id);
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
      await fetchArticlesByJournalists();
    } catch (err) {
      setError("Failed to delete article.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id) => navigate(`/articles/${id}`);

  const handleEdit = (id) => navigate(`/articles/${id}/edit`);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2 style={{ textAlign: "center", marginTop: '20px' }}>{articles[0] && articles[0].journalist}</h2>
      
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
    </div>
  );
}
