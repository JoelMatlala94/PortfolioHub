export interface NewsArticle {
  title: string;
  publisher: string;
  published_utc: string; // Publication date in UTC format
  ticker: string; // Associated stock ticker
  sentiment: 'neutral' | 'positive' | 'negative'; // Sentiment color coding
  image_url: string; // Background image for the article
  url: string; // Article URL
}
