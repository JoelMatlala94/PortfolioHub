import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import { Text, View } from '@/components/Themed';

const API_KEY = 'U9O6HDKL1PQYYUG2';
const ALPHA_VANTAGE_NEWS_URL = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${API_KEY}`;

export default function NewsScreen() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(ALPHA_VANTAGE_NEWS_URL);
        const fetchedNews = response.data.feed;
        setNews(fetchedNews || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.newsItem}>
      {item.banner_image && (
        <Image
          source={{ uri: item.banner_image }}
          style={styles.newsImage}
          resizeMode="cover"
        />
      )}
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsSource}>Source: {item.source}</Text>
      <Text style={styles.newsSummary}>{item.summary}</Text>

      {/* Make the news title or a button clickable */}
      <TouchableOpacity onPress={() => openLink(item.url)}>
        <Text style={styles.newsLink}>Read more</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>News</Text>
      <FlatList
        data={news}
        keyExtractor={(item) => item.url}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', 
    marginBottom: 20,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#555',
    marginVertical: 10,
  },
  newsItem: {
    marginBottom: 15,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', 
    marginBottom: 5,
  },
  newsSource: {
    fontStyle: 'italic',
    color: '#ccc', 
    marginBottom: 5,
  },
  newsSummary: {
    color: '#fff', 
    marginBottom: 10,
  },
  newsLink: {
    color: '#1E90FF', 
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 16,
  },
  newsImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
});
