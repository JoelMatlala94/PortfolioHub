import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

const API_KEY = '2GSU1KK6959SOM26'; // Replace with your actual API key

const NewsTab = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${API_KEY}`);
        const data = await response.json();
        setNewsArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Latest News</Text>

      {newsArticles.length > 0 ? (
        newsArticles.map((article, index) => (
          <View key={index} style={styles.articleContainer}>
            <Text style={styles.articleTitle}>{article.title}</Text>
            <Text style={styles.articleDescription}>{article.description}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noArticles}>No news articles available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'flex-start', // Align items to the start
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
  },
  articleContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%', // Make sure articles take full width
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  articleDescription: {
    fontSize: 14,
    marginTop: 5,
    color: '#495057',
  },
  noArticles: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});

export default NewsTab;
