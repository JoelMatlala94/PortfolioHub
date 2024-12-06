import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNewsViewModel } from '@/viewmodels/NewsViewModel';
import { useTheme } from '@/contexts/ThemeContext';
import { getHeaderHeight } from '@/hooks/getHeaderHeight';

const NewsTab = () => {
  const { loading, newsArticles, OpenLinkInApp, getBorderColor, getTimeAgo } = useNewsViewModel();
  const { currentThemeAttributes } = useTheme();
  const [showContent, setShowContent] = useState(false); // New state to manage showing content

  // Flatten and sort articles by latest published date
  const sortedArticles = Object.values(newsArticles)
    .flat()
    .sort((a, b) => new Date(b.published_utc).getTime() - new Date(a.published_utc).getTime());

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500); // Loading duration
    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [loading]);

  if (loading || !showContent) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: currentThemeAttributes.backgroundColor }]}>
        <ActivityIndicator size="large" color={currentThemeAttributes.textShadowColor} />
      </View>
    );
  }
  //If there are no news articles in the articles list:
  if (sortedArticles.length === 0) {
    return (
      <View style={[styles.noArticlesContainer, { backgroundColor: currentThemeAttributes.backgroundColor }]}>
        <Text style={[styles.noArticlesText, { color: currentThemeAttributes.textColor, shadowColor: currentThemeAttributes.textShadowColor }]}>
          No News Available!
        </Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: currentThemeAttributes.backgroundColor }}>
      <ScrollView style={{ backgroundColor: currentThemeAttributes.backgroundColor, marginTop: getHeaderHeight() }}>
        <Text style={[styles.title, { color: currentThemeAttributes.textColor, borderBottomColor: currentThemeAttributes.textShadowColor }]}>Portfolio News Highlights</Text>
        {sortedArticles.map((article, index) => (
          <TouchableOpacity key={index} onPress={() => OpenLinkInApp(article.url)}>
            <View style={{ padding: 20 }}>
              <View style={[styles.articleContainer, { borderColor: getBorderColor(article.sentiment) }]}>
                <ImageBackground
                  source={{ uri: article.image_url }}
                  style={styles.articleBackground}
                  imageStyle={{ borderRadius: 8 }}
                >
                  <View style={styles.overlay}>
                    <Text style={styles.articleTitle}>{article.title.length > 134 ? article.title.substring(0, 134) + "..." : article.title}</Text>
                    <View style={styles.publisherRow}>
                      <Text style={styles.publisherName}>{article.publisher}</Text>
                    </View>
                    <Text style={styles.articleDate}>
                      {getTimeAgo(article.published_utc)}
                    </Text>
                    <Text style={styles.tickerSymbol}>{article.ticker}</Text>
                  </View>
                </ImageBackground>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noArticlesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 55,
  },
  noArticlesText: {
    fontSize: 30,
    marginVertical: 10, 
    paddingHorizontal: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  articleContainer: {
    borderWidth: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  articleBackground: {
    height: 150,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  publisherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  publisherName: {
    fontSize: 12,
    color: 'white',
  },
  articleDate: {
    fontSize: 10,
    color: 'lightgrey',
    marginTop: 5,
  },
  tickerSymbol: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    borderBottomWidth: 1,
    borderBottomStartRadius: 100,
    borderBottomEndRadius: 100,
    paddingBottom: 15,
  },
});

export default NewsTab;