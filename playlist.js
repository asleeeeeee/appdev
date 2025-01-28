import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  View,
  ActivityIndicator,
  Animated,
} from 'react-native';

const Playlist = ({ route, navigation }) => {
  const { member } = route.params; // Get the selected member from route params
  const [songs, setSongs] = useState([]); // Holds the song list
  const [loading, setLoading] = useState(false); // Loading state to handle API requests
  const [nextPageToken, setNextPageToken] = useState(null); // For paginated API results
  const fadeAnim = new Animated.Value(0); // For fade-in effect on the screen

  useEffect(() => {
    fetchSongs();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Function to fetch songs from the YouTube API
  const fetchSongs = () => {
    if (loading) return;

    setLoading(true);
    const apiKey = 'AIzaSyC_HdI3_gQ8WjcORix4NCM4CZiuzMvoIR0';
    const playlistId = 'PLo9asGQPwSYSjf3uHpD3oSe0TbhAwLiih'; // Update with your playlist ID
    const url = nextPageToken
      ? `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${apiKey}&pageToken=${nextPageToken}&maxResults=10`
      : `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${apiKey}&maxResults=10`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.items) {
          const newSongs = data.items.map((item) => ({
            title: item.snippet.title,
            videoId: item.snippet.resourceId.videoId,
          }));
          setSongs((prev) => [...prev, ...newSongs]); // Add new songs to existing songs
          setNextPageToken(data.nextPageToken); // Set the next page token for pagination
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching songs:', error);
        setLoading(false);
      });
  };

  return (
    <ImageBackground
      source={require('./assets/background.jpg')} // Ensure the correct image path
      style={styles.backgroundImage}
      blurRadius={5}
    >
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View style={styles.playlistContainer}>
          <ScrollView contentContainerStyle={styles.playlist}>
            {songs.length > 0 ? (
              songs.map((song, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.songItem}
                  onPress={() =>
                    navigation.navigate('Player', { song, memberImage: member.image })
                  }
                >
                  <Text style={styles.songTitle}>{song.title}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noSongsText}>No songs available.</Text>
            )}

            {loading && <ActivityIndicator size="large" color="#fff" />}
          </ScrollView>
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  playlistContainer: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlist: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  songItem: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // White with transparency
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    width: '100%',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  
});

export default Playlist;
