import { useState, useEffect } from 'react';
import {
  collection,
  setDoc,
  updateDoc,
  doc,
  query,
  getDocs,
  orderBy,
  getDoc,
} from 'firebase/firestore';
import { POLYGON_KEY } from 'react-native-dotenv';
import usePortfolioViewModel from '@/viewmodels/PortfolioViewModel';
import { auth, firestore } from '@/firebaseConfig';
import { NewsArticle } from '@/models/NewsArticle';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

export const useNewsViewModel = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { stocks } = usePortfolioViewModel(); // List of stocks

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          console.error('User is not authenticated.');
          setLoading(false);
          return;
        }
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const promises = stocks.map(async (stock) => {
          if (!stock || !stock.symbol) {
            console.error(`Invalid stock object:`, stock);
            return;
          }
          const stockRef = doc(firestore, `users/${userId}/stocks/${stock.symbol}`);
          const newsRef = collection(firestore, `users/${userId}/stocks/${stock.symbol}/News`);
          // Fetch existing articles and the lastNewsUpdate timestamp from Firestore
          const stockDoc = await getDoc(stockRef);
          const lastNewsUpdate = stockDoc.exists() && stockDoc.data().lastNewsUpdate ? new Date(stockDoc.data().lastNewsUpdate).getTime() : 0;
          let existingArticles: NewsArticle[] = [];
          if (now - lastNewsUpdate > oneDay) {
            // Fetch new articles
            const response = await fetch(
              `https://api.polygon.io/v2/reference/news?ticker=${stock.symbol}&limit=4&apiKey=${POLYGON_KEY}`
            );
            const data = await response.json();
            if (data.results) {
              const newArticles = data.results.map((article: any) => ({
                title: article.title,
                publisher: article.publisher?.name || 'Unknown',
                published_utc: article.published_utc,
                ticker: stock.symbol,
                sentiment: article.insights?.[0]?.sentiment || 'neutral',
                image_url: article.image_url,
                url: article.article_url,
              }));
              // Fetch existing articles from Firestore
              const existingDocs = await getDocs(query(newsRef, orderBy('published_utc', 'desc')));
              existingArticles = existingDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() } as unknown as NewsArticle));
              // Filter out new articles that are duplicates
              const uniqueArticles = newArticles.filter(
                (newArticle: { title: string; published_utc: string }) =>
                  !existingArticles.some(
                    (existingArticle) =>
                      existingArticle.title === newArticle.title &&
                      existingArticle.published_utc === newArticle.published_utc
                  )
              );
              // Merge unique new articles with existing articles, limit to the most recent 4
              const mergedArticles = [...uniqueArticles, ...existingArticles]
                .sort((a, b) => new Date(b.published_utc).getTime() - new Date(a.published_utc).getTime())
                .slice(0, 4);
              // Save new unique articles to Firestore using URL as document ID
              for (const article of uniqueArticles) {
                const articleDocRef = doc(newsRef, article.title); // Use Title as document ID
                try {
                  await setDoc(articleDocRef, article, { merge: true });
                  console.log(`Successfully added article: ${article.title}`);
                } catch (err) {
                  console.error(`Error saving article to Firestore:`, err);
                }
              }
              // Update lastNewsUpdate in Firestore stock document
              try {
                await updateDoc(stockRef, { lastNewsUpdate: new Date().toISOString() });
                console.log(`Updated lastNewsUpdate for ${stock.symbol}`);
              } catch (err) {
                console.error(`Error updating lastNewsUpdate for ${stock.symbol}:`, err);
              }
              // Update state with merged articles
              setNewsArticles((prevArticles) => {
                const updatedArticles = [...prevArticles, ...mergedArticles];
                return updatedArticles.filter(
                  (article, index, self) =>
                    index === self.findIndex((a) => a.title === article.title && a.published_utc === article.published_utc)
                );
              });
            }
          } else {
            // Fetch existing articles if no new data is fetched
            const existingDocs = await getDocs(query(newsRef, orderBy('published_utc', 'desc')));
            existingArticles = existingDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() } as unknown as NewsArticle));
            setNewsArticles((prevArticles) => {
              const updatedArticles = [...prevArticles, ...existingArticles];
              return updatedArticles.filter(
                (article, index, self) =>
                  index === self.findIndex((a) => a.title === article.title && a.published_utc === article.published_utc)
              );
            });
          }
        });
        // Wait for all promises to complete
        await Promise.all(promises);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [stocks]);

  // Flatten articles to simplify consuming them
  const flattenedArticles = newsArticles.sort(
    (a, b) => new Date(b.published_utc).getTime() - new Date(a.published_utc).getTime()
  );

  const OpenLinkInApp = async (url: string) => {
    if (Platform.OS !== 'web') {
      await WebBrowser.openBrowserAsync(url);
    }
  };

  // Helper to get the border color based on sentiment
  const getBorderColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '#00C803';
      case 'negative':
        return '#FF5A87';
      default:
        return 'grey';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInMs = now.getTime() - publishedDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  return { newsArticles: flattenedArticles, loading, OpenLinkInApp, getBorderColor, getTimeAgo };
};