import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';

const NEWS_API_KEY = 'd4476345c2594bb59b4ff7c9678fb02d';

const NewsTab = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=stocks+OR+earnings+OR+Fortune+500&apiKey=${NEWS_API_KEY}`
        );
        const data = await response.json();

        console.log('API response:', data);

        if (data.articles && Array.isArray(data.articles)) {
          setNewsArticles(data.articles);
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

  const openArticle = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Latest Fortune 500 News</Text>

      {newsArticles.length > 0 ? (
        newsArticles.map((article, index) => (
          <TouchableOpacity key={index} onPress={() => openArticle(article.url)}>
            <View style={styles.articleContainer}>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleDescription}>{article.description}</Text>
            </View>
          </TouchableOpacity>
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
    alignItems: 'flex-start',
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
    width: '100%',
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    textDecorationLine: 'underline', 
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
