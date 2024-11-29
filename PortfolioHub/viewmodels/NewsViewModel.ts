import { useState, useEffect } from 'react';
import { NewsArticle } from '../models/NewsArticle';

const NEWS_API_KEY = 'd4476345c2594bb59b4ff7c9678fb02d';

export const useNewsViewModel = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=stocks+OR+earnings+OR+Fortune+500&apiKey=${NEWS_API_KEY}`
        );
        const data = await response.json();

        if (data.articles && Array.isArray(data.articles)) {
          const articles: NewsArticle[] = data.articles
            .filter((article: any) => (
              article.author !== null &&
              article.content !== '[Removed]' &&
              article.description !== '[Removed]' &&
              article.title !== '[Removed]' &&
              article.url !== 'https://removed.com' &&
              article.urlToImage !== null
            ))
            .map((article: any) => ({
              title: article.title,
              description: article.description,
              url: article.url,
            }));
          setNewsArticles(articles);
        } else {
          console.error('No articles found in response:', data);
          setNewsArticles([]);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { newsArticles, loading };
};