import { useState, useEffect } from 'react';
import { NewsArticle } from '@/models/NewsArticle';
import { POLYGON_KEY } from 'react-native-dotenv';
import usePortfolioViewModel from '@/viewmodels/PortfolioViewModel';

interface CachedNews {
  articles: NewsArticle[];
  lastFetched: number; // Timestamp of the last fetch
}

export const useNewsViewModel = () => {
  const [newsArticles, setNewsArticles] = useState<{ [ticker: string]: CachedNews }>({});
  const [loading, setLoading] = useState(true);
  const { stocks } = usePortfolioViewModel(); // List of stocks

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const updatedArticles = { ...newsArticles }; // Copy current state
        const now = Date.now();
        // Fetch news only for new or stale stocks
        const promises = stocks.map(async (stock) => {
          const cachedData = updatedArticles[stock.symbol];
          const isStale = !cachedData || now - cachedData.lastFetched > 24 * 60 * 60 * 1000;
          if (isStale) {
            const response = await fetch(
              `https://api.polygon.io/v2/reference/news?ticker=${stock.symbol}&limit=5&apiKey=${POLYGON_KEY}`
            );
            const data = await response.json();
            if (data.results) {
              updatedArticles[stock.symbol] = {
                articles: data.results.map((article: any) => {
                  // Find the insight object that matches the stock symbol
                  const matchingInsight = article.insights?.find(
                    (insight: any) => insight.ticker === stock.symbol
                  );
                  return {
                    title: article.title,
                    publisher: article.publisher.name,
                    published_utc: article.published_utc,
                    ticker: stock.symbol,
                    sentiment: matchingInsight?.sentiment || 'neutral',
                    image_url: article.image_url,
                    url: article.article_url,
                  };
                }),
                lastFetched: now, // Update fetch time
              };
            }
          }
        });
        // Wait for all promises to complete
        await Promise.all(promises);
        setNewsArticles(updatedArticles); // Update state with new data
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [stocks]);

  // Flatten articles to simplify consuming them
  const flattenedArticles = Object.values(newsArticles)
    .flatMap((cache) => cache.articles)
    .sort((a, b) => new Date(b.published_utc).getTime() - new Date(a.published_utc).getTime());

  return { newsArticles: flattenedArticles, loading };
};