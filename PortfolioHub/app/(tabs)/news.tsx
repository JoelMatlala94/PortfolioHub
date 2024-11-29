import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { useNewsViewModel } from '@/viewmodels/NewsViewModel';
import { useTheme } from '@/contexts/ThemeContext';
import { getHeaderHeight } from '@/hooks/getHeaderHeight';

const NewsTab = () => {
  const { newsArticles, loading } = useNewsViewModel();
  const headerHeight = getHeaderHeight();
  const { currentThemeAttributes } = useTheme();

  const openArticle = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  if (loading) {
    return (
      <View style={[styles.loaderContainer, {backgroundColor: currentThemeAttributes.backgroundColor}]}>
        <ActivityIndicator size="large" color={currentThemeAttributes.textColor} />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: currentThemeAttributes.backgroundColor }}>
      <ScrollView contentContainerStyle={[styles.container, {backgroundColor: currentThemeAttributes.backgroundColor}]}>
        <Text style={[styles.title, {color: currentThemeAttributes.textColor, paddingTop: headerHeight, textShadowColor: currentThemeAttributes.textShadowColor}]}>
          Latest Fortune 500 News
        </Text>
        {newsArticles.length > 0 ? (
          newsArticles.map((article, index) => (
            <TouchableOpacity key={index} onPress={() => openArticle(article.url)}>
              <View style={[styles.articleContainer, {backgroundColor: currentThemeAttributes.backgroundColor}]}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleDescription}>{article.description}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noArticles}>No news articles available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  articleContainer: {
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
  },
});

export default NewsTab;