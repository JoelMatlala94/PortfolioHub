import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useNewsViewModel } from '@/viewmodels/NewsViewModel';
import { useTheme } from '@/contexts/ThemeContext';
import { getHeaderHeight } from '@/hooks/getHeaderHeight'

const NewsTab = () => {
  const { newsArticles, loading } = useNewsViewModel();
  const { currentThemeAttributes } = useTheme();

  // Flatten and sort articles by latest published date
  const sortedArticles = Object.values(newsArticles)
    .flat()
    .sort((a, b) => new Date(b.published_utc).getTime() - new Date(a.published_utc).getTime());

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: currentThemeAttributes.backgroundColor }]}>
        <ActivityIndicator size="large" color={currentThemeAttributes.textShadowColor} />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: currentThemeAttributes.backgroundColor }}>
      <ScrollView style={{ backgroundColor: currentThemeAttributes.backgroundColor, marginTop: getHeaderHeight() }}>
      <Text style={[styles.title, {color: currentThemeAttributes.textColor}]}> Portfolio News Highlights </Text>
        {sortedArticles.map((article, index) => (
          <TouchableOpacity key={index} onPress={() => Linking.openURL(article.url)}>
            <View style={{ padding: 20 }}>
              <View style={[styles.articleContainer, { borderColor: getBorderColor(article.sentiment) }]}>
                <ImageBackground
                  source={{ uri: article.image_url }}
                  style={styles.articleBackground}
                  imageStyle={{ borderRadius: 8 }}
                >
                  <View style={styles.overlay}>
                    <Text style={styles.articleTitle}>{article.title}</Text>
                    <View style={styles.publisherRow}>
                      <Text style={styles.publisherName}>{article.publisher}</Text>
                    </View>
                    <Text style={styles.articleDate}>
                      {new Date(article.published_utc).toLocaleString(undefined, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true // Or false if you prefer 24-hour format
                      })
                    }
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

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});

export default NewsTab;